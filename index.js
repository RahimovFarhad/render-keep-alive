import http from "http";
import axios from "axios";

const PORT = process.env.PORT || 3000;

// ---- SERVER ----
const server = http.createServer((req, res) => {
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

// ---- KEEP ALIVE (AXIOS) ----

async function pingSelf() {
  try {
    const res = await axios.get(`${process.env.URL}/ping`, {
      timeout: 5000,
    });
    console.log(`[${new Date().toISOString()}] Self ping: ${res.status}`);
  } catch (e) {
    console.log(`[${new Date().toISOString()}] Self ping failed`);
  }
}

async function pingTarget() {
  try {
    const res = await axios.get(process.env.TargetURL, {
      timeout: 5000,
    });
    console.log(`[${new Date().toISOString()}] Target ping: ${res.status}`);
  } catch (e) {
    console.log(`[${new Date().toISOString()}] Target ping failed`);
  }
}

// wait for Render routing to settle
setTimeout(() => {
  pingSelf();
  pingTarget();

  setInterval(() => {
    pingSelf();
    pingTarget();
  }, 8 * 60 * 1000); // < 15 min
}, 30_000);
