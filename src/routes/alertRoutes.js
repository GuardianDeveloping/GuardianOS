const alertService = require("../services/alertService");

function handleAlertRoutes(req, res, parsed) {
  if (parsed.pathname === "/alert") {
    const alert = {
      type: String(parsed.query.type || "follow"),
      name: String(parsed.query.name || "GuardianKnight42"),
      amount: String(parsed.query.amount || ""),
      time: Date.now()
    };

    alertService.broadcast("alert", alert);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, alert }));
    return true;
  }

  if (parsed.pathname === "/test") {
    alertService.broadcast("alert", {
      type: "follow",
      name: "GuardianKnight42",
      time: Date.now()
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, message: "Test alert sent" }));
    return true;
  }

  if (parsed.pathname === "/test/raid") {
    alertService.broadcast("alert", {
      type: "raid",
      name: "MysticMage",
      amount: "12",
      time: Date.now()
    });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, message: "Test raid sent" }));
    return true;
  }

  return false;
}

module.exports = {
  handleAlertRoutes
};