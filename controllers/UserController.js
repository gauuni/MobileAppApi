var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({extended: true}))
router.use(bodyParser.json())
var User = require('../schemas/User')

// get profile
router.get('/', (req, res)=>{

})

module.exports = router;