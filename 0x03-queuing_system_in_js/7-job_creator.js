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

// Array of jobs
const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153518743',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153538781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153118782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4159518782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4158718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153818782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4154318781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4151218782',
    message: 'This is the code 4321 to verify your account'
  }
];

// Create jobs in the queue
jobs.forEach((jobData) => {
  const job = queue.create('push_notification_code_2', jobData);

  job
    .save((err) => {
      if (err) {
        console.error('Error creating job:', err);
      } else {
        console.log(`Notification job created: ${job.id}`);
      }
    })
    .on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    })
    .on('failed', (errorMessage) => {
      console.log(`Notification job ${job.id} failed: ${errorMessage}`);
    })
    .on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });
});
