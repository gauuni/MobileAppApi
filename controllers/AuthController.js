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
        var token = createToken(user._id)
        
        sendResponseDataWith(res, 200, null, {token: token})
    })
})

router.get('/me', (req, res, next)=>{
    var token = req.headers['x-access-token']
    if (!token){
        return sendResponseDataWith(res, 401, "No token provided.")
    }

    jwt.verify(token, config.secret, (err, decoded)=>{
        if (err){
            return sendResponseDataWith(res, 500, "Failed to authenticate token.")
        }

        //get user
        User.findById(decoded.id,
             {password:0},
             (err, user)=>{
            if (err){
                return sendResponseDataWith(res, 500, "There was a problem finding the user.")
            }

            if(!user){
                return sendResponseDataWith(res, 404, "No user found.")
            }

            sendResponseDataWith(res, 200, null, user)
            // next(user)
        })
    })
})

router.post("/login", (req, res)=>{
    User.findOne({email: req.body.email},
         (err, user)=>{
            if (err) {
                return sendResponseDataWith(res, 500, "Error on the server.")
            }

            if (!user){
                return sendResponseDataWith(res, 200, "Not found user with this email.")
            }

            // check valid password
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
            if (!passwordIsValid){
                return sendResponseDataWith(res, 401, "Wrong email or password.")
            }

            var token = createToken(user._id)
            sendResponseDataWith(res, 200, null, {token: token})
            
    })
})

// add the middleware function
// router.use(function (user, req, res, next) {
//     sendResponseDataWith(res, 200, null, user)
//   })

function sendResponseDataWith(response, code, message, data){
    var status = code == 200 ? true : false
    var message = message
    if (!message) message = "Success"
    var responseData = {status: status, message: message, data: data } 
    response.status(code).send(responseData)
}

function createToken(id, interval=15*60){
    return jwt.sign({ id: id }, 
        config.secret,
        { expiresIn: interval})
}

module.exports = router