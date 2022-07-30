const express = require("express");
const axios = require("axios");
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 4001;

app.use(morgan("tiny"));
app.use(express.json());

const posts = {
  1: "This is post 1",
  2: "This is post 2",
};

app.post("/posts", async (req, res) => {
  const post = req.body;
  posts[uuidv4()] = post.title;

  await axios.post("http://localhost:4005/events", {
    type: "PostCreated",
    data: {
      id: uuidv4(),
      title: post.title,
      content: post.content,
    },
  });

  res.send(post);
});

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.post("/events", (req, res) => {
  const event = req.body;
  console.log("event received", event.type);

  res.send({
    status: "OK",
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
