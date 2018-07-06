var express = require('express')
var bodyParser = require('body-parser')

var app = express()

app.get('/notes',function(req, res){
    res.json({notes: "This is your notebook. Edit this to start saving your notes!"})
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.post('/notes', function(req, res){
    if(!req.body.notes || typeof req.body.notes != "string"){
        res.status(400).send("400 Bad request")
    }

    // req.user.customData.notes = req.body.notes
    // req.user.customData.save()
    res.status(200).send("Save success " + req.body.notes).end()
})

app.listen(3000)