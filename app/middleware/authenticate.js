const jwt = require('jsonwebtoken')


const authenticate = (req, res, next) => {
    try {
        //const token = req.header.authorization.split(' ')[1]
        const token = req.cookies.jwt
        console.log(token)
        const decode = jwt.verify(token, 'qjdBohbY85xs40Jd')

        req.user = decode
        next()
    }
    catch{
        res.redirect('/login')

    }
}

module.exports = authenticate