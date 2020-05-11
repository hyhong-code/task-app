const express = require("express");

// mongoose file dosen't export anything
// call require just run the file and connect to db
require("./db/mongoose");

const User = require("./models/user");

const app = express();
app.use(express.json());

app.post("/users", (req, res) => {
  const user = new User(req.body);

  user
    .save()
    .then((user) => res.status(200).send(res.send(user)))
    .catch((err) => {
      res.status(400).send(err);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
