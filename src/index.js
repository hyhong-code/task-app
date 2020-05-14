const express = require("express");

// mongoose file dosen't export anything
// call require just run the file and connect to db
require("./db/mongoose");

// load in routers
const userRouter = require("../src/routers/user");
const taskRouter = require("../src/routers/task");

const app = express();

// // middleware, triggered between new requests and route handling
// app.use((req, res, next) => {
//   console.log(req.method, req.path);
//   if (req.method === "GET") {
//     res.send("GET requests are disabled!");
//   } else {
//     next(); // continue to run
//   }
// });

// maintainence mode middleware
// app.use((req, res, next) => {
//   res.status(503).send("Services are down for maintainence, please try again later!");
// });

app.use(express.json());

// use routers
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

const jwt = require("jsonwebtoken");

const myFunc = async () => {
  const token = jwt.sign({ _id: "abc123" }, "thisismysecret", { expiresIn: "7 days" });
  console.log(token);

  const data = jwt.verify(token, "thisismysecret");
  console.log(data);
};

myFunc();
