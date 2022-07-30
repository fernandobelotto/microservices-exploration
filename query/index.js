const express = require("express");
const app = express();
const handleEvent = require("./handleEvent");
const axios = require("axios");

const port = 4000;

app.use(express.json());

const posts = {};

app.posts("/posts", (req, res) => {
  res.json(posts);
});

app.posts("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(posts, type, data);

  res.send({ status: "OK" });
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}!`);
  const res = await axios.get("http://localhost:4005/events");

  for (let event of res.data) {
    console.log("processing event: ", event.type);

    handleEvent(posts, event.type, event.data);
  }
});
