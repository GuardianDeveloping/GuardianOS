const spotifyConfig = require("../config/spotifyConfig");
const url = `https://accounts.spotify.com/authorize?client_id=${spotifyConfig.clientId}&redirect_uri=${encodeURIComponent(spotifyConfig.redirectUri)}&scope=${encodeURIComponent(spotifyConfig.scopes)}&response_type=code`;
const musicService = require("./musicService");
const alertService = require("./alertService");
const tokenService = require("./tokenService")

function getLoginUrl() {
    return url;
}

let accessToken = null;
let refreshToken = null;
let expiresAt = null;

const savedTokens = tokenService.loadTokens();

if (savedTokens) {
  accessToken = savedTokens.accessToken || null;
  refreshToken = savedTokens.refreshToken || null;
  expiresAt = savedTokens.expiresAt || null;
}

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
  
  tokenService.saveTokens({
  accessToken,
  refreshToken,
  expiresAt
});
  

  return {
    accessToken,
    refreshToken,
    expiresAt
  };
}

async function refreshAccessToken() {
  if (!refreshToken) {
    throw new Error("No Spotify refresh token saved.");
  }

  const authHeader = Buffer.from(
    `${spotifyConfig.clientId}:${spotifyConfig.clientSecret}`
  ).toString("base64");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken
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
    throw new Error(`Spotify token refresh failed: ${JSON.stringify(data)}`);
  }

  accessToken = data.access_token;
  expiresAt = Date.now() + data.expires_in * 1000;

  tokenService.saveTokens({
    accessToken,
    refreshToken,
    expiresAt
  });

  return accessToken;
}

async function getCurrentlyPlaying() {
  if (!accessToken) {
    throw new Error("Spotify is not connected yet.");
  }

  if (expiresAt && Date.now() >= expiresAt) {
  await refreshAccessToken();
}

  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Spotify currently playing failed: ${JSON.stringify(data)}`);
  }

  if (!data.item) {
    return null;
  }

  const item = data.item;
  const spotifySong = {
    isPlaying: data.is_playing,
    title: item.name,
    album: item.album.name,
    artist: item.artists.map(a => a.name).join(", "),
    albumArtUrl: item.album.images[0]?.url || null, 
    durationMs: item.duration_ms,
    progressMs: data.progress_ms
  }
  return spotifySong;

  return {
    title: data.item.name,
    artist: data.item.artists.map((artist) => artist.name).join(", "),
    album: data.item.album?.name || "",
    isPlaying: data.is_playing,
    time: Date.now()
  };

}

async function syncCurrentSong() {
  const spotifySong = await getCurrentlyPlaying();

  if (!spotifySong) {
    return null;
  }

 const nowPlaying = musicService.updateNowPlaying(
  spotifySong.title,
  spotifySong.artist,
  {
    album: spotifySong.album,
    albumArtUrl: spotifySong.albumArtUrl,
    durationMs: spotifySong.durationMs,
    progressMs: spotifySong.progressMs,
    isPlaying: spotifySong.isPlaying
  }
);

  alertService.broadcast("nowplaying", nowPlaying);

  return nowPlaying;

}

async function pollSpotify() {
  try {
    const spotifySong = await getCurrentlyPlaying();

    if (!spotifySong) return;

    const currentSong = musicService.getCurrentSong();

    const songChanged =
      currentSong.title !== spotifySong.title ||
      currentSong.artist !== spotifySong.artist;

    const nowPlaying = musicService.updateNowPlaying(
  spotifySong.title,
  spotifySong.artist,
  {
    album: spotifySong.album,
    albumArtUrl: spotifySong.albumArtUrl,
    durationMs: spotifySong.durationMs,
    progressMs: spotifySong.progressMs,
    isPlaying: spotifySong.isPlaying
  }
);

alertService.broadcast("nowplaying", nowPlaying);

    if (songChanged) {
      alertService.broadcast("nowplaying", nowPlaying);
    }
  } catch (err) {
    // Spotify may not be connected yet
  }
}

function startPolling() {
  pollSpotify(); // runs immediately
  setInterval(pollSpotify, 5000);
}

module.exports = {
  getLoginUrl,
  exchangeCodeForToken,
  getCurrentlyPlaying,
  syncCurrentSong,
  refreshAccessToken,
  startPolling
};