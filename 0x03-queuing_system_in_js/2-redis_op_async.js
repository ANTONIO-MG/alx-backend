import redis from 'redis';
import { promisify } from 'util';

// Create a Redis client
const client = redis.createClient({
  host: '127.0.0.1', // Redis server host
  port: 6379        // Redis server port
});

// Promisify the client.get method
const getAsync = promisify(client.get).bind(client);

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

// Async function to get the value of a key
async function displaySchoolValue(schoolName) {
  try {
    const reply = await getAsync(schoolName);
    console.log(reply);
  } catch (err) {
    console.error('Error:', err);
  }
}
  
// Call the functions
(async () => {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
})();
