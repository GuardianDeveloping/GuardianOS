const alertBox = document.getElementById("alert");
const alertTitle = document.getElementById("alertTitle");
const alertName = document.getElementById("alertName");
const alertAmount = document.getElementById("alertAmount");
const alertIcon = document.getElementById("alertIcon");

const nowPlaying = document.getElementById("nowPlaying");
const npTitle = document.getElementById("npTitle");
const npArtist = document.getElementById("npArtist");

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

function updateNowPlaying(data) {
  npTitle.textContent = clean(data.title, "Unknown Track");
  npArtist.textContent = clean(data.artist, "Unknown Artist");

  nowPlaying.classList.remove("hidden");
  nowPlaying.classList.add("show");
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
