var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var MongoClient = require('mongodb').MongoClient;
var bcrypt = require('bcrypt');
var mongoURL = "mongodb://localhost:27017/login";

module.exports = function(passport) {
  passport.use('login', new LocalStrategy(function(username, password, done) {
    MongoClient.connect(mongoURL, function(err, db) {
      if (err) {done(e,{});}
      var query = { username: username };
      db.collection("users").find(query).toArray(function(err, results) {
        if(err){
           done(e,{});
        } else {
           console.log(results);
           if(results.length > 0 && bcrypt.compareSync(password, results[0].password)) {
             done(null, {username: username});
           } else {
             done(null, false);
           }
        }
        db.close();
      });
    });
  }));
};
