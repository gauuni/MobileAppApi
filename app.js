var express = require('express')
var app = express()
var db = require('./db')

var UserController = require('./controllers/UserController')
app.use('/users', UserController)

var AuthController = require('./controllers/AuthController')
app.use('/api/auth', AuthController)

var LyricWikiController = require('./controllers/LyricWikiController')
app.use('/api/lyric', LyricWikiController)

var YoutubeGetLinkController = require('./controllers/YoutubeGetLinkController')
app.use('/api/youtube', YoutubeGetLinkController)

app.get('/', function(request, response){
    response.sendFile(__dirname+'/front-end/index.html');
});

module.exports = app;