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

const Task = require("../src/models/task");
const User = require("./models/user");
const main = async () => {
  // const task = await Task.findById("5ebdbad82f17990214ced67c");
  // // Find the user associated with this task and populate the user document to owner field
  // // owner field now contains not only id but the whole user document
  // await task.populate("owner").execPopulate();
  // console.log(task.owner);
  const user = await User.findById("5ebdba375b8d973428af4a62");
  // Find all tasks created by this user, return as an array
  await user.populate("tasks").execPopulate();
  console.log(user.tasks);
};

main();
