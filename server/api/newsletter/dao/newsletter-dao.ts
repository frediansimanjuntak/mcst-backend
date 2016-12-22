import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import developmentSchema from '../../development/model/development-model';


let Development = mongoose.model('Newsletter', developmentSchema);

export default Development;
