import express from 'express';
import redis from 'redis';
import kue from 'kue';
import { promisify } from 'util';

// Initialize Redis client and Kue queue
const redisClient = redis.createClient();
const queue = kue.createQueue();
const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

let reservationEnabled = true; // Reservation status

// Set initial number of available seats
(async function initializeSeats() {
  await setAsync('available_seats', 50);
})();

// Express app setup
const app = express();
const port = 1245;

// Function to reserve seats in Redis
async function reserveSeat(number) {
  await setAsync('available_seats', number);
}

// Function to get current available seats from Redis
async function getCurrentAvailableSeats() {
  const availableSeats = await getAsync('available_seats');
  return parseInt(availableSeats, 10) || 0;
}

// Route to get the number of available seats
app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: availableSeats.toString() });
});

// Route to reserve a seat
app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservations are blocked' });
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (err) {
      return res.json({ status: 'Reservation failed' });
    }
    res.json({ status: 'Reservation in process' });
  });
});

// Route to process the queue
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    try {
      const availableSeats = await getCurrentAvailableSeats();
      if (availableSeats <= 0) {
        reservationEnabled = false;
        return done(new Error('Not enough seats available'));
      }

      await reserveSeat(availableSeats - 1);
      done();
    } catch (error) {
      done(error);
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Job event listeners
queue.on('job complete', (id) => {
  console.log(`Seat reservation job ${id} completed`);
});

queue.on('job failed', (id, error) => {
  console.log(`Seat reservation job ${id} failed: ${error.message}`);
});
