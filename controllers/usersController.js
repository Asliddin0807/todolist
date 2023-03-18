const Users = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const { generateToken } = require('../config/jwtToken') 
const { generateRefreshToken } = require('../config/refreshToken') 
const { deleteAccount, forgotPassword } = require('../config/nodemailer')
const upload = require('../utils/cloudinary')
const cloudinary = require('cloudinary')
const crypto = require('crypto')


//registration
const regis = asyncHandler(async(req, res) => {
    const {name, email} = req.body
    const find = await Users.findOne({
        name: name,
        email: email
    })
    if(!find){
        const add = await Users.create(req.body)
        res.json(add)
    }else{
        throw new Error('User already exist')
    }
})


//login
const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    const find = await Users.findOne({email})
    const isValidPass = await find.isPasswordMatched(password)
    if(find && isValidPass){
        const refresh = await generateRefreshToken(find?.id)
        const updateToken = await Users.findByIdAndUpdate(find?.id, {
            refreshToken: refresh
        }, { new: true})
        res.cookie('cookie', refresh, {
            httpOnly: true,
            maxAge: 60 * 60 * 70 * 1000
        })

        res.json({
            _id: find?._id,
            name: find?.name,
            email: find?.email,
            age: find?.age,
            token: generateToken(find?.id)
        })
    }else{
        throw new Error('not registration')
    }
})

//log out
const logOut = asyncHandler(async(req, res) => {
    res.clearCookie('cookie')
    res.json('Log Outed').end
})

const getUserProfil = asyncHandler(async(req, res) => {
    // console.log(req.user)
    res.json(req.user)
})
//update Profil user
const updateUserProfile = asyncHandler(async(req, res) => {
    const { name, email, password, age} = req.body
    const { _id } = req.user
    const findUser = await Users.findOne({
        name,
        email,
        password,
        age
    })
    try{
        if(!findUser){
            const update = await Users.findByIdAndUpdate(_id,{
                name: req?.body?.name,
                email: req?.body?.email,
                password: req?.body?.password,
                age: req?.body?.age
            }, { new: true })
            res.json(update)
        }
    }catch(err){
        throw new Error(err)
    }
})

//upload  Images
const uploadImage = asyncHandler(async(req, res) => {
        const { id } = req.params
        console.log(req.files)
        const findId = await Users.findById({_id: id})
        if(findId){
            const upload = await cloudinary.v2.uploader.upload(req.file.path);
            const find = await Users.findByIdAndUpdate(id, {
                image: upload.secure_url
            }, { new: true })
            res.json(find)
        }else{
            throw new Error('err')
        }
})

//delete image
const deleteImage = asyncHandler(async(req, res, next) => {
    const { id } = req.params
    const user = await Users.findById(req.params.id)
    if(user){
        const imgId = user.image;
        const app = " "
        await cloudinary.v2.uploader.destroy(imgId)
        const find = await Users.findByIdAndUpdate(id, {image: app}, { new: true })
        res.status(201).json({
            success: "true",
            message: "image deleted"
        })
    }else{
        throw new Error('err pri udalenii')
    }
})

//delete user account
const deleteAccountUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    const find = await Users.findOne({email: email})
    const isPassword = await find.isPasswordMatched(password)
    if(find && isPassword){
        const url = `Здравствуйте подтвердите email чтобы удалить аккаунт из программы нажмиет на ссылку <a href="http://localhost:8000/api/users/getVerifyDelet/${find.refreshToken}">Нажмите сюда</a>`
        const data = {
            from: "kutubxona655@gmail.com",
            to: email,
            subject: "😐",
            text: url
        }

        deleteAccount(data)
        res.json('true')
    }else{
        throw new Error('not uer')
    }
})

//get delete 
const getDelete = asyncHandler(async(req, res) => {
    const { token } = req.params
    const deleteUser = await Users.findOneAndDelete({refreshToken: token})
    res.json(deleteUser)
    
})


const forgotPasswordUser = asyncHandler(async(req, res) => {
    const { email } = req.body
    const findEmail = await Users.findOne({email: req.body.email})
    if(findEmail){
        let url = `Здравствуйте подтвердите email чтобы удалить аккаунт из программы нажмиет на ссылку <a href="http://localhost:8000/api/users/resetPassword/${findEmail.id}">Нажмите сюда</a>`
        const date = {
            from: "kutubxona655@gmail.com",
            to: findEmail.email,
            subject: "😐",
            text: url
        }
        forgotPassword(date)
        res.json('send')
    }else{
        throw new Error('err')
    }
})

//get update password 
const resetPass = asyncHandler(async(req, res) => {
    const { passwordUser } = req.body
    const { id } = req.params
    const find = await Users.findById({_id: id})
    if(find){
        const hashing = crypto.createHash('sha256').update(passwordUser).digest('hex')
        const update = await Users.findOne({
            password: hashing
        })
        update.password = passwordUser
        await update.save()
        res.json(update)
    }else{
        throw new Error('note updated password')
    }
})


//http://localhost:8000/api/user/google


module.exports = {
    regis,
    login,
    logOut,
    getUserProfil,
    updateUserProfile,
    deleteAccountUser,
    getDelete,
    uploadImage,
    deleteImage,
    forgotPasswordUser,
    resetPass,

}