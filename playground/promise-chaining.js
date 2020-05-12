require("../src/db/mongoose");
const User = require("../src/models/user");

// // 5eb99caf45cd1c6718c4304f
// User.findOneAndUpdate({ _id: "5eb99cbe45cd1c6718c43050" }, { age: 1 })
//   .then((user) => {
//     console.log(user);
//     // set up and return a new Promise for chaining
//     return User.countDocuments({ age: 1 });
//   })
//   // chain the then callback
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));

const updateAgeAndCount = async (id, age) => {
  await User.findByIdAndUpdate(id, { age });
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount("5eb99cbe45cd1c6718c43050", 2)
  .then((count) => console.log(count))
  .catch((err) => console.log(e));
