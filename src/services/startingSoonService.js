const alertService = require("./alertService");

let startingSoon = {
  active: false,
  endsAt: null,
  durationMs: 0
};

function start(minutes = 5) {
  const durationMs = Number(minutes) * 60 * 1000;

  startingSoon = {
    active: true,
    endsAt: Date.now() + durationMs,
    durationMs
  };

  alertService.broadcast("startingsoon", startingSoon);

  return startingSoon;
}

function hide() {
  startingSoon = {
    active: false,
    endsAt: null,
    durationMs: 0
  };

  alertService.broadcast("startingsoon", startingSoon);

  return startingSoon;
}

function getStatus() {
  return startingSoon;
}

module.exports = {
  start,
  hide,
  getStatus
};