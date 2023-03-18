const mongoose = require('mongoose')
const tasksSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    list: [{
        categoriy: {
           type: String
        },
        title: {
            type: String
        },
        deskription: {
            type: String
        },
        islike:{ 
            type: Boolean,
            default: false
        },
        startTime: {
            type: String
        },

        finishTime: {
            type: String   
        },
        
        isDone: {
           type: Boolean,
           default: false
        },

        image: String
    }],

    isDoneList: Array,
    
}, { timestamps: true })  

module.exports = mongoose.model('Tasks', tasksSchema)
//categ[title, desk, like, isDone, startTime, finishTime, img]

