import https from "https";

const PORT = process.env.PORT || 3000;

// Local server (self ping target)
const server = https.createServer((req, res) => {
  if (req.url === "/ping") {
    res.writeHead(200);
    res.end("pong");
    return;
  }

  res.writeHead(200);
  res.end("ok");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ---- KEEP ALIVE LOGIC ----

function pingSelf() {
  https.get(`${process.env.URL}/ping`, (res) => {
    console.log(`[${new Date().toISOString()}] Self ping: ${res.statusCode}`);
  }).on("error", console.error);
}

function pingRenderApp() {
  https.get(process.env.TargetURL, (res) => {
    console.log(
      `[${new Date().toISOString()}] Render ping: ${res.statusCode}`
    );
  }).on("error", console.error);
}

// Run immediately
pingSelf();
pingRenderApp();

// Run every 8 minutes
setInterval(() => {
  pingSelf();
  pingRenderApp();
}, 8 * 60 * 1000);
