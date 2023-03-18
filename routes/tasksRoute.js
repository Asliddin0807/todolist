const router = require('express').Router()
const { newTask, getAllTasks, getTasksById, getPagination, 
    updateByIdTask, isLike, isComplete, deleteTaskById, getComplet, uploadImage } = require('../controllers/tasksController')
const { authMiddleWare } = require('../MiddleWare/authMiddleWare')
const uploadImageMulter = require('../MiddleWare/multer')


router.post('/tasks', authMiddleWare, newTask)
router.get('/getAllTasks', authMiddleWare, getAllTasks)
router.get('/getTasksId/:id', authMiddleWare, getTasksById)
router.get('/task', authMiddleWare, getPagination)
router.put('/update/:id', authMiddleWare, updateByIdTask)
router.put('/like/:id', authMiddleWare, isLike)
router.put('/done/:id', authMiddleWare, isComplete)
router.get('/completed', authMiddleWare, getComplet)
router.put('/image/:id', authMiddleWare, uploadImageMulter.single('image'), uploadImage)
router.delete('delete/:id', authMiddleWare, deleteTaskById)


module.exports = router


