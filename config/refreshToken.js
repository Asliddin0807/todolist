const jwt = require('jsonwebtoken')

const generateRefreshToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {expiresIn: "3d"})
}

module.exports = { generateRefreshToken }