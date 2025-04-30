require('dotenv').config();
const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REIDS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined
});

redis.on('connect', () => {
    console.log('Redis connected.');
});

redis.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = redis;