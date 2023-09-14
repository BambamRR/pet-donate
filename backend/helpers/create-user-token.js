const jwt = require('jsonwebtoken')

require('dotenv').config

const { SECRET } = process.env

const createUserToken = async (user, req, res) => {
    //create a token
    const token = jwt.sign({
        name: user.name,
        id: user._id,
    }, "7QxPw!Mr>,O[") //secret
    //return token
    res.status(200).json({
        message: "Você está autenticado",
        token: token,
        userId: user._id
    })
}

module.exports = createUserToken