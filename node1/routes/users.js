var express = require('express');
var router = express();
var mysql = require('./mysql');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken')

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
  var crypt = 'dropbox_012465401';
  //res.status(201).json({message: 'all set'});

    const fetchDataSQL = "select * from users where username='"+req.body.username+"' and password='"+req.body.password+"'";
    mysql.fetchData(function(err,results){
       if(err){
          throw err;
       } else {
          if(results.length > 0) {
            const token = jwt.sign({
              username: req.body.username
            }, crypt)
             //console.log("Data: " + results[0].count);
             //res.status(201).res.json({count: results[0].count});
             res.status(201).json({message: "Data found", token:token});
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
          const insertDataSQL = "insert into users(firstname,lastname,username,password) values('"+req.body.firstname+"','"+req.body.lastname+"','"+req.body.username+"','"+req.body.password+"')";

          mysql.insertData((err, results) => {
             if(err){
            throw err;
          }
          else
          {
            console.log("No. of results after insertion:" + results.affectedRows);
            mkdirSync('../'+req.body.username);
            mkdirSync('../'+req.body.username+'/normal');
            mkdirSync('../'+req.body.username+'/star');
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
      var n1=0;
      while(true)
      {
        if(!fs.existsSync(path.join(__dirname,'../../') + `/${req.query.username}/normal/` + file.originalname))
        {
          fs.rename(path.join(__dirname,'../../') + '/uploads/' + file.filename, path.join(__dirname,'../../') + `/${req.query.username}/normal/` + file.originalname, function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });
          //fs.unlinkSync(path.join(__dirname, file.path))
          break;
        }
        else
        {
          if(n1==0)
          {
            n1+=1;
            var ext,name,oname=file.originalname,n;
            n=oname.lastIndexOf(".");
            ext=oname.substring(n);
            name=oname.substring(0,n);
            file.originalname=name+' ('+n1+')'+ext;
          }
          else
          {
            var ext,name,oname=file.originalname,n;
            n=oname.lastIndexOf(".");
            n3=oname.lastIndexOf("(")
            n2=oname.lastIndexOf(")")
            newadd=Number(oname.substring(n3+1,n2))+1;
            ext=oname.substring(n);
            n3=oname.lastIndexOf('(');
            name=oname.substring(0,n3+1);
            file.originalname=name+newadd+')'+ext;
          }
        }
      }
   })
   res.status(200).end()
})

router.post('/about',urlencodedParser,function (req, res) {
  console.log(req.body);
  const fetchDataSQL = "select * from users where username='"+req.body.username+"'";
  mysql.fetchData(function(err,results){
     if(err){
        throw err;
     } else {
        if(results.length > 0) {
           //console.log("Data: " + results[0].count);
           //res.status(201).res.json({count: results[0].count});
           res.status(201).json({message: "Data found", firstname:results[0].firstname, lastname:results[0].lastname, hobbies:results[0].hobbies, education:results[0].education, work:results[0].work, phone_no:results[0].phone_no});
        } else {
           //console.log("No data");
           res.status(401).json({message: "No data"});
        }
     }
  }, fetchDataSQL);
});

router.post('/about_change',urlencodedParser,function(req, res) {
  console.log(req.body);
  //const insertDataSQL = "insert into users values('"+req.body.firstname+"','"+req.body.lastname+"','"+req.body.username+"','"+req.body.password+"')";
  const  insertDataSQL = "update users set firstname='"+req.body.firstname+"', lastname='"+req.body.lastname+"', phone_no='"+req.body.phone_no+"', education='"+req.body.education+"', hobbies='"+req.body.hobbies+"', work='"+req.body.work+"' where username='"+req.body.username+"'";

  /*mysql.updateData((err, results) => {
    if(err){
       throw err;
    }
    else
    {
      res.status(201).json(results);
    }
  },updateDataSQL);*/

  mysql.insertData((err, results) => {
     if(err){
    throw err;
  }
  else
  {
    console.log("No. of results after insertion:" + results.affectedRows);
    mkdirSync('../'+req.body.username);
    res.status(201).json(results);
     }
  },insertDataSQL);

});

router.post('/files_fetch',urlencodedParser,function (req, res) {
  var files=[];
  console.log(req.body);
  console.log(path.join(__dirname,'../../') + `/${req.body.username}/normal/`);
  fs.readdirSync(path.join(__dirname,'../../') + `${req.body.username}/normal/`).forEach(file => {
    files.push(file);
  })
  console.log(files);
  res.status(201).json({files:files});
});

router.post('/files_fetchR',urlencodedParser,function (req, res) {
  var files=[];
  console.log(req.body);
  console.log(path.join(__dirname,'../../') + `/${req.body.username}/star/`);
  fs.readdirSync(path.join(__dirname,'../../') + `${req.body.username}/star/`).forEach(file => {
    files.push(file);
  })
  console.log(files);
  res.status(201).json({files:files});
});

router.get('/download',function(req, res){
  console.log(req.query.file);
  res.download(path.join(__dirname,'../../')+`/${req.query.username}/normal/`+`/${req.query.file}`);
  //res.status(200).json();
});

router.get('/delete',function(req, res){
  console.log(req.query.file);
  fs.unlinkSync(path.join(__dirname,'../../')+`/${req.query.username}/normal/`+`/${req.query.file}`);
  res.status(200).json();
});

router.get('/star',function(req, res){
  console.log(req.query.file);
  fs.writeFileSync(path.join(__dirname,'../../')+`/${req.query.username}/star/${req.query.file}`, fs.readFileSync(path.join(__dirname,'../../')+`/${req.query.username}/normal/`+`/${req.query.file}`));
  //res.download(path.join(__dirname,'../../')+`/${req.query.username}/`+`/${req.query.file}`);
  res.status(200).json();
});

router.get('/unstar',function(req, res){
  fs.unlinkSync(path.join(__dirname,'../../')+`/${req.query.username}/star/`+`/${req.query.file}`);
  res.status(200).json();
});

const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

module.exports = router;
