const alertService = require("../services/alertService");
const musicService = require("../services/musicService");


function handleMusicRoutes(req, res, parsed) {
    if (parsed.pathname === "/nowplaying") {
   const nowPlaying = musicService.updateNowPlaying(
  parsed.query.title,
  parsed.query.artist
);

    alertService.broadcast("nowplaying", nowPlaying)
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, nowPlaying }));
    return true;
    }

    if (parsed.pathname === "/test/music") {
      const nowPlaying = musicService.updateNowPlaying(
  "Lofi Kingdom",
  "CozyMage"
);
        alertService.broadcast("nowplaying", nowPlaying);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, nowPlaying }));
        return true;
    }

    return false;
}

module.exports = {
  handleMusicRoutes
};