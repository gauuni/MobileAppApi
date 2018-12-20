var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var util = require('../utils');
var ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
var ffmpeg = require('fluent-ffmpeg')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var request    = require('request');
var cheerio    = require('cheerio');

var youtubedl = require('youtube-dl');

var http = require('http')
var argv = require('optimist').argv
var youtubeStream = require('youtube-audio-stream')

var horizon = require('horizon-youtube-mp3')

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

router.get('/', (req, res) =>{

    var video_id = req.query.video_id
    console.log(video_id)
    var url = 'http://www.youtube.com/watch?v='+video_id;

    // horizon.getInfo(url, function(err, data){
    //     if (err){
    //         sendResponseDataWith(res, 400, err, null)
    //         throw err
    //     }
       
    //     util.sendResponseDataWith(res, 200, null,data)
    // })

    horizon.download(url, res, null, null, null, false, function(err, result){
        if(err) {
            return
          }
      
          if(result === horizon.successType.CONVERSION_FILE_COMPLETE){
            // log.info(result);
          }
    });

    // youtubedl.getInfo(url, ['-x', '--audio-format', 'mp3'], function(err, info) {
    //     if (err){
    //         sendResponseDataWith(res, 400, err, null)
    //         throw err
    //     }
       
    //     util.sendResponseDataWith(res, 200, null, {
    //         id: info.id,
    //         title: info.title,
    //         url: info.url,
    //         format_id: info.format_id
    //     })
    //     // console.log('id:', info.id);
    //     // console.log('title:', info.title);
    //     // console.log('url:', info.url);
    //     // console.log('thumbnail:', info.thumbnail);
    //     // console.log('description:', info.description);
    //     // console.log('filename:', info._filename);
    //     // console.log('format id:', info.format_id);
    //   });
})

router.get('/getlink', (req, res)=>{

    var video_id = req.query.video_id

    http.get("http://www.youtube.com/get_video_info?video_id="+video_id, function(response) {
        var chunks = []
        response.on('data', function(chunk){chunks.push(chunk)
        }).on('end', function(){
            var data = Buffer.concat(chunks).toString()
            var videoInfo = parseVideoInfo(data)
            util.sendResponseDataWith(res, 200, null, videoInfo)
        })
        }).on('error', function(e) {
        console.log("Got error: " + e.message)
    });
})






function parseVideoInfo(videoInfo) {
    var rxUrlMap = /url_encoded_fmt_stream_map=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/
    urlmap = unescape(videoInfo.match(rxUrlMap)[1])
    
    var rxUrlG = /url=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/g
    var rxUrl  = /url=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/
    var urls = urlmap.match(rxUrlG)
    urls = map(urls, function(s) {return s.match(rxUrl)[1]} )
    urls = map(urls, unescape)
    
    var rxTitle  = /title=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/
    var title = argv.o ? argv.o : videoInfo.match(rxTitle)[1]
    
    return { title: title, urls: urls }
}

function downloadVideo(videoInfo) {
    var url = videoInfo.urls[0];
    var filename = videoInfo.title + ".flv"
    
    http.get(url,
      function(res) {
        var stream = fs.createWriteStream(filename)
        res.pipe(stream)
      })
      
    console.log("Downloading to "+filename);
}



function map (a,f) {
    for(i=0;i<a.length;i++){
        a[i]= f(a[i])
    }
    return a
}

module.exports = router