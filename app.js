const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//DB connection
const DB_URI = process.env.MONGO_URI;
mongoose
  .connect(DB_URI)
  .then(() => console.log("MongoDb Connected"))
  .catch((err) => console.log(err));

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
