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
  console.log('Redis client not connected to the server:', err);
});

// Function to set a new value
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, redis.print);
}

// Function to get the value of a key
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, reply) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log(reply);
    }
  });
}

// Call the functions
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
