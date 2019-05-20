var express = require("express");
var multer = require("multer");
const moment = require("moment");
const camelcaseKeys = require("camelcase-keys");

const pdfGenerator = require("../utils/pdfGenerator.js");

var upload = multer({ dest: "uploads/" });

var db = require("../db/dbconfig");
var pdf = require("html-pdf");
var fromData = require("form-data");

var router = express.Router();

var bodyParser = require("body-parser");
router.use(bodyParser.json({ limit: "50mb" }));
router.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
  })
);

/* GET home page. */
router.get("/", function(req, res, next) {
  // sql Query
  var sqlQuery = "select * from contract";

  db.query(sqlQuery, (err, rows, fields) => {
    console.log("Query executing");
    res.json(rows);
  });
});

/* GET home page. */
router.post("/save", function(req, res, next) {
  // TODO validate here
  var vendorName = req.body.vendorName;
  var jobName = req.body.jobName;
  var signatureDate = new Date(req.body.signatureDate);
  var signature = req.body.signature;
  var stationNumberFrom = req.body.stationNumberFrom;
  var stationNumberTo = req.body.stationNumberTo;
  var kmSignature = req.body.kmSignature;

  // var signaturename = req.body.signatureName;
  // var signature = req.body.signature;
  // var signatureDate = req.body.signatureDate;

  pdfid = `${jobName}-${moment(signatureDate).format("MM-DD-YYYY-HH:MM:SS")}`;

  var sigDate = db.escape(signatureDate);

  console.log("before query", req.body);
  var sql = `insert into contract(vendorName,jobName,signatureDate,signature,stationNumberFrom,stationNumberTo,kmSignature,CreatedDate,PdfUrl) values ("${vendorName}", "${jobName}", ${sigDate} ,"${signature}","${stationNumberFrom}","${stationNumberTo}","${kmSignature}", now(), "./out/${pdfid}.pdf")`;

  // console.log('query - '+sql)
  // var sql = `insert into contract(signaturename,signature,signatureDate) values ("${signaturename}", "${signature}", now())`

  // var sql = `INSERT INTO products (name, sku, price, active, created_at) VALUES ("${name}", "${sku}", "${price}", 1, NOW())`;
  let params = req.body;

  db.query(sql, function(err, result) {
    if (err) {
      console.log("Error - " + err);
      res.status(500).send({ error: "Something failed" });
    }
    console.log("I am connected to DB", result.insertId);
    pdfGenerator(
      params,
      "http://localhost:3000/pdfSource/",
      `${__dirname}/../public/out/${pdfid}.pdf`
    );
    res.json({
      status: "success",
      id: result.insertId.toString(),
      pdf: `./out/${pdfid}.pdf`
    });
  });
});

/* GET home page. */
router.post("/pdf", function(req, res, next) {
  console.log(req.body);
  var html = req.body;

  pdf.create(html).toFile([filepath], function(err, res) {
    console.log(res.filename);
  });

  console.log("before query");
});





/* GET home page. */
router.post("/list", function(req, res, next) {
  var jobName = req.body.jobName;
  var dateFrom = req.body.dateFrom;
  var dateTo = req.body.dateTo;
  var stationNumberFrom = req.body.stationNumberFrom;
  var stationNumberTo = req.body.stationNumberTo;

  //console.log(req.body);
  var conditions = ` where 1=1 `;
  if (jobName != undefined && jobName != "") {
    conditions = conditions + ` and JobName like '%${jobName}%' `;
  }

  if (stationNumberFrom != undefined && stationNumberFrom != "") {
    conditions =
      conditions + ` and stationNumberFrom like '%${stationNumberFrom}%' `;
  }

  if (stationNumberTo != undefined && stationNumberTo != "") {
    conditions =
      conditions + ` and stationNumberTo like '%${stationNumberTo}%' `;
  }

  if (dateFrom != undefined && dateFrom != "") {
    var signatureDateFrom = moment(dateFrom).format("YYYY-MM-DD");

    conditions = conditions + ` and SignatureDate >= '${signatureDateFrom}' `;
  }
  if (dateTo != undefined && dateTo != "") {
    var signatureDateTo = moment(dateTo).add(1, 'days').format("YYYY-MM-DD");    //.add(1, 'd');

    conditions = conditions + ` and SignatureDate <= '${signatureDateTo}' `;
  }

  conditions = conditions + ` order by CreatedDate desc `;
  

  //console.log("Conditions - " + conditions);
  console.log("before query", req.body);
  var sqlQuery = `SELECT id, vendorName, jobName, signatureDate, stationNumberFrom, stationNumberTo, createdDate, pdfUrl FROM contract`;

  var sqlQuery = sqlQuery + conditions;

  console.log("complete Query - " + sqlQuery);

  db.query(sqlQuery, (err, rows, fields) => {
    console.log("Query executing");

    var camleData = camelcaseKeys(rows);
    //console.log(camleData);

    res.json(camleData);
  });
});

module.exports = router;
