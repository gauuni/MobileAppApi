var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var request    = require('request');
var cheerio    = require('cheerio');

const rootURL = "http://lyric.tkaraoke.com"
router.get('/', (req, res) =>{

    var artist = req.query.artist
    var song = req.query.song

    handleHTMLSource(encodeURIComponent(song), (err, lyric)=>{
        if (err){
            sendResponseDataWith(res, 200, err, null)
            return
        }

        sendResponseDataWith(res, 200, null, {song: song, artist: artist, lyric: lyric})
    })

})

function sendResponseDataWith(response, code, message, data){
    var status = code == 200 ? true : false
    var message = message
    if (!message) message = "Success"
    var responseData = {status: status, message: message, data: data } 
    response.status(code).send(responseData)
}

function handleHTMLSource(song, callback){

    var url = rootURL+"/s.tim?q="+song+"&t=1"


    request(url, function(error, response, html) {
        if(error) {
               callback(error, null);
               return
        }

        var $ = cheerio.load(html);
        $('script').remove();
        var lyrics = ($('h4[class=h4-title-song]').children().first().attr('href'));
    
        if(lyrics != ""){
            requestLyricURL(lyrics, (err, lyric)=>{
                if(error) {
                    callback(error, null);
                    return
                 }
                 callback(null, lyric)
            })
        }
        else{
            callback("not found", null);
        }
        
    })
}

function requestLyricURL(href, callback){

    var lyrics = "";

    var url = rootURL+href

    request(url, function(error, response, html) {
        if(error)
        {
               callback(error, null);
        }
        else
        {
            
            var $ = cheerio.load(html,{
                decodeEntities: false
            });
            $('script').remove();
            var lyrics = ($('div[class=div-content-lyric]').html());

            if(lyrics != ""){
                callback(null, lyrics.replace(/<br ?\/?>/ig,"\n"));
            }
            else{
                callback("not found", null);
            }
        }
    });
}


module.exports = router