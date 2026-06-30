const alertBox = document.getElementById("alert");
const alertTitle = document.getElementById("alertTitle");
const alertName = document.getElementById("alertName");
const alertAmount = document.getElementById("alertAmount");
const alertIcon = document.getElementById("alertIcon");

const nowPlaying = document.getElementById("nowPlaying");
const npTitle = document.getElementById("npTitle");
const npArtist = document.getElementById("npArtist");
const npAlbum = document.getElementById("npAlbum");
const npAlbumArt = document.getElementById("npAlbumArt");
const progressFill = document.getElementById("npProgressFill");
const elapsed = document.getElementById("npElapsed");
const duration = document.getElementById("npDuration");
const info = document.querySelector(".np-info");
const vinyl = document.querySelector(".vinyl");
const tonearm = document.getElementById("tonearm");
let progressTimer = null;

const alertTypes = {
  follow: { title: "A NEW GUARDIAN ARRIVES", icon: "🛡️" },
  sub: { title: "A GUARDIAN JOINS THE ORDER", icon: "👑" },
  gift: { title: "A GIFT HAS BEEN BESTOWED", icon: "🎁" },
  raid: { title: "GUARDIANS HAVE ARRIVED", icon: "⚔️" },
  bits: { title: "MAGICAL ESSENCE RECEIVED", icon: "💎" },
  donation: { title: "A ROYAL TRIBUTE HAS BEEN OFFERED", icon: "💰" }
};

function clean(value, fallback = "") {
  if (!value || typeof value !== "string") return fallback;
  return value.replace(/[<>]/g, "").slice(0, 64);
}

function showAlert(data) {
  const type = clean(data.type, "follow").toLowerCase();
  const info = alertTypes[type] || alertTypes.follow;

  alertTitle.textContent = info.title;
  alertName.textContent = clean(data.name, "GuardianKnight42");
  alertIcon.textContent = info.icon;
  alertAmount.textContent = data.amount ? clean(data.amount) : "";

  alertBox.classList.remove("play");
  void alertBox.offsetWidth;
  alertBox.classList.add("play");
}

let lastSong = "";

function updateNowPlaying(payload) {
  nowPlaying.classList.add("show");

  npTitle.textContent = payload.title;
  npArtist.textContent = payload.artist;
  npAlbum.textContent = payload.album || "--";


if (payload.isPlaying) {
  vinyl.classList.add("playing");
  tonearm.classList.add("on");
  tonearm.classList.remove("lift");
} else {
  vinyl.classList.remove("playing");
  tonearm.classList.remove("on");
  tonearm.classList.add("lift");

  if (progressTimer) clearInterval(progressTimer);
}

if (progressTimer) clearInterval(progressTimer);

if (
  payload.isPlaying &&
  payload.durationMs &&
  payload.progressMs !== undefined
) {
  let progressMs = payload.progressMs;
  const durationMs = payload.durationMs;

  const percent = Math.min(100, (progressMs / durationMs) * 100);
  progressFill.style.width = `${percent}%`;
  elapsed.textContent = formatTime(progressMs);
  duration.textContent = formatTime(durationMs);

  progressTimer = setInterval(() => {
    progressMs += 100;

    const percent = Math.min(100, (progressMs / durationMs) * 100);
    progressFill.style.width = `${percent}%`;
    elapsed.textContent = formatTime(progressMs);

    if (progressMs >= durationMs) clearInterval(progressTimer);
  }, 100);
}
const songKey = `${payload.title}-${payload.artist}`;

if (songKey !== lastSong) {
  swapAlbumArt(payload.albumArtUrl);
  lastSong = songKey;
}
}
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function swapAlbumArt(url) {
  if (!url) return;

  const preloaded = new Image();

  preloaded.onload = () => {
    npAlbumArt.src = url;
    npAlbumArt.style.display = "block";

    npAlbumArt.classList.remove("change");
    void npAlbumArt.offsetWidth;
    npAlbumArt.classList.add("change");
  };

  preloaded.src = url;
}


const events = new EventSource("/events");

events.addEventListener("alert", (event) => {
  showAlert(JSON.parse(event.data));
});

events.addEventListener("nowplaying", (event) => {
  updateNowPlaying(JSON.parse(event.data));
});

events.onerror = () => {
  console.warn("GuardianOS connection lost. Retrying...");
};
