const express = require("express");
const app = express();
const port = 4003;
const axios = require("axios");

app.use(express.json());

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  if (type === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";

    axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        content: data.content,
        status,
      },
    });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
