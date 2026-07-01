const http = require("http");
const url = require("url");
require("dotenv").config();
const fileService = require("./services/fileService");
const alertService = require("./services/alertService");
const { PORT, publicDir } = require("./config/appConfig");
const alertRoutes = require("./routes/alertRoutes");
const musicRoutes = require("./routes/musicRoutes");
const staticRoutes = require("./routes/staticRoutes");
const spotifyRoutes = require("./routes/spotifyRoutes");
const spotifyService = require("./services/spotifyService");
const musicService = require("./services/musicService");
const startingSoonRoutes = require("./routes/startingSoonRoutes");


const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

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

  if (alertRoutes.handleAlertRoutes(req, res, parsed)) return;

  if (musicRoutes.handleMusicRoutes(req, res, parsed)) return;

  if (spotifyRoutes.handleSpotifyRoutes(req, res, parsed)) return;
  
  if (startingSoonRoutes.handleStartingSoonRoutes(req, res, parsed)) return;

  if (staticRoutes.handleStaticRoutes(res, parsed, publicDir, fileService.sendFile)){ return;}

  

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

spotifyService.startPolling();
