const { default: axios } = require("axios");
const express = require("express");
const app = express();

const port = 4005;

app.use(express.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  const ports = ["4000", "4001", "4002", "4003"];

  for (let i of ports) {
    axios
      .post(`http://localhost:${i}/events`, event)
      .then(() => {
        console.log(`Event ${event?.type} sent to ${i}`);
      })
      .catch(() => {
        console.log(`Error sending event "${event?.type}" sent to ${i}`);
      });
  }

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.json(events);
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));
