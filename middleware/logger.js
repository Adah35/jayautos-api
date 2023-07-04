const {format} = require('date-fns')
const {v4:uuid} = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message,fileName) => {
    const dateTime = format(new Date(),'yyyy-MM-dd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    
    try {
        if (!fs.existsSync(path.join(__dirname,'..','logs'))) {
            await fsPromises.mkdir(path.join(__dirname,'..','logs'))
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs',fileName),logItem)
    } catch (error) {
        console.log(error)
    }
}


const logger = (req,res,next) => {
    let message = `${req.method}\t${req.url}\t${req.headers.origin}`
    logEvents(message,'reqLog.log')
    console.log(req.method,req.url)
    next()
}

module.exports = {logEvents,logger}