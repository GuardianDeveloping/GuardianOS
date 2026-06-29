const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const   alertService = require("./services/alertService");
const { PORT, publicDir } = require("./config/appConfig");
const { handleAlertRoutes } = require("./routes/alertRoutes");

let nowPlaying = {
  title: "Aurelia Nights",
  artist: "Guardian Radio"
};

function contentType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".js")) return "application/javascript; charset=utf-8";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
  if (filePath.endsWith(".webm")) return "video/webm";
  if (filePath.endsWith(".mp3")) return "audio/mpeg";
  if (filePath.endsWith(".wav")) return "audio/wav";
  return "text/plain; charset=utf-8";
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType(filePath) });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  if (parsed.pathname === "/") {
    return sendFile(res, path.join(publicDir, "overlay.html"));
  }

  if (parsed.pathname === "/dashboard") {
    return sendFile(res, path.join(publicDir, "dashboard.html"));
  }

  if (parsed.pathname === "/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*"
    });

    res.write("\n");
    alertService.addClient(res);
    req.on("close", () => alertService.removeClient(res));
    return;
  }

  if (handleAlertRoutes(req, res, parsed)) return;

  if (parsed.pathname === "/nowplaying") {
    nowPlaying = {
      title: String(parsed.query.title || nowPlaying.title),
      artist: String(parsed.query.artist || nowPlaying.artist),
      time: Date.now()
    };

    alertService.broadcast("alert", alert);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, nowPlaying }));
    return;
  }

  if (parsed.pathname === "/test/music") {
    nowPlaying = { title: "Lofi Kingdom", artist: "CozyMage", time: Date.now() };
    alertService.broadcast("nowplaying", nowPlaying);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, nowPlaying }));
    return;
  }

  const safePath = path.normalize(parsed.pathname).replace(/^([.][.][/\\])+/, "");
  const filePath = path.join(publicDir, safePath);
  if (filePath.startsWith(publicDir)) return sendFile(res, filePath);

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log("");
  console.log("GuardianOS is running.");
  console.log("----------------------");
  console.log(`OBS Overlay:   http://localhost:${PORT}`);
  console.log(`Dashboard:     http://localhost:${PORT}/dashboard`);
  console.log(`Test Alert:    http://localhost:${PORT}/test`);
  console.log(`Test Raid:     http://localhost:${PORT}/test/raid`);
  console.log(`Test Music:    http://localhost:${PORT}/test/music`);
  console.log("");
});
