const alertService = require("../services/alertService");

function handleAlertRoutes(req, res, parsed) {

  if (parsed.pathname === "/alert") {

    const alert = alertService.sendAlert({
      type: String(parsed.query.type || "follow"),
      name: String(parsed.query.name || "GuardianKnight42"),
      amount: String(parsed.query.amount || "")
    });

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
      ok: true,
      alert
    }));

    return true;
  }

  if (parsed.pathname === "/test") {

    const alert = alertService.sendAlert({
      type: "follow",
      name: "GuardianKnight42"
    });

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
      ok: true,
      alert
    }));

    return true;
  }

  if (parsed.pathname === "/test/raid") {

    const alert = alertService.sendAlert({
      type: "raid",
      name: "MysticMage",
      amount: "12"
    });

    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
      ok: true,
      alert
    }));

    return true;
  }

  if (parsed.pathname === "/test/donation") {
  const alert = alertService.sendAlert({
    type: "donation",
    name: "SirGavin",
    amount: "5"
  });

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, alert }));
  return true;
}

if (parsed.pathname === "/test/sub") {
  const alert = alertService.sendAlert({
    type: "sub",
    name: "GuardianKnight42"
  });

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, alert }));
  return true;
}

if (parsed.pathname === "/test/cheer") {
  const alert = alertService.sendAlert({
    type: "cheer",
    name: "MysticMage",
    amount: "100"
  });

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, alert }));
  return true;
}



if (parsed.pathname === "/alerts/status") {
  const status = alertService.getStatus();

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(status));

  return true;
}

return false;
}



module.exports = {
  handleAlertRoutes
};