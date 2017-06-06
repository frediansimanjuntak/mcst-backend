import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import quotationSchema from '../model/quotation-model';
import Attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

quotationSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};
        Quotation
          .find(_query)
          .populate("development attachment company created_by")
          .exec((err, quotations) => {
              err ? reject({message: err.message})
                  : resolve(quotations);
          });
    });
});

quotationSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Quotation
          .findById(id)
          .populate("development attachment company created_by")
          .exec((err, quotations) => {
              err ? reject({message: err.message})
                  : resolve(quotations);
          });
    });
});

quotationSchema.static('createQuotation', (quotation:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(quotation)) {
          return reject(new TypeError('Quotation is not a valid object.'));
        }
        var _quotation = new Quotation(quotation);
        _quotation.development= developmentId;
        _quotation.created_by = userId;
        _quotation.save((err, saved) => {
            if (err) {
                reject(err);
            }
            else if (saved) {
                let _query = {"_id": saved._id};
                Quotation.addAttachmentQuotation(attachment, _query, userId.toString()); 
                resolve(saved);
            }
        });
    });
});

quotationSchema.static('deleteQuotation', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Quotation
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject({message: err.message})
                  : resolve({message: "Delete Success"});
          });
    });
});

quotationSchema.static('updateQuotation', (id:string, userId:string, quotation:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(quotation)) {
          return reject(new TypeError('Quotation is not a valid object.'));
        }   
        let _query = {"_id": id};
        let quotationObj = {$set: {}};
        for(var param in quotation) {
            quotationObj.$set[param] = quotation[param];
        }
        Quotation.addAttachmentQuotation(attachment, _query, userId.toString());          
        Quotation
            .update(_query,quotationObj)
            .exec((err, saved) => {
                err ? reject({message: err.message})
                    : resolve(saved);
            });
    });
});

quotationSchema.static('addAttachmentQuotation', (attachment:Object, query:Object, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {      
       let file:any = attachment;
       if (file.attachment) {
          Attachment.createAttachment(file.attachment, userId)
            .then((res) => {
              let idAttachment = res.idAtt;
              Quotation
                .update(query, {
                  $set: {
                    "attachment": idAttachment
                  }
                })
                .exec((err, saved) => {
                    err ? reject({message: err.message})
                        : resolve(saved);
                });            
            })
            .catch((err) => {
              reject({message: err.message});
            })
      }
      else {
        resolve({message: "No Attachment Files"});
      }
    });
});

let Quotation = mongoose.model('Quotation', quotationSchema);

export default Quotation;
