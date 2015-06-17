'use strict';

var Message = require('../models/Message');
var bodyparser = require('body-parser');

module.exports = function (router) {
  router.use(bodyparser.json());
  //get all messages
  router.get('/messages/getmessages', function (req, res) {

    Message.find({}, function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json(data);
    });
  });
  //create message
  router.post('/messages/createmessage', function (req, res) {
    var newMessage = new Message(req.body);
    newMessage.save(function (err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }
      res.json(data);
    });
  });
}