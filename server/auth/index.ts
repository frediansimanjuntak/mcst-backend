'use strict';
import * as express from 'express';
import * as mongoose from 'mongoose';
import config from '../config/environment/index';
import User from '../api/user/dao/user-dao';


// console.log(User);
// Passport Configuration
require('./local/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local').default);

export default router;
