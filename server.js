require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middleware/errorHandler')
const { logEvents, logger } = require('./middleware/logger')
const corsOption = require('./config/corsOption')
const connectDB = require('./config/dbConn')
const { default: mongoose, Mongoose } = require('mongoose')


const PORT = process.env.PORT || 3500


console.log(process.env.NODE_ENV)
connectDB()
// middleware
app.use(logger)
app.use(express.json())
app.use(cors(corsOption))
app.use(cookieParser())
app.use('/', express.static('./public'))


// routes
app.use('/', require('./routes/root'))
app.use('/api/v1/users', require('./routes/userRoute'))
app.use('/api/v1/notes', require('./routes/noteRoute'))
app.use('/api/v1/auth', require('./routes/authRoute'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 not found' })
    } else {
        res.type('txt').send('404 not found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('connected to mongoDB')
    app.listen(PORT, console.log(`server running on ${PORT}`))

})
mongoose.connection.on('error', (err) => {
    console.log(err)
    logEvents(`${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
