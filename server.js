const express = require("express");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Start the HTTP server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Create a WebSocket server
const wss = new WebSocket.Server({ server });

let users = [];
let userCount = 0;

// WebSocket connection handling
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  // Notify all clients about the new user count
  function updateUserCount() {
    const data = JSON.stringify({ type: "userCount", count: userCount });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  // Notify all clients about the updated user list
  function updateUserList() {
    const data = JSON.stringify({ type: "userList", users: users });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "newUser") {
      const userName = data.name;
      if (!users.includes(userName)) {
        users.push(userName);
        userCount++;
        updateUserCount();
        updateUserList();
      }
    }
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    const index = users.indexOf(ws.userName);
    if (index !== -1) {
      users.splice(index, 1);
      userCount--;
      updateUserCount();
      updateUserList();
    }
  });
});
