const express = require("express");

const app = express();
dotenv.config();

app.listen(8800, () => {
  connect();
  console.log("Connected to backend at port:8800");
});
