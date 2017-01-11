import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import companySchema from '../model/company-model';
import Attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

companySchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Company
          .find(_query)
          .exec((err, companies) => {
              err ? reject(err)
                  : resolve(companies);
          });
    });
});

companySchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Company
          .findById(id)
          .exec((err, bookings) => {
              err ? reject(err)
                  : resolve(bookings);
          });
    });
});

companySchema.static('createCompany', (company:Object, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(company)) {
        return reject(new TypeError('Company is not a valid object.'));
      }

      var _company = new Company(company);
      _company.created_by = userId;
      _company.save((err, saved) => {
        err ? reject(err)
            : resolve(saved);
      });
    });
});

companySchema.static('deleteCompany', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Company
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

companySchema.static('updateCompany', (id:string, userId:string, company:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(company)) {
          return reject(new TypeError('Company is not a valid object.'));
        }
            let file:any = company.files.attachmentfile;
            if(file!=null){
              let key:string = 'attachment/company/'+file.name;
              AWSService.upload(key, file).then(fileDetails => {
              let _attachment = new Attachment(company);
              _attachment.name = fileDetails.name;
              _attachment.type = fileDetails.type;
              _attachment.url = fileDetails.url;
              _attachment.created_by=userId;
              _attachment.save((err, saved)=>{
                err ? reject(err)
                    : resolve(saved);
              });
              var attachmentID=_attachment._id;
              Company
                .findByIdAndUpdate(id,{$push:{'company_logo':attachmentID}})
                .exec((err, saved) => {
                      err ? reject(err)
                          : resolve(saved);
                 });
              })
            }        
        let companyObj = {$set: {}};
        for(var param in company) {
          companyObj.$set[param] = companyObj[param];
         }
        Company
          .findByIdAndUpdate(id,companyObj)
          .exec((err, saved) => {  
                err ? reject(err)
                    : resolve(saved);
          });
    });
});

companySchema.static('addEmployeeCompany', (id:string, company:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(company)) {
          return reject(new TypeError('Company is not a valid object.'));
        }

        Company
        .findByIdAndUpdate(id,{
          $push:{employee:company.employee}
        })
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

companySchema.static('removeEmployeeCompany', (id:string, company:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(company)) {
          return reject(new TypeError('Company is not a valid object.'));
        }

        Company
        .findByIdAndUpdate(id,{
          $pull:{employee:company.employee}
        })
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

companySchema.static('activationCompany', (id:string, company:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(company)) {
          return reject(new TypeError('Company is not a valid object.'));
        }

        Company
        .findByIdAndUpdate(id,{
          $set:{active:company.active}
        })
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let Company = mongoose.model('Company', companySchema);

export default Company;
