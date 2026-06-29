const spotifyConfig = require("../config/spotifyConfig");
const url = `https://accounts.spotify.com/authorize?client_id=${spotifyConfig.clientId}&redirect_uri=${encodeURIComponent(spotifyConfig.redirectUri)}&scope=${encodeURIComponent(spotifyConfig.scopes)}&response_type=code`;

function getLoginUrl() {
    return url;
}

let accessToken = null;
let refreshToken = null;
let expiresAt = null;

async function exchangeCodeForToken(code) {
  const authHeader = Buffer.from(
    `${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`
  ).toString("base64");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: spotifyConfig.redirectUri
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Spotify token exchange failed: ${JSON.stringify(data)}`);
  }

  accessToken = data.access_token;
  refreshToken = data.refresh_token;
  expiresAt = Date.now() + data.expires_in * 1000;

  return {
    accessToken,
    refreshToken,
    expiresAt
  };
}

module.exports = {
    getLoginUrl,
    exchangeCodeForToken
};