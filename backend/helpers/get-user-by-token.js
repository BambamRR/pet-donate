const jwt = require("jsonwebtoken");
const User = require('../models/User')
const { PRIVATE_KEY } = require('../auth')

const getUserByToken = async( token) => {
    const decoded = jwt.verify(token, PRIVATE_KEY)
    const userId = decoded.id

    await User.findOne({_id: userId})
}