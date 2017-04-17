'use strict';

import * as express from 'express';
var passport = require('passport')
import {signTokenContractor} from '../auth-service';

var router = express.Router();

router.post('/', function(req, res, next) {
  
  passport.authenticate('local.contractor', function(err, contractor, info) {
    var error = err || info;
    if(error) {
      return res.status(401).json(error);
    }
    if(!contractor) {
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }

    var token = signTokenContractor(contractor._id, contractor.role);
    res.json({ token });
  })(req, res, next);
});

export default router;
