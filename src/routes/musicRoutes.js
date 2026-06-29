const alertService = require("../services/alertService");

let nowPlaying = {
  title: "Aurelia Nights",
  artist: "Guardian Radio"
};

function handleMusicRoutes(req, res, parsed) {
    if (parsed.pathname === "/nowplaying") {
    nowPlaying = {
      title: String(parsed.query.title || nowPlaying.title),
      artist: String(parsed.query.artist || nowPlaying.artist),
      time: Date.now()
    };

    alertService.broadcast("nowplaying", nowPlaying)
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, nowPlaying }));
    return true;
    }

    if (parsed.pathname === "/test/music") {
        nowPlaying = { title: "Lofi Kingdom", artist: "CozyMage", time: Date.now() };
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