const router = require('express').Router()
const { authMiddleWare } = require('../MiddleWare/authMiddleWare')
const { regis, login, logOut, getUserProfil, updateUserProfile,deleteAccountUser,
    getDelete, uploadImage, deleteImage, forgotPasswordUser, resetPass  } = require('../controllers/usersController')

const uploadPhoto = require('../MiddleWare/multer')



router.post('/registration', regis)

router.post('/login', login)
router.get('/logout', authMiddleWare, logOut)
router.get('/getUser', authMiddleWare, getUserProfil)
router.put('/updateProfile', authMiddleWare, updateUserProfile)
router.post('/deleteAcc', authMiddleWare, deleteAccountUser)
router.get('/getVerifyDelet/:token', getDelete)
router.put('/uploadImg/:id', authMiddleWare, uploadPhoto.single("image"), uploadImage)
router.delete('/deleteImage/:id', authMiddleWare, deleteImage)
router.post('/forgot', forgotPasswordUser)
router.post('/resetPassword/:id', resetPass)


module.exports = router
