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
        let file:any = attachment;
        if(file!=null){
          let key:string = 'attachment/quotation/'+file.name;
          AWSService.upload(key, file).then(fileDetails => {
          let _attachment = new Attachment(quotation);
          _attachment.name = fileDetails.name;
          _attachment.type = fileDetails.type;
          _attachment.url = fileDetails.url;
          _attachment.created_by=userId;
          _attachment.save((err, saved)=>{
            err ? reject(err)
                : resolve(saved);
          });
          var attachmentID=_attachment._id;
          var _quotation = new Quotation(quotation);
          _quotation.attachment = attachmentID;
          _quotation.development= developmentId;
          _quotation.created_by = userId;
          _quotation.save((err, saved) => {
            err ? reject(err)
                : resolve(saved);
          });
          })
        }      
    });
});

quotationSchema.static('deleteQuotation', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Quotation
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

quotationSchema.static('updateQuotation', (id:string, userId:string, quotation:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(quotation)) {
          return reject(new TypeError('Quotation is not a valid object.'));
        }   
          let _query = {"_id":id};
          let quotationObj = {$set: {}};
          for(var param in quotation) {
            quotationObj.$set[param] = quotation[param];
           }
          let file:any = attachment;
          if(file!=null){
            let key:string = 'attachment/quotation/'+file.name;
            AWSService.upload(key, file).then(fileDetails => {
            let _attachment = new Attachment(quotation);
            _attachment.name = fileDetails.name;
            _attachment.type = fileDetails.type;
            _attachment.url = fileDetails.url;
            _attachment.created_by=userId;
            _attachment.save((err, saved)=>{
              err ? reject(err)
                  : resolve(saved);
            });
            var attachmentID=_attachment._id;
            Quotation
              .update(_query,{$set:{'quotation.$.attachment':attachmentID}})
              .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
               });
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
