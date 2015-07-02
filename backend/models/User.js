'use strict';

var bcrypt   = require('bcrypt-nodejs');
var eat      = require('eat');
var mongoose = require('mongoose');

// DB Schema for User
var UserSchema = mongoose.Schema({
  eat: Number,
  basic: {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  }
});

// User Methods
UserSchema.methods.generateHash = function generateHash(password, callback) {
  bcrypt.genSalt(8, function(err, salt) {
    bcrypt.hash(password, salt, null, function saveHashedPassword(err, hash) {
      callback(err, hash);
    });
  });
};

UserSchema.methods.generateToken = function generateToken(secret, callback) {
  this.eat = new Date().getTime();
  this.save(function(err, user) {
    if (err) {
      return callback(err, null);
    }
    eat.encode({eat: user.eat}, secret, function encodeEat(err, eatoken) {
      if (err) {
        console.log('Error encoding eat. Error: ', err);
        return callback(err, null);
      }
      callback(null, eatoken);
    });
  });
};

UserSchema.methods.invalidateToken = function invalidateToken(callback) {
  this.eat = null;
  this.save(function(err, user) {
    if (err) {
      console.log('Could not save invalidated token. Error: ', err);
      return callback(err);
    }
    callback(null, user);
  });
};

UserSchema.methods.checkPassword = function checkPassword(password, callback) {
  bcrypt.compare(password, this.basic.password, function validatePassword(err, res) {
    if (err) throw err;
    callback(res);  // if failure, res=false. if success, res=true
  });
};

// Export mongoose model/schema
module.exports = mongoose.model('User', UserSchema);
