const connectToMongo = require("./db");
const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const port = 5001;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/app/auth", require("./routes/auth"));
app.use("/app/notes", require("./routes/notes"));

app.listen(port, () => {
  connectToMongo();
  console.log(`My app is listening on port ${port}`);
});
