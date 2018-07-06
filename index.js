
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ejs = require('ejs')
const port = process.env.PORT || 5000

const app = express()
var db 
const db_uri = 'mongodb://khoinguyenios:Gcguest177@ds127811.mlab.com:27811/demo-mobile-app-api'
// const db_uri = 'mongodb://127.0.0.1:27017/exampleDb'
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs')

// All your handlers here...
app.get('/', (req, res)=>{
    console.log('someone request to your server')
    var cursor = db.collection('quotes').find().toArray((err, results) =>{
        
        if (err) return console.log(err)

        res.render(__dirname+'/views/index.ejs', {quotes: results})
    })
    // res.sendFile(__dirname+'/index.html');
   
})

app.post('/quotes', (req, res)=>{
    db.collection('quotes').save(req.body, (err, result) =>{
        if (err) return console.log(err)

        console.log('saved successful')
        res.redirect('/')
    })
})



MongoClient.connect(db_uri,{ useNewUrlParser: true }, (err, client)=>{
    if (err) return console.log(err)
    db = client.db('demo-mobile-app-api')

    // start server
    const listener = app.listen(port, ()=>{
        console.log('Server is running on port '+listener.address().port+'!')
    })
    
})

