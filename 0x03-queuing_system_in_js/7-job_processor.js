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

// Array of blacklisted phone numbers
const blacklistedNumbers = [
  '4153518780',
  '4153518781'
];

// Function to send notification
function sendNotification(phoneNumber, message, job, done) {
  // Track the progress of the job
  job.progress(0, 100);
  console.log(`Notification job #${job.id} 0% complete`);

  // Check if the phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    // Mark the job as failed with an error message
    job.fail(new Error(`Phone number ${phoneNumber} is blacklisted`));
    console.log(`Notification job #${job.id} failed: Phone number ${phoneNumber} is blacklisted`);
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  // Track progress to 50%
  job.progress(50, 100);
  console.log(`Notification job #${job.id} 50% complete`);
  
  // Log the sending notification
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  // Complete the job
  job.complete();
  console.log(`Notification job #${job.id} completed`);
  
  done();
}

// Create a queue with Kue and process jobs
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});

console.log('Redis client connected to the server');
client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err);
});
