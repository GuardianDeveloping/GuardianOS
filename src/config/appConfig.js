const path = require("path");

const PORT = process.env.PORT || 3000;

const publicDir = path.join(__dirname, "..", "..", "public");

module.exports = {
  PORT,
  publicDir
};