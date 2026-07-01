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
const startingSoon = document.getElementById("startingSoon");
const startingSoonTimer = document.getElementById("startingSoonTimer");
let progressTimer = null;


const alertTypes = {
  follow: {
    icon: "📜",
    title: "A New Guardian Has Joined"
  },
  sub: {
    icon: "⭐",
    title: "Guardian Oath Sworn"
  },
  raid: {
    icon: "⚔️",
    title: "A Warband Approaches"
  },
  cheer: {
    icon: "💎",
    title: "Arcane Energy Bestowed"
  },
  donation: {
    icon: "💰",
    title: "Tribute Offered"
  }
};


function clean(value, fallback = "") {
  if (!value || typeof value !== "string") return fallback;
  return value.replace(/[<>]/g, "").slice(0, 64);
}

function showAlert(data) {
  const type = clean(data.type, "follow").toLowerCase();
  const info = alertTypes[type] || alertTypes.follow;

  // Set icon and text
  alertIcon.textContent = info.icon;
  alertTitle.textContent = info.title;
  alertName.textContent = clean(data.name, "GuardianKnight42");

  // Format the amount based on alert type
  if (type === "raid") {
  triggerRaidEffect();

    alertAmount.textContent = data.amount
      ? `${clean(data.amount)} Guardians`
      : "";
  } else if (type === "cheer") {
    alertAmount.textContent = data.amount
      ? `${clean(data.amount)} Bits`
      : "";
  } else if (type === "donation") {
    alertAmount.textContent = data.amount
      ? `$${clean(data.amount)}`
      : "";
  } else {
    alertAmount.textContent = "";
  }

  // Remove previous alert type classes
alertBox.classList.remove(
  "follow",
  "sub",
  "raid",
  "cheer",
  "donation"
);

// Add the current type
alertBox.classList.add(type);

  // Restart the animation
  alertBox.classList.remove("play");
  void alertBox.offsetWidth;
  alertBox.classList.add("play");
}
let startingSoonInterval = null;

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

function getAlertDisplay(alert) {
  const name = alert.name || "A Guardian";
  const amount = alert.amount || "";

  const displays = {
    follow: {
      icon: "📜",
      title: "A New Guardian Has Joined",
      message: `${name} has entered the realm.`
    },
    sub: {
      icon: "⭐",
      title: "Guardian Oath Sworn",
      message: `${name} has pledged their support.`
    },
    raid: {
      icon: "⚔️",
      title: "A Warband Approaches",
      message: `${name} arrives with ${amount} guardians.`
    },
    cheer: {
      icon: "💎",
      title: "Arcane Energy Bestowed",
      message: `${name} sent ${amount} bits.`
    },
    donation: {
      icon: "💰",
      title: "Tribute Offered",
      message: `${name} offered $${amount}.`
    }
  };

  return displays[alert.type] || displays.follow;
}

// =========================
// GuardianOS Boot
// =========================

// Boot variables
const bootScreen = document.getElementById("bootScreen");
const bootItems = document.querySelectorAll(".boot-item");

// Boot functions
async function playBoot(){

for (const item of bootItems) {
  await new Promise(r => setTimeout(r, 1200));

  item.classList.add("show");
  item.innerHTML = "✓ " + item.textContent;

  if (item.textContent.includes("System Ready")) {
    item.classList.add("system-ready");
    bootScreen.classList.add("ready");
    document.querySelector(".boot-status").textContent =
        "GuardianOS Online";

  }
}

await new Promise(r => setTimeout(r, 3000));

const startingSoon = document.getElementById("startingSoon");

startingSoon.classList.remove("hidden");

requestAnimationFrame(() => {
  startingSoon.classList.add("show");
});

bootScreen.style.opacity = 0;

setTimeout(() => {
  bootScreen.remove();
}, 2000);

}

playBoot();


function triggerRaidEffect() {
  document.body.classList.remove("overlay-shake");
  void document.body.offsetWidth;
  document.body.classList.add("overlay-shake");
}

const events = new EventSource("/events");

events.addEventListener("alert", (event) => {
  showAlert(JSON.parse(event.data));
});

events.addEventListener("nowplaying", (event) => {
  updateNowPlaying(JSON.parse(event.data));
});

events.addEventListener("startingsoon", (event) => {
  const data = JSON.parse(event.data);
  showStartingSoon(data);
});

function showStartingSoon(data) {
  if (startingSoonInterval) {
    clearInterval(startingSoonInterval);
  }

  if (!data.active) {
    startingSoon.classList.remove("show");
    return;
  }

  startingSoon.classList.add("show");

  function updateTimer() {
    const remainingMs = Math.max(0, data.endsAt - Date.now());
    const totalSeconds = Math.ceil(remainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    startingSoonTimer.textContent =
      `${minutes}:${String(seconds).padStart(2, "0")}`;

    if (remainingMs <= 0) {
      clearInterval(startingSoonInterval);
      startingSoon.classList.remove("show");
    }
  }

  updateTimer();
  startingSoonInterval = setInterval(updateTimer, 1000);
}

events.onerror = () => {
  console.warn("GuardianOS connection lost. Retrying...");
};
