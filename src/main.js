const express = require("express");
require("dotenv").config();
const dbConnect = require("../config/dbconnect");
const app = express();
const initRouter = require("../routers");
const port = process.env.PORT || 8080;

dbConnect();
app.use(express.json()); //express đọc hiểu data từ phía client gửi lên
app.use(
  express.urlencoded({
    extended: true,
  })
);

initRouter(app);

app.get("/", (req, res, next) => {
  res.json("Hello");
});

app.listen(port, () => {
  console.log("Server on ", port);
});
