var express = require("express");

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var db = require("../db/dbconfig");
var pdf = require('html-pdf');
var fromData = require('form-data');


var router = express.Router();

var bodyParser = require('body-parser');
router.use(bodyParser.json({limit: '50mb'}));
router.use(bodyParser.urlencoded({limit: '50mb', extended: true,
parameterLimit:50000 }));

/* GET home page. */
router.get("/", function(req, res, next) {
// sql Query
  var sqlQuery='select * from contract';

  db.query(sqlQuery, (err, rows, fields) => {
    console.log("Query executing");

    res.json(rows);
  });
});

/* GET home page. */
router.post("/save", function(req, res, next) {

  
  //console.log('body- '+req.body);
  
  console.log('pdf - '+ req.body.model);
  console.log('fileName - '+ req.body.fileName);

  
var vendorName = req.body.vendorName;
var jobName = req.body.jobName;
var signaturename = req.body.signatureDate;
var signature = req.body.signature;
var stationNumberFrom = req.body.stationNumberFrom;
var stationNumberTo = req.body.stationNumberTo;
var kmSignature = req.body.kmSignature;

// var signaturename = req.body.signatureName;
// var signature = req.body.signature;
// var signatureDate = req.body.signatureDate;

console.log('before query');
 var sql = `insert into contract(vendorName,jobName,signatureDate,signature,stationNumberFrom,stationNumberTo,kmSignature,CreatedDate) values ("${vendorName}", "${jobName}",now(),"${signature}","${stationNumberFrom}","${stationNumberTo}","${kmSignature}", now())`

 console.log('query - '+sql)
// var sql = `insert into contract(signaturename,signature,signatureDate) values ("${signaturename}", "${signature}", now())`

// var sql = `INSERT INTO products (name, sku, price, active, created_at) VALUES ("${name}", "${sku}", "${price}", 1, NOW())`;

  
  db.query(sql, function(err, result) {
    if(err){
      console.log('Error - '+err)
      res.status(500).send({error:'Something failed'})
    }
    console.log("I am connected to DB");

    res.json('success');
  
  });
});


/* GET home page. */
router.post("/pdf", function(req, res, next) {

  console.log(req.body);
  var html = req.body;

  pdf.create(html).toFile([filepath, ],function(err, res){
    console.log(res.filename);
  });
   

console.log('before query');

  
});
module.exports = router;
