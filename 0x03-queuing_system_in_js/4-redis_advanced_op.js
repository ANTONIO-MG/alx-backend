import redis from 'redis';

// Create a Redis client
const client = redis.createClient({
  host: '127.0.0.1', // Redis server host
  port: 6379        // Redis server port
});

// Handle connection events
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log('Redis client not connected to the server: ', err);
});

const schools = {
    "Portland": 50,
    "Seattle": 80,
    "New York": 20,
    "Bogota": 20,
    "Cali": 40,
    "Paris": 2
  };


// Function to set a new value
for (const [key, value] of Object.entries(schools)) {
  client.hset("HolbertonSchools", key, value, (err, res) => {
    if (err) {
      console.error('Error setting field:', err);
    } else {
      redis.print(err, res);  // Use redis.print to print the result
    }
  });
  }

  
// Function to get the value of a key
client.hgetall("HolbertonSchools", (err, reply) => {
  if (err) {
  console.error('Error:', err);
  } else {
  console.log(reply);
  }
});
