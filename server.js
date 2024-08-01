const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

let users = [];

wss.on("connection", function (ws) {
  ws.on("message", function (message) {
    const data = JSON.parse(message);
    if (data.type === "newUser") {
      users.push({ name: data.name, ws });
      broadcastUserCount();
    } else if (data.type === "message") {
      broadcastMessage(data.name, data.message);
    } else if (data.type === "userAction") {
      console.log(`${data.name} performed action: ${data.action}`);
    }
  });

  ws.on("close", function () {
    users = users.filter((user) => user.ws !== ws);
    broadcastUserCount();
  });
});

function broadcastUserCount() {
  const count = users.length;
  users.forEach((user) => {
    user.ws.send(JSON.stringify({ type: "userCount", count }));
  });
}

function broadcastMessage(name, message) {
  users.forEach((user) => {
    user.ws.send(JSON.stringify({ type: "message", name, message }));
  });
}
