const {logEvents} = require('./logger')

const errorHandler = (err,req,res,next) => {
    let errMessage = `${err.name}\t${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
    logEvents(errMessage,'errLog.log')
    console.log(err.stack)

    const status = req.statusCode ? res.statusCode : 500
    res.status(status)
    res.json({message:err.message})
}

module.exports = errorHandler