require("../src/db/mongoose");
const Task = require("../src/models/task");

// Task.deleteOne({ _id: "5eb9a178356b7f549854a046" })
//   .then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
//   })
//   .then((count) => {
//     console.log(`${count} number of incomplete tasks.`);
//   })
//   .catch((err) => console.log(err));

const deleteTaskAndCount = async (id) => {
  await Task.deleteOne({ _id: id });
  const count = await Task.countDocuments({ completed: false });
  return count;
};

deleteTaskAndCount("5eb9c67b09ad901c98180926")
  .then((count) => console.log(count))
  .catch((err) => console.log(err));
