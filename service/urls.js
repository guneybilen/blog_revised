require("dotenv").config();

const PRODUCTION = process.env.PRODUCTION_SERVER_URL;
const DEVELOPMENT = process.env.SERVER_URL;
const URL = process.env.NODE_ENV === "production" ? PRODUCTION : DEVELOPMENT;

module.exports = { URL };
