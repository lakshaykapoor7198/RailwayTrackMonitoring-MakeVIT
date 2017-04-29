var express = require('express');
var router = express.Router();
var c = require('../models/rail');
var l = require('../models/latest');
var j = require('../models/junction');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('home');
});

router.post('/post',function(req,res){
  var d = req.body;
  var tlat = d.tlat;
  var tlong = d.tlong;
  var clat = d.clat;
  var clong = d.clong;
  var flag= 0;
  var item = {tlat:tlat,tlong:tlong,clat:clat,clong:clong,flag:flag};
  l.Latest.remove({},function(e,d){
    if(!e){
      console.log("All latest removed");
      var newL = new l.Latest(item);
      newL.save();
      console.log("recent updated");
    }
    else{
      console.log("Mofo mongo error");
    }
  });
  var newC = new c.Crack(item);
  newC.save(function(e,d){
    if (!e){
      console.log("Crack saved");
    }
    else{
      console.log(e);
    }
  });
  res.json(item);
});

router.get('/getrecent',(req,res)=>{
  l.Latest.find({},function(e,d){
    if(!e){
      
      j.Junction.find({},(e1,d1)=>{
        var lat = d[0].clat;
        var long = d[0].clong;
        var arr = new Array();
        d1.forEach((junc)=>{
          if(junc.slat<lat && junc.s3lat>lat && junc.slong==long && junc.s3long==long){
            l.Latest.findOneAndUpdate({clat:lat},{$set:{clat:d[0].clat,clong:d[0].clong,tlat:d[0].tlat,tlong:d[0].tlong,flag:1}},(e,d)=>{
              console.log("Junction found");
            });
            arr.push(junc);
            d1.splice(d1.indexOf(junc),1);
            console.log(junc);
          }
        });
        var obj = {
          tlat:d[0].tlat,
          tlong:d[0].tlong,
          clat:d[0].clat,
          clong:d[0].clong,
          flag:d[0].flag,
          junctions: d1,
          green: arr
        }
        res.send(obj);
      });
    }
    else{
      console.log(e);
    }
  });
});

router.get('/dead',(req,res)=>{
  l.Latest.find({},(e,d)=>{
    if(!e){
      res.json({"flag":d[0]["flag"]});
    }
    else{
      console.log(e);
    }
  });
});


router.post('/junction',(req,res)=>{
  console.log(req.body);
  var newJ = new j.Junction(req.body);
  newJ.save();
  res.send("HI");
});


module.exports = router;
