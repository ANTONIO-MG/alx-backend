import redis from "redis";

const client = redis.createClient({
  host: '127.0.0.1', // Redis server host
  port: 6379        // Redis server port
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err);
});
