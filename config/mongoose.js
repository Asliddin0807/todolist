const mongoose = require('mongoose')
const isConnect = () => {
    mongoose.set("strictQuery", false)
    const isConnect = mongoose.connect('mongodb://127.0.0.1:27017/todoList').then(() => {
        console.log('database connected')
    }).catch((err) => {
        throw new Error(err)
    })
}

module.exports = { isConnect }