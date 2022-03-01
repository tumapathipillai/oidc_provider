const Redis = require("ioredis");

module.exports = new Redis(
  `${process.env.DB_CACHE_HOST}:${process.env.DB_CACHE_PORT}`
);
