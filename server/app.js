const io = require('socket.io')(5000);
const cors = require('cors');

var express = require("express");
var app = express();
app.use(cors());

// the count state
let count = 0;

let machines = [
  {
    name: "test1",
    state: "running"
  },
  {
    name: "test2",
    state: "stopped"
  }
]

let socketClient = null;



io.on('connect', function (socket) {
  console.log("socket running on 5000 port");
  socketClient = socket;
});

app.get("/vms", (req, res, next) => {
  count++;
  res.json({ result: "success", list: machines });
});


app.get("/test", (req, res, next) => {
  count++;
  socketClient.emit('counter updated', count);
  res.json({ result: "success"});
});

app.get("/vm/:name/:state", (req, res, next) => {
  const name = req.params.name;     
  const state = req.params.state;

  console.log(">>> status api called");
  console.log("Name:", name);
  console.log("state:", state);
  socketClient.emit('VM_STATE_CHANGED', {name, state});
  res.json({ result: "success" });
});


app.listen(8000, () => {
  console.log("Server running on port 8000");
});