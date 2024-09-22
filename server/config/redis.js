require("dotenv").config();
const Redis = require("ioredis")

const redis = new Redis({
    port: 10094, // Redis port
    host:  process.env.REDIS_KEY,// Redis host
    password: process.env.REDIS_PASSWORD, // needs Redis >= 6
    // password: "my-top-secret",
    // db: 0, // Defaults to 0
})

module.exports = redis