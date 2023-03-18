const jwt = require('jsonwebtoken')
const Users = require('../models/userModel')
const asyncHandler = require('express-async-handler')
require('dotenv').config()

const authMiddleWare = asyncHandler(async(req, res, next) => {
    let token;
    if(req?.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1]
        try{
            if(token){
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
                const users = await Users.findById(decoded?.id)
                req.user = users
                next() 
            }
        }catch(err){
            throw new Error(err)
        }
    }else{
        throw new Error('err')
    }
}) 

module.exports = { authMiddleWare }