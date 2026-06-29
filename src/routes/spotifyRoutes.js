const spotifyService = require("../services/spotifyService");
const loginUrl = spotifyService.getLoginUrl();

function handleSpotifyRoutes(req, res, parsed){
   if (parsed.pathname === "/spotify/login"){
   
    res.writeHead(302, {
    Location: loginUrl
    });

    res.end();

    return true;
}

if (parsed.pathname === "/spotify/callback") {
  const code = parsed.query.code;

  spotifyService.exchangeCodeForToken(code)
    .then(() => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Spotify connected successfully! You can close this tab.");
    })
    .catch((err) => {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(`Spotify connection failed: ${err.message}`);
    });

  return true;
}
if (parsed.pathname === "/spotify/current") {
  spotifyService.getCurrentlyPlaying()
    .then((song) => {
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify(song, null, 2));
    })
    .catch((err) => {
      res.writeHead(500, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify({ error: err.message }));
    });

  return true;
}

if (parsed.pathname === "/spotify/sync") {
  spotifyService.syncCurrentSong()
    .then((song) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, song }, null, 2));
    })
    .catch((err) => {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: err.message }, null, 2));
    });

  return true;
}



return false;
}
module.exports = {
  handleSpotifyRoutes
};