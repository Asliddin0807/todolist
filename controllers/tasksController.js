const Tasks = require('../models/tasksModel')
const asyncHandler = require('express-async-handler')
const cloudinary = require('cloudinary')

const newTask = asyncHandler(async(req, res) => {
    const { category, title, deskription, 
        startTime, finishTime} = req.body
    const { id } = req.user
    console.log(id)
    const find = await Tasks.findOne({userId: id})
    if(!find){
        const createTask = new Tasks({
        userId: id,
        list: [{
            categoriy: category,
            title: title,
            deskription: deskription,
            startTime: startTime,
            finishTime: finishTime
        }]
    })
    await createTask.save()
    res.json(createTask)
    }else{
        const task = await Tasks.updateOne(find, {
            $push: {
                list: {
                    categoriy: category,
                    title: title,
                    deskription: deskription,
                    startTime: startTime,
                    finishTime: finishTime
                } 
            }
            
        }, { new: true })
        res.json(task)
    }
})

//get all Tasks
const getAllTasks = asyncHandler(async(req, res) => {
    const { id } = req.user
    const find = await Tasks.findOne({userId: id})
    if(find){
        const allTasks = await Tasks.findOne({userId: id})
        res.json(allTasks.list)
    }else{
        throw new Error('err')
    }
})

// get Task by id
const getTasksById = asyncHandler(async(req, res) => {
    const { _id } = req.user
    const { id } = req.params
    const findUser = await Tasks.findOne({userId: _id})
    // console.log(findUser);
    if(findUser){
        const findbyid = await Tasks.findOne({})
        const finedId = findbyid.list.find((elem) => elem.id === id)
        res.json(finedId)
    }else{
        throw new Error('list no fined')
    }
    
}) 




//pagination
const getPagination = asyncHandler(async(req, res) => {
    const object = {...req.query}
    const excludeFields = ['limit', 'skip']
    excludeFields.forEach((el) => delete object[el])

    let queryStr = JSON.stringify(object)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    let query = Tasks.find(JSON.parse(queryStr))
    
    //limit
    if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ')
        query = query.select(fields)
    }else{
        query = query.select('-__v')
    }

    //pagination
    const limit = req.query.limit
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)
    if(req.body.query){
        const tasksCount = await Tasks.countDocuments()
        if(skip >= tasksCount){
            throw new Error('This page error')
        }
    }

    console.log(limit, skip)
    const task = await query
    res.json(task)
})


//update by id tasks
const updateByIdTask = asyncHandler(async(req, res) => {
    const { id } = req.params
    const { _id } = req.user 
    const { category, title, description,  
        startTime, finishTime } = req.body
    const find = await Tasks.findOne({userId: _id})
    if(find){
        const update = await Tasks.updateOne({
            'list._id': id
        },{
            $set: {
                'list.$.category': category,
                'list.$.title': title,
                'list.$.deskription': description,
                'list.$.startTime': startTime,
                'list.$.finishTime': finishTime,   
            }
        })
        res.json(update)
    }else{
        throw new Error('err')
    }
})

//delete task by id
const deleteTaskById = asyncHandler(async(req, res) => {
    const { id } = req.params
    const { user } = req.user
    const find = await Tasks.findOne({userId: user})
    if(find){
        const deleteTask = await Tasks.findByIdAndDelete({_id: id})
        res.json('Task deleted')
    }else{
        throw new Error('not delete')
    }
})

//upload image
const uploadImage = asyncHandler(async(req, res) => {
    const { id } = req.params
    const { _id } = req.user
    const find = await Tasks.findOne({ userId: _id })
    if(find){
        const uploading = cloudinary.v2.uploader.upload(req.file.path)
        const updateImage = await Tasks.updateOne({
            'list._id': id
        },{
            $set: {
                'list.$.image': (await uploading).secure_url
            }
        })
        res.json(updateImage)
    }else{
        throw new Error('error')
    }
})



//is like
const isLike = asyncHandler(async(req, res) => {
    const { _id } = req.user
    const { id } = req.params
    const findUser = await Tasks.findOne({userId: _id})
    if(findUser){
        if(findUser.list.find((elem) => elem.islike === true)){
            const defLike = await Tasks.updateOne({
                'list._id': id
            }, {
                $set: {
                    'list.$.islike': false
                }
            })
            res.json(defLike)
            console.log('Asliddin')
        }else{
            const like = await Tasks.updateOne({
                'list._id': id
            },{
                $set: {
                    'list.$.islike': true
                }
            })
            res.json(like)
         } 
    }else{
        throw new Error('list no fined')
    }
    
})

//is Complete 
const isComplete = asyncHandler(async(req, res) => {
   const { _id } = req.user
   const { id } = req.params
   const find = await Tasks.findOne({userId: _id})
   if(find){
        if(find.list.find((elem) => elem.isDone === false)){
            const done = await Tasks.updateOne({
                'list._id': id
            },{
                $push: {
                    isDoneList: id
                }
            },
             {
                $set: {
                    'list.$.isDone': true
            }
            })

            res.json(done)

        }else{
            res.json('Can\'t go back')
        }
   }else{
        throw new Error('Error not fined user')
   }
})

//get completed tasks 
const getComplet = asyncHandler(async(req, res) => {
    const { _id } = req.user
    const find = await Tasks.findOne({userId: _id})
    if(find){
        const getTaskCompl = await Tasks.findOne()
        res.json(getTaskCompl.isDoneList)
    }else{
        throw new Error('error complete')
    }
})



module.exports = { 
    newTask, 
    getAllTasks, 
    getTasksById, 
    getPagination, 
    updateByIdTask,  
    deleteTaskById,
    uploadImage,
    isLike,
    isComplete,
    getComplet
}