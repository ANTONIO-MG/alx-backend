import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

const queue = kue.createQueue();

describe('createPushNotificationsJobs', () => {
  beforeEach((done) => {
    // Enter test mode and clear the queue before each test
    queue.testMode.enter();
    queue.testMode.clear(() => {
      done();
    });
  });

  afterEach((done) => {
    // Exit test mode after each test
    queue.testMode.exit(() => {
      done();
    });
  });

  it('should display an error message if jobs is not an array', () => {
    try {
      createPushNotificationsJobs({}, queue);
    } catch (error) {
      console.log(error.message); // Expected output: Jobs is not an array
    }
  });

  it('should create jobs to the queue', () => {
    const list = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account',
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account',
      },
    ];

    createPushNotificationsJobs(list, queue);

    // Check that jobs are created in the queue
    const jobs = queue.testMode.jobs;
    console.log(`Notification job created: ${jobs.length}`);
    jobs.forEach(job => {
      console.log(`Notification job created: ${job.id}`);
    });

    // Assertions
    jobs.should.have.lengthOf(2); // Check that exactly 2 jobs are created
    jobs.forEach((job) => {
      job.data.should.have.property('phoneNumber');
      job.data.should.have.property('message');
    });
  });
});
