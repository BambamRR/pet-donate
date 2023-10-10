const jwt = require('jsonwebtoken')
const PRIVATE_KEY = require('../auth')

const createUserToken = async (user, req, res) => {
    //create a token
    const token = jwt.sign({
        name: user.name,
        id: user._id,
    }, PRIVATE_KEY) //secret
    //return token
    res.status(200).json({
        message: "Você está autenticado",
        token: token,
        userId: user._id
    })
}

module.exports = createUserToken