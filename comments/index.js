const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const app = express();
const port = 3001;

app.use(morgan("tiny"));
app.use(express.json());

const commentsByPostId = {
  1: [
    { id: 1, title: "Hello" },
    { id: 3, title: "Hello 2" },
  ],
  2: [{ id: 2, title: "World" }],
};

app.post("/posts/:id/comments", async (req, res) => {
  const postId = req.params.id;

  const comment = {
    id: uuidv4(),
    title: req.body.title,
    status: "pending",
  };

  commentsByPostId[postId].push(comment);

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      postId,
      ...coment,
    },
  });

  res.send(comment);
});

app.get("/posts/:id/comments", (req, res) => {
  const postId = req.params.id;

  if (commentsByPostId[postId]) {
    res.send(commentsByPostId[postId]);
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/events", async (req, res) => {
  const event = req.body;
  console.log("event received", event.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status } = data;

    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => comment.id === id);

    comment.status = status;

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        postId,
        content,
        status,
      },
    });
  }

  res.send({
    status: "OK",
  });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
