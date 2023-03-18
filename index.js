const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { isConnect } = require('./config/mongoose')


require('dotenv').config()
isConnect()

const userRoutes = require('./routes/userRoute')
const tasksRoutes = require('./routes/tasksRoute')


app.use(morgan("dev"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())

app.use('/api/user', userRoutes)
app.use('/api/tasks', tasksRoutes)



const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log('server is running')
})
