const { User } = require('../middleware/schemas')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { response } = require('express')



const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err, hashedPass){
        if (err){
            res.json({
                error: err
            })
        }
        let user = new User ({
            username:  req.body.username,
            password: hashedPass,
        })
        user.save()
        .then(user =>{
            res.redirect('/login')
        })
        .catch(error => {
            res.json({
                message: 'An error occured!'
            })
        })
    })

}

const login = (req, res, next) => {
    var username = req.body.username
    var password = req.body.password

    User.findOne({$or: [{username}]})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(err, result){
                if(err) {
                    res.json({
                        error: err
                    })
                    return
                }
                if(result){ 
                    let token = jwt.sign({name: user.username}, 'qjdBohbY85xs40Jd', {expiresIn: '1h'})
                    res.status(200).send({jwt: token });
                    //res.cookie(token)
                    //res.setHeader('Set-Cookie', token);
                    console.log("Tried To Login")
                    return
                
                }else{
                    res.redirect('/login')
                }
            })
        }else{
            res.redirect('/register')
        }
        
    })
}

module.exports = { register, login }