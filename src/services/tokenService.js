const fs = require("fs");
const path = require("path");

const tokenFilePath = path.join(__dirname, "..", "..", "data", "spotifyTokens.json");

function saveTokens(tokens) {
    console.log("saving spotify tokens...")
  const dataDir = path.dirname(tokenFilePath);

  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(tokenFilePath, JSON.stringify(tokens, null, 2));
}

function loadTokens() {
  if (!fs.existsSync(tokenFilePath)) {
    return null;
  }

  const rawData = fs.readFileSync(tokenFilePath, "utf-8");
  return JSON.parse(rawData);
}

module.exports = {
  saveTokens,
  loadTokens
};