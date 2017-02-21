import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import quotationSchema from '../model/quotation-model';
import Attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

quotationSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Quotation
          .find(_query)
          .exec((err, quotations) => {
              err ? reject(err)
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
          .exec((err, quotations) => {
              err ? reject(err)
                  : resolve(quotations);
          });
    });
});

quotationSchema.static('createQuotation', (quotation:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(quotation)) {
          return reject(new TypeError('Quotation is not a valid object.'));
        }
        Attachment.createAttachment(attachment, userId)
          .then(res => {
          var idAttachment = res.idAtt;

          var _quotation = new Quotation(quotation);
              _quotation.attachment = idAttachment;
              _quotation.development= developmentId;
              _quotation.created_by = userId;
              _quotation.save((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
              });
        })
        .catch(err=>{
          resolve({message: "attachment error"});
        })     
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
              err ? reject(err)
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
          let file:any = attachment;

          if(file!=null){
            Attachment.createAttachment(attachment, userId)
              .then(res => {
                var idAttachment = res.idAtt;

                Quotation
                  .update(_query,{
                    $set: {
                      "quotation.$.attachment": idAttachment
                    }
                  })
                  .exec((err, saved) => {
                        err ? reject(err)
                            : resolve(saved);
                   });
              })
              .catch(err=>{
                resolve({message: "attachment error"});
              }) 
          } 
          
          Quotation
            .update(_query,quotationObj)
            .exec((err, saved) => {
                  err ? reject(err)
                      : resolve(saved);
            });
    });
});


let Quotation = mongoose.model('Quotation', quotationSchema);

export default Quotation;
