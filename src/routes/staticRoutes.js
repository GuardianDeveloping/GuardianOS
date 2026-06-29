const path = require("path");

function handleStaticRoutes(res, parsed, publicDir, sendFile) {
    
    if (parsed.pathname === "/") {
        sendFile(res, path.join(publicDir, "overlay.html"));
        return true;
    }


if (parsed.pathname === "/dashboard") {
    sendFile(res, path.join(publicDir, "dashboard.html"));
    return true;
  }
  

  const safePath = path.normalize(parsed.pathname).replace(/^([.][.][/\\])+/, "");
  const filePath = path.join(publicDir, safePath);

  if (filePath.startsWith(publicDir)) {
    sendFile(res, filePath);
    return true;
  }
  return false
}

module.exports = {
    handleStaticRoutes
};