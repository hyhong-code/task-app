const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    // Access request header, Authorization key value pair
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // We used _id when we signed the tokens for users
    // "tokens.token" finds if there is given token in a user's tokens array
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }

    // store token and user onto req, so that route handler can access it
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate!" });
  }
};

module.exports = auth;
