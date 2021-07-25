const winston = require("winston");

const {
  format: { combine, timestamp, json },
} = winston;
const console = new winston.transports.Console();

winston.configure({
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
  transports: [new winston.transports.File({ filename: "api-logs.log" })],
});

winston.add(console);
