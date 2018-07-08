var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../schemas/User');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

// register
router.post('/register', (req, res)=>{
    var hashedPassword = bcrypt.hashSync(req.body.password, 8)

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    },
    (err, user)=>{
        if (err){
            return sendResponseDataWith(res, 500, "There was a problem registering the user")
        }
        // create a token
        var token = jwt.sign({ id: user._id }, 
            config.secret,
            { expiresIn: 15*60})
        
        sendResponseDataWith(res, 200, null, {token: token})
    })
})

router.get('/me', (req, res)=>{
    var token = req.headers['x-access-token']
    if (!token){
        return sendResponseDataWith(res, 401, "No token provided.")
    }

    jwt.verify(token, config.secret, (err, decoded)=>{
        if (err){
            return sendResponseDataWith(res, 500, "Failed to authenticate token.")
        }

        //get user
        User.findById(decoded.id, (err, user)=>{
            if (err){
                return sendResponseDataWith(res, 500, "There was a problem finding the user.")
            }

            if(!user){
                return sendResponseDataWith(res, 404, "No user found.")
            }

            sendResponseDataWith(res, 200, null, user)
        })
    })
})

function sendResponseDataWith(response, code, message, data){
    var status = code == 200 ? true : false
    var message = message
    if (!message) message = "Success"
    var responseData = {status: status, message: message, data: data } 
    response.status(code).send(responseData)
}

module.exports = router