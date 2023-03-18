const mongoose = require('mongoose')
const isConnect = () => {
    mongoose.set("strictQuery", false)
    const isConnect = mongoose.connect('mongodb+srv://asliddin:asliddin123@atlascluster.k5lmz3l.mongodb.net/?retryWrites=true&w=majority').then(() => {
        console.log('database connected')
    }).catch((err) => {
        throw new Error(err)
    })
}

module.exports = { isConnect }
