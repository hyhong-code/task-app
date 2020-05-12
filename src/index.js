const express = require("express");

// mongoose file dosen't export anything
// call require just run the file and connect to db
require("./db/mongoose");

// load in routers
const userRouter = require("../src/routers/user");
const taskRouter = require("../src/routers/task");

const app = express();
app.use(express.json());

// use routers
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
