var express = require('express');
var router = express.Router();
var c = require('../models/rail');
var l = require('../models/latest');
var j = require('../models/junction');
var multer  = require('multer')
var upload = multer({ dest: './public/images' })
/* GET home page. */
router.get('/', function (req, res) {
  res.render('home');
});

router.post('/post',upload.single('file') , function (req, res) {
  var d = req.body;
  var tlat = parseInt(d.tlat);
  var tlong = parseInt(d.tlong);
  var clat = parseInt(d.clat);
  var clong = parseInt(d.clong);
  var filename  = req.file.filename;
  var flag = 0;
  var status = 0;
  var item = { tlat: tlat, tlong: tlong, clat: clat, clong: clong, flag: flag ,status:status,filename:filename};
  l.Latest.remove({}, function (e, d) {
    if (!e) {
      console.log("All latest removed");
      var newL = new l.Latest(item);
      newL.save();
      console.log("recent updated");
    }
    else {
      console.log("Mofo mongo error");
    }
  });
  var newC = new c.Crack(item);
  newC.save(function (e, d) {
    if (!e) {
      console.log("Crack saved");
    }
    else {
      console.log(e);
    }
  });
  res.json(item);
});

router.get('/getrecent', (req, res) => {
  l.Latest.find({}, function (e, d) {
    if (!e && d[0] != undefined) {

      j.Junction.find({}, (e1, d1) => {
        var lat = d[0].clat;
        var long = d[0].clong;
        var arr = new Array();
        d1.forEach((junc) => {
          if (junc.slat < lat && junc.s3lat > lat && junc.slong == long && junc.s3long == long) {
            l.Latest.findOneAndUpdate({ clat: lat }, { $set: { clat: d[0].clat, clong: d[0].clong, tlat: d[0].tlat, tlong: d[0].tlong, flag: 1 } }, (e, d) => {
              console.log("Junction found");
            });
            c.Crack.findOneAndUpdate({ clat: lat }, { $set: { clat: d[0].clat, clong: d[0].clong, tlat: d[0].tlat, tlong: d[0].tlong, flag: 1 } }, (e, d) => {
              console.log("Junction found");
            });
            arr.push(junc);
            d1.splice(d1.indexOf(junc), 1);
            console.log(junc);
          }
        });
        var obj = {
          status:0,
          tlat: d[0].tlat,
          tlong: d[0].tlong,
          clat: d[0].clat,
          clong: d[0].clong,
          flag: d[0].flag,
          junctions: d1,
          green: arr
        }
        res.send(obj);
      });
    }
    else {
      console.log(e);
      res.send({
        status :1,
        tlat: 0,
        tlong: 0,
        clat: 0,
        clong: 0,
        flag: 0
      });
    }
  });
});

router.get('/dead', (req, res) => {
  l.Latest.find({}, (e, d) => {
    if (!e) {
      res.json({ "flag": d[0]["flag"] });
    }
    else {
      console.log(e);
    }
  });
});


router.post('/junction', (req, res) => {
  console.log(req.body);
  var newJ = new j.Junction(req.body);
  newJ.save();
  res.send("HI");
});


router.get('/cracks', (req, res) => {
  res.render('cracks');
});

router.get('/getcracks', (req, res) => {
  c.Crack.find({}, (e, d) => {
    if (!e) {
      res.json({ "data": d });
    }
    else {
      console.log(e);
    }
  });
});


router.get('/check',(req,res)=>{
  var clat =req.query.clat;
  var clong = req.query.clong;
  console.log(clat,clong);
  c.Crack.findOneAndUpdate({clat:clat,clong:clong},{$set:{"status":1}},(e,d)=>{
    console.log("One crack maintained");
  });
});



router.get('/photos',function(req,res){
  c.Crack.find({},(e,d)=>{
    res.render('photos',{"cracks":d});
  });
});



module.exports = router;
