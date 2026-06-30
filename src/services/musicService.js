let nowPlaying = {
  title: "Aurelia Nights",
  artist: "Guardian Radio",
  time: Date.now()
};

function updateNowPlaying(title, artist, extra = {}) {
  nowPlaying = {
    title: String(title || nowPlaying.title),
    artist: String(artist || nowPlaying.artist),
    time: Date.now(),
    ...extra
  };

  return nowPlaying;
}

function getCurrentSong() {
  return nowPlaying;
}

module.exports = {
  updateNowPlaying,
  getCurrentSong
};