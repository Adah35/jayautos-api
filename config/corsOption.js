const allowedOrigins = require("./allowedOrigins")

const corsOption = {
    origin: (origin, callBack) => {
        if (allowedOrigins.indexOf(origin) !== -1) {
            callBack(null, true)
        } else {
            callBack(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOption