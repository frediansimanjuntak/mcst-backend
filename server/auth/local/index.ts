'use strict';

import * as express from 'express';
var passport = require('passport')
import {signToken} from '../auth-service';

var router = express.Router();


router.post('/', function(req, res, next) {
  passport.authenticate('local.user', function(err, user, info) {
    var error = err || info;
    var remember;
    if(error) {
      if(error.message == "Missing credentials"){
        return res.status(401).json({message: "Incomplete Data Username/Password to logged in", code: 413});
      }      
      else{
        return res.status(401).json(error);
      }
    }
    if(!user) {
      return res.status(404).json({message: 'Something went wrong, please try again.', code: 404});
    }    
    if(user._id && user.role && user.username) {
      if(!req.body.remember){
        remember = "false";
      }
      if(req.body.remember){
        remember = "true";
      }
      var token = signToken(user._id, user.role, user.default_development, remember);
      res.json({ token });
    }
    else{
      res.json({message: 'please login first.'});
    }    
  })(req, res, next);
});

export default router;
