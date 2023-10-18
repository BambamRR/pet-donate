const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config()
const { PRIVATE_KEY } = process.env


const getUserByToken = async (token) => {
  if (!token) {
    return res.status(401).json({ message: "Acesso negado!" });
  }

  const decoded = jwt.verify(token, PRIVATE_KEY);
  const userId = decoded.id;

  const user = await User.findOne({ _id: userId });

  return user;
};

module.exports = getUserByToken