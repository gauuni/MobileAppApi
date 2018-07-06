
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ejs = require('ejs')
const port = process.env.PORT || 5000

const app = express()
var db 
const db_uri = 'mongodb://khoinguyen_admin:Gcguest177@ds127811.mlab.com:27811/demo-mobile-app-api'
// const db_uri = 'mongodb://127.0.0.1:27017/exampleDb'
app.use(bodyParser.urlencoded({extended: true}))
app.use('/views', express.static(__dirname+"/views"))
app.set('view engine', 'ejs')

// All your handlers here...
app.get('/', (req, res)=>{
    console.log('someone request to your server')
    var cursor = db.collection('quotes').find().toArray((err, results) =>{
        
        if (err) return console.log(err)

        res.render(__dirname+'/views/index.ejs', {quotes: results})
    })
})

app.get('/users', (req, res)=>{
    var cursor = db.collection('users').find().toArray((err, results) =>{
        
        if (err) return res.send({
            status: false,
            message: err
        })

        res.send({
            status: 200,
            message: 'sucess',
            data:results
        })
    })
})

app.post('/quotes', (req, res)=>{
    db.collection('quotes').save(req.body, (err, result) =>{
        if (err) return console.log(err)

        console.log('saved successful')
        res.redirect('/')
    })
})

app.post('/users/sign-in', (req, res) =>{
    var username = req.body.username
    var password = req.body.password
    console.log(username)

    getUser(username, password, (err, user) =>{
        if (err) return console.log(err)
        if (!user) {
            res.redirect('/')
            return console.log("user is not exsisted")
        }

        console.log('sign-in successful')
        res.render(__dirname+'/views/result.ejs', {user:user})
    })

})

app.post('/users/sign-up', (req, res) =>{
    var username = req.body.username
    var password = req.body.password

    getUser(username, password, (err, user) =>{
        if (err) return console.log(err)
        if (user) {
            res.redirect('/')
            return console.log("user exsisted")
        }

        db.collection('users').save(req.body, (err, result) =>{
            if (err) return console.log(err)
    
            console.log('sign-up successful')
            res.redirect('/')
            
        })
        
    })
})

function getUser(username, password, callback){
     db.collection('users')
    .findOne({
        username:username,
        password:password
    },
        (err, result) =>{
            console.log(result)
             callback(err,result)
    }) 
}


MongoClient.connect(db_uri,{ useNewUrlParser: true}, (err, client)=>{
    if (err) return console.log(err)
    db = client.db('demo-mobile-app-api')

    // start server
    const listener = app.listen(port, ()=>{
        console.log('Server is running on port '+listener.address().port+'!')
    })
    
})

