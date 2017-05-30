import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import faqSchema from '../model/faq-model';

faqSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};
        Faq
            .find(_query)
            .populate({
                path: 'created_by',
                model: 'User',
                select: '-salt -password'
            })
            .exec((err, faqs) => {
                err ? reject({message: err.message})
                    : resolve(faqs);
            });
    });
});

faqSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        Faq
            .findById(id)
            .populate({
                path: 'created_by',
                model: 'User',
                select: '-salt -password'
            })
            .exec((err, faqs) => {
                err ? reject({message: err.message})
                    : resolve(faqs);
            });
    });
});

faqSchema.static('getByFilter', (filter:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        Faq
            .find({'for': filter})
            .populate({
                path: 'created_by',
                model: 'User',
                select: '-salt -password'
            })
            .exec((err, faqs) => {
                err ? reject({message: err.message})
                    : resolve(faqs);
            });
    });
});

faqSchema.static('createFaq', (faqs:Object, created_by:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(faqs)) {
          return reject(new TypeError('FAQ is not a valid object.'));
        }
        var ObjectID = mongoose.Types.ObjectId;  
        let body:any = faqs;        
        var _faqs = new Faq(faqs);
        _faqs.created_by = created_by;
        _faqs.save((err, saved)=>{
          err ? reject({message: err.message})
              : resolve(saved);
        });
    });
});

faqSchema.static('deleteFaq', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Faq
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
            err ? reject({message: err.message})
                : resolve();
          });
        
    });
});

faqSchema.static('updateFaq', (id:string, faqs:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(faqs)) {
          return reject(new TypeError('FAQ is not a valid object.'));
        }
        Faq
          .findByIdAndUpdate(id, faqs)
          .exec((err, update) => {
            err ? reject({message: err.message})
                : resolve(update);
          });
    });
});

let Faq = mongoose.model('Faq', faqSchema);

export default Faq;