var express = require('express')

var router = express()

router.get('/', (req, res) => {
    res.json({ response: 'a GET request for LOOKING at questions'})
})

router.post('/', (req, res) => {
    res.json({
        response: 'a POST request for CREATING questions',
        body: req.body 
    })
})

router.listen(5000)