const spotifyConfig = {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  scopes: [
  "user-read-currently-playing",
  "user-read-playback-state"
].join(" ")
};

module.exports = spotifyConfig;