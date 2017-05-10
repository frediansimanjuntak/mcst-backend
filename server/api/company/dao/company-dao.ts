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
          .populate("company_logo chief employee created_by")
          .exec((err, bookings) => {
              err ? reject(err)
                  : resolve(bookings);
          });
    });
});

companySchema.static('getGenerateCode', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        var generateCode = function(){
          let randomCode = Math.floor(Math.random()*9000000000) + 1000000000;;
          let _query = {"registration_no": randomCode};
          Company
            .find(_query)
            .exec((err, company) => {
              if(err){
                reject(err);
              }
              if(company){
                console.log(company);
                if(company.length != 0){
                  generateCode();
                }
                if(company.length == 0){
                  resolve(randomCode);
                }
              }
            })
        }
        generateCode();
    });
});

companySchema.static('createCompany', (company:Object, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(company)) {
          return reject(new TypeError('Company is not a valid object.'));
        }
        Company.getGenerateCode().then((code) => {
          var _company = new Company(company);
          _company.registration_no = code;
          _company.created_by = userId;
          _company.save((err, saved) => {
            err ? reject(err)
                : resolve(saved);
          });
        })
        .catch((err) => {
          reject(err);
        }) 
    });
});

companySchema.static('deleteCompany', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Company
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve({message: "delete success"});
          });
    });
});

companySchema.static('updateCompany', (id:string, userId:string, company:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        if (!_.isObject(company)) {
          return reject(new TypeError('Company is not a valid object.'));
        }
        if (!_.isObject(attachment)) {
          return reject(new TypeError('Attachment is not a valid.'));
        }

        let file:any = attachment;

        let companyObj = {$set: {}};
        for(var param in company) {
          companyObj.$set[param] = companyObj[param];
        }

        if(file != null){
          Attachment.createAttachment(attachment, userId)
            .then(res => {
              var idAttachment=res.idAtt;

              Company
                .findByIdAndUpdate(id, {
                  $push:{
                    "company_logo": idAttachment
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

        Company
          .findByIdAndUpdate(id, companyObj)
          .exec((err, saved) => {  
                err ? reject(err)
                    : resolve(saved);
          });
    });
});

companySchema.static('addEmployeeCompany', (id:string, employee:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(employee)) {
          return reject(new TypeError('Company Employee is not a valid object.'));
        }

        Company
          .findByIdAndUpdate(id,{
            $push: {
              "employee": employee
            }
          })
          .exec((err, updated) => {
                err ? reject(err)
                    : resolve(updated);
          });
    });
});

companySchema.static('removeEmployeeCompany', (id:string, employee:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(employee)) {
          return reject(new TypeError('Company Employee is not a valid object.'));
        }

        Company
          .findByIdAndUpdate(id,{
            $pull: {
              "employee": employee
            }
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
          return reject(new TypeError('Company Activation is not a valid object.'));
        }

        let body:any = company;

        Company
          .findByIdAndUpdate(id,{
            $set: {
              "active": body.active
            }
          })
          .exec((err, updated) => {
                err ? reject(err)
                    : resolve(updated);
          });
    });
});

let Company = mongoose.model('Company', companySchema);

export default Company;
