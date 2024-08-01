import kue from 'kue';
import redis from 'redis';

// Create a Redis client
const client = redis.createClient({
  host: '127.0.0.1', // Redis server host
  port: 6379        // Redis server port
});

// Create a Kue queue
const queue = kue.createQueue({
  redis: { 
    host: '127.0.0.1', 
    port: 6379 
  }
});

// Function to send notification
function sendNotification(phoneNumber, message) {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
}

// Define the job processor
queue.process('push_notification_code', (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message);
  done(); // Mark job as completed
});

// Handle job events
queue.on('job complete', (id, result) => {
  console.log(`Job ${id} completed`);
});

queue.on('job failed', (id, err) => {
  console.log(`Job ${id} failed with error: ${err}`);
});
