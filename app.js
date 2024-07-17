const express = require("express");
const { resolve, join } = require("path");
const app = express();

app.set("view engine", "ejs");
app.set("views", resolve("views"));
app.use(express.static(resolve("static")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  send(res);
});

const sendEvent = (res, event, data, id) => {
  res.write(`id: ${id}\n`)
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

const sendData = (res, data) => {
  res.write(`data: ${data}\n\n`);
};

let i = 0
function send(res) {
  sendEvent(res, 'userconnect', { username: 'bobby', time: '02:33:48' }, i);
  sendData(res, `Here's a system message of some kind that will get used`);
  sendEvent(res, 'usermessage', { username: 'bobby', time: '02:34:11', text: 'Hi everyone.' }, i);
  i++;

  setTimeout(() => send(res), 1000);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
