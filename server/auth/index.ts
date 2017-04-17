'use strict';
import * as express from 'express';
import * as mongoose from 'mongoose';
import config from '../config/environment/index';
import User from '../api/user/dao/user-dao';
import Contractor from '../api/contractor/dao/contractor-dao';

// console.log(User);
// Passport Configuration
require('./local/passport').setup(User, config);
require('./local-contractor/passport').setup(Contractor, config);

var router = express.Router();

router.use('/local', require('./local').default);
router.use('/local-contractor', require('./local-contractor').default);

export default router;
