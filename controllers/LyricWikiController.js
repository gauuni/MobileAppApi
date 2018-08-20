var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var config = require('../config');

var LanguageDetect = require('languagedetect');
var lngDetector = new LanguageDetect();

var lyricDetector = require('lyric-get')

router.get('/', (req, res) =>{

    var artist = req.body.artist
    var song = req.body.song

    lyricDetector.get(artist, song, (err, res)=>{
        if (err){
            console.log(err)
            return
        }

        console.log(res)
    })
})