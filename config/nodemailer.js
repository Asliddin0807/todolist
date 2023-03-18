const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')
const Users = require('../models/userModel')


const deleteAccount = asyncHandler(async(data, req, res) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "kutubxona655@gmail.com",
                pass: "afrbijcfijrbmhzk"
            },
        })
        
        let mailOption = {
            from: data.from,
            to: data.to,
            subject: data.subject,
            text: data.text
        }
    
        transporter.sendMail(mailOption, (err, info) => {
            if(err){
                throw new Error('error')
            }else{
                res.json('send' + info.response)
            }
        })
   
})

//forgot password
const forgotPassword = asyncHandler(async(data, req, res) => {
    const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "kutubxona655@gmail.com",
                pass: "afrbijcfijrbmhzk"
            }
        })
    
        const mailOption = {
            from: data.from,
            to: data.to,
            subject: data.subject,
            text: data.text
        }
    
        transporter.sendMail(mailOption, (err, info) => {
            if(err){
                throw new Error(err)
            }else{
                res.json('send' + info.response)
            }
        })
    
})

module.exports = { deleteAccount, forgotPassword }