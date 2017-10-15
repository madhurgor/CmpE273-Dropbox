var express = require('express');
var router = express();
var mysql = require('./mysqlpool');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var dateTime = require('node-datetime');
var dt = dateTime.create();

const saltRounds = 10;

var bodyParser = require('body-parser');
router.use(bodyParser.json());
var urlencodedParser=bodyParser.urlencoded({extended: false});


var upload = multer({ dest: '../uploads/' })

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/login',urlencodedParser,function(req,res){
  var crypt = 'dropbox_012465401';
  //res.status(201).json({message: 'all set'});

    /*const fetchDataSQL = "select * from users where username='"+req.body.username+"' and password='"+req.body.password+"'";
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
    }, fetchDataSQL);*/
    const fetchDataSQL = "select * from users where username='"+req.body.username+"'";
    mysql.fetchData(function(err,results){
       if(err){
          throw err;
       } else {
          if(results.length > 0 && bcrypt.compareSync(req.body.password, results[0].password)) {
            const token = jwt.sign({
              username: req.body.username
            }, crypt)

            var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.body.username} ` +'log.txt', {
              flags: 'a'
            })
            logger.write('\r\nlogged in on '+new Date(dt.now()));

            logger = fs.createWriteStream(path.join(__dirname,'../../') +'log.txt', {
              flags: 'a'
            })
            logger.write(`\r\n${req.body.username} logged in on `+new Date(dt.now()));

             //console.log("Data: " + results[0].count);
             //res.status(201).res.json({count: results[0].count});
             res.status(201).json({message: "Data found", token:token});
          } else {
             console.log("No data");
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
           //console.log("Data: " + results[0].count);
           //res.status(201).res.json({count: results[0].count});
           //res.status(201).json({message: "Data found"});
           bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
             const insertDataSQL = "insert into users(firstname,lastname,username,password) values('"+req.body.firstname+"','"+req.body.lastname+"','"+req.body.username+"','"+hash+"')";

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

                 fs.writeFile(path.join(__dirname,'../../') + `/${req.body.username} ` +'log.txt', 'Created Account on '+new Date(dt.now()), function (err) {
                         if (err) throw err;
                 });

                 var logger = fs.createWriteStream(path.join(__dirname,'../../') +'log.txt', {
                   flags: 'a'
                 })
                 logger.write(`\r\n${req.body.username} signed up on `+new Date(dt.now()));

                 res.status(201).json(results);
               }
             },insertDataSQL);
           });
        } else {
           console.log("No data");
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

   var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.query.username} ` +'log.txt', {
     flags: 'a'
   })
   logger.write('\r\n Uploading file/s on '+new Date(dt.now()));

   req.files.forEach((file) => {
      var n1=0;
      while(true)
      {
        if(!fs.existsSync(path.join(__dirname,'../../') + `/${req.query.username}/normal/` + file.originalname))
        {
          fs.rename(path.join(__dirname,'../../') + '/uploads/' + file.filename, path.join(__dirname,'../../') + `/${req.query.username}/normal/` + file.originalname, function(err) {
                if ( err ) console.log('ERROR: ' + err);
            });

            logger.write('\r\n  Uploaded file \"'+file.originalname+'\" on '+new Date(dt.now()));

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

   logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.query.username} ` +'log.txt', {
     flags: 'a'
   })
   logger.write('\r\n End Uploading file/s on '+new Date(dt.now()));

   res.status(200).end()
})

router.post('/about',urlencodedParser,function (req, res) {
  const fetchDataSQL = "select * from users where username='"+req.body.username+"'";
  mysql.fetchData(function(err,results){
     if(err){
        throw err;
     } else {
        if(results.length > 0) {
           //console.log("Data: " + results[0].count);
           //res.status(201).res.json({count: results[0].count});
           res.status(201).json({message: "Data found", firstname:results[0].firstname, lastname:results[0].lastname, hobbies:results[0].hobbies, education:results[0].education, work:results[0].work, phone_no:results[0].phone_no, le:results[0].le, interest:results[0].interest});

           var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.body.username} ` +'log.txt', {
             flags: 'a'
           })
           logger.write('\r\n Checked his/her information on '+new Date(dt.now()));

        } else {
           console.log("No data");
           res.status(401).json({message: "No data"});
        }
     }
  }, fetchDataSQL);
});

router.post('/about_change',urlencodedParser,function(req, res) {
  //const insertDataSQL = "insert into users values('"+req.body.firstname+"','"+req.body.lastname+"','"+req.body.username+"','"+req.body.password+"')";
  const  insertDataSQL = "update users set firstname='"+req.body.firstname+"', lastname='"+req.body.lastname+"', phone_no='"+req.body.phone_no+"', education='"+req.body.education+"', hobbies='"+req.body.hobbies+"', work='"+req.body.work+"', le='"+req.body.le+"', interest='"+req.body.interest+"' where username='"+req.body.username+"'";

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

      var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.query.username} ` +'log.txt', {
        flags: 'a'
      })
      logger.write('\r\n Changed his/her information on '+new Date(dt.now()));

      res.status(201).json(results);
    }
  },insertDataSQL);

});

router.post('/files_fetch',urlencodedParser,function (req, res) {
  var files=[];

  var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.body.username} ` +'log.txt', {
    flags: 'a'
  })
  logger.write('\r\n Fetching file name/s on '+new Date(dt.now()));

  fs.readdirSync(path.join(__dirname,'../../') + `${req.body.username}/normal/`).forEach(file => {
    files.push(file);

   logger.write('\r\n  Fetched file name \"'+file+'\" on '+new Date(dt.now()));

  })

  logger.write('\r\n End fetching file name/s on '+new Date(dt.now()));

  res.status(201).json({files:files});
});

router.post('/files_fetchR',urlencodedParser,function (req, res) {
  var files=[];
  var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.body.username} ` +'log.txt', {
    flags: 'a'
  })
  logger.write('\r\n Fetching starred file name/s on '+new Date(dt.now()));
  fs.readdirSync(path.join(__dirname,'../../') + `${req.body.username}/star/`).forEach(file => {
    files.push(file);

   logger.write('\r\n  Fetched starred file name \"'+file+'\" on '+new Date(dt.now()));

  })

  logger.write('\r\n End fetching starred file name/s on '+new Date(dt.now()));

  res.status(201).json({files:files});
});

router.get('/download',function(req, res){

   var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.query.username} ` +'log.txt', {
     flags: 'a'
   })
   logger.write('\r\n Downloaded file \"'+req.query.file+'\" on '+new Date(dt.now()));

  res.download(path.join(__dirname,'../../')+`/${req.query.username}/normal/`+`/${req.query.file}`);
  //res.status(200).json();
});

router.get('/delete',function(req, res){

   var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.query.username} ` +'log.txt', {
     flags: 'a'
   })
   logger.write('\r\n Deleted file \"'+req.query.file+'\" on '+new Date(dt.now()));

  fs.unlinkSync(path.join(__dirname,'../../')+`/${req.query.username}/normal/`+`/${req.query.file}`);
  res.status(200).json();
});

router.get('/star',function(req, res){

   var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.query.username} ` +'log.txt', {
     flags: 'a'
   })
   logger.write('\r\n Starred file \"'+req.query.file+'\" on '+new Date(dt.now()));

  fs.writeFileSync(path.join(__dirname,'../../')+`/${req.query.username}/star/${req.query.file}`, fs.readFileSync(path.join(__dirname,'../../')+`/${req.query.username}/normal/`+`/${req.query.file}`));
  //res.download(path.join(__dirname,'../../')+`/${req.query.username}/`+`/${req.query.file}`);
  res.status(200).json();
});

router.get('/unstar',function(req, res){

   var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.query.username} ` +'log.txt', {
     flags: 'a'
   })
   logger.write('\r\n Unstarred file \"'+req.query.file+'\" on '+new Date(dt.now()));

  fs.unlinkSync(path.join(__dirname,'../../')+`/${req.query.username}/star/`+`/${req.query.file}`);
  res.status(200).json();
});

router.get('/signout',function(req, res){

  var logger = fs.createWriteStream(path.join(__dirname,'../../') + `/${req.query.username} ` +'log.txt', {
    flags: 'a'
  })
  logger.write('\r\nSigned out on '+new Date(dt.now()));

  logger = fs.createWriteStream(path.join(__dirname,'../../') +'log.txt', {
    flags: 'a'
  })
  logger.write(`\r\n${req.query.username} signed out on `+new Date(dt.now()));

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
