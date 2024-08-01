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

// Define the job data
const jobData = {
  phoneNumber: '1234567890',
  message: 'This is a test notification'
};

// Create a job
const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (err) {
      console.error('Error creating job:', err);
    } else {
      console.log(`Notification job created: ${job.id}`);
    }
  });

// Handle job events
job.on('complete', () => {
  console.log('Notification job completed');
});

job.on('failed', (err) => {
  console.log('Notification job failed:', err);
});

// Optionally, handle job progress and other events
job.on('progress', (progress) => {
  console.log(`Job progress: ${progress}%`);
});

// Optionally, handle job failure after retry
job.on('failed attempt', (errorMessage, doneAttempts) => {
  console.log(`Job failed attempt #${doneAttempts}: ${errorMessage}`);
});
