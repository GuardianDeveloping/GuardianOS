const startingSoonService = require("../services/startingSoonService");

function handleStartingSoonRoutes(req, res, parsed) {
  if (parsed.pathname === "/starting-soon/start") {
    const minutes = parsed.query.minutes || 5;
    const status = startingSoonService.start(minutes);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, status }));

    return true;
  }

  if (parsed.pathname === "/starting-soon/hide") {
    const status = startingSoonService.hide();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, status }));

    return true;
  }

  if (parsed.pathname === "/starting-soon/status") {
    const status = startingSoonService.getStatus();

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(status));

    return true;
  }

  return false;
}

module.exports = {
  handleStartingSoonRoutes
};