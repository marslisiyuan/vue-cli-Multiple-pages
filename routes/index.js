var express = require('express');
var crypto = require('crypto');
var router = express.Router();
// var redis   = require('redis');
// var client  = redis.createClient('6379', '47.96.139.135');
// client.auth("121121Jie");
/* GET users listing. */
router.get('/', function(req, res, next) {
	var timeStamp = Math.round(new Date().getTime()/1000);
	res.render('luckMoney', { signData: makeSign(timeStamp) });
});

router.get('/clear',function (req, res, next) {
    //
    // client.select('81', function(error){
    //     if(error) {
    //         console.log(error);
    //     } else {
    //         // set
    //         client.flushdb();
    //     }
    // });
    // res.end("ok");
})

/* GET users listing. */
router.get('/*', function(req, res, next) {
    var timeStamp = Math.round(new Date().getTime()/1000);
    var param = req.params[0];
    res.render(param, { signData: makeSign(timeStamp) });
});



function makeSign(timeStamp) {

  let appId = "0yfoZsFJJk7PeFwZ";

  let appKey = "AiPCKjWxSYCVJw9WS3kOqVuC8gZ7LFBq";

  var sha1 = sha1Sign(timeStamp+appKey+timeStamp);

  return {
    sign:md5Sign(sha1+appId),
    timeStamp:timeStamp,
    appId:appId
  };

}

function sha1Sign(str) {

  var sha1 = crypto.createHash("sha1");//定义加密方式

  sha1.update(str);

  return sha1.digest("hex");

}

function md5Sign(str) {

  var md5 = crypto.createHash("md5");

  md5.update(str);

  return md5.digest('hex');

}

module.exports = router;
