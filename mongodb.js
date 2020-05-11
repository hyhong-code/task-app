// CRUD: create read update delete

// MongoClient give us the functions to connect to db and perform CRUD
const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017"; // connection to mongo server
const databaseName = "task-manager";

// ObjectId allow us to generate a _id for a document ourselves, _id conatains time info
// const id = new ObjectId();
// console.log(id);
// console.log(id.getTimestamp());

// useNewUrlParser option to parse our url correctly
// 3rd argument callback function is called when we are connected to db, async
MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database.");
    }

    // get a refrence of the new db
    const db = client.db(databaseName);

    // db.collection("users")
    //   .deleteMany({ age: 27 })
    //   .then((result) => console.log(result.deletedCount))
    //   .catch((err) => console.log(err));

    db.collection("tasks")
      .deleteOne({ description: "learn node" })
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }
);
