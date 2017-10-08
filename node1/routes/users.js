var express = require('express');
var router = express();
var mysql = require('./mysql');
var multer = require('multer');
var fs = require('fs');
var path = require('path');

var bodyParser = require('body-parser');
router.use(bodyParser.json());
var urlencodedParser=bodyParser.urlencoded({extended: false});


var upload = multer({ dest: '../uploads/' })

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/login',urlencodedParser,function(req,res){
  console.log(req.body);
  //res.status(201).json({message: 'all set'});

    const fetchDataSQL = "select * from users where username='"+req.body.username+"' and password='"+req.body.password+"'";
    mysql.fetchData(function(err,results){
       if(err){
          throw err;
       } else {
          if(results.length > 0) {
             //console.log("Data: " + results[0].count);
             //res.status(201).res.json({count: results[0].count});
             res.status(201).json({message: "Data found"});
          } else {
             //console.log("No data");
             res.status(401).json({message: "No data"});
          }
       }
    }, fetchDataSQL);
});

router.post('/signup',urlencodedParser,function (req, res) {
  const fetchDataSQL = "select * from users where username='"+req.body.username+"'";
  mysql.fetchData(function(err,results){
     if(err){
        throw err;
     } else {
        if(results.length == 0) {
          console.log(results.length);
           //console.log("Data: " + results[0].count);
           //res.status(201).res.json({count: results[0].count});
           //res.status(201).json({message: "Data found"});
          const insertDataSQL = "insert into users values('"+req.body.firstname+"','"+req.body.lastname+"','"+req.body.username+"','"+req.body.password+"')";

          mysql.insertData((err, results) => {
             if(err){
            throw err;
          }
          else
          {
            console.log("No. of results after insertion:" + results.affectedRows);
                res.status(201).json(results);
             }
          },insertDataSQL);

        } else {
           //console.log("No data");
           res.status(200).json({message: "Already a user..!!"});
        }
     }
  }, fetchDataSQL);
   //res.status(201).json({message: "Signed up.."});
});

router.post('/files', upload.any(), function (req, res, next) {
   if (!req.files) {
      return next(new Error('No files uploaded'))
   }

   req.files.forEach((file) => {
     console.log(path.join(__dirname,'../'))
      console.log(file.originalname)
      fs.rename(path.join(__dirname,'../../') + '/uploads/' + file.filename, path.join(__dirname,'../../') + '/uploads/' + file.originalname, function(err) {
           if ( err ) console.log('ERROR: ' + err);
        });
      //fs.unlinkSync(path.join(__dirname, file.path))
   })
   res.status(200).end()
})


module.exports = router;
