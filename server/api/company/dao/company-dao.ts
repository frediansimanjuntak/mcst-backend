import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import companySchema from '../model/company-model';
import Attachment from '../../attachment/dao/attachment-dao';
import ContactDirectory from '../../contact_directory/dao/contact_directory-dao';
import {AWSService} from '../../../global/aws.service';

companySchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};
        Company
          .find(_query)
          .populate("company_logo chief employee created_by")
          .sort({"created_at": -1})
          .exec((err, companies) => {
              err ? reject({message: err.message})
                  : resolve(companies);
          });
    });
});

companySchema.static('getAllNameCompany', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};
        Company
          .find(_query)
          .select("name")
          .exec((err, companies) => {
              err ? reject({message: err.message})
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
              err ? reject({message: err.message})
                  : resolve(bookings);
          });
    });
});

companySchema.static('createCompany', (company:Object, userId:string, developmentId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(company)) {
          return reject(new TypeError('Company is not a valid object.'));
        }
        var _company = new Company(company);
        _company.created_by = userId;
        _company.save((err, company) => {
          if(err){
            reject({message: err.message});
          }
          if(company){
            let data = {
              "name": company.name,
              "type_contact": "other",
              "service": company.category,
              "register_number": company.business_registration,
              "address": company.address.full_address,
              "website": company.website,
              "contact": company.phone
            }
            ContactDirectory.createContactDirectory(data, developmentId);
            resolve (company);
          }
        });
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
              err ? reject({message: err.message})
                  : resolve({message: "delete success"});
          });
    });
});

companySchema.static('updateCompany', (id:string, userId:string, company:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let companyObj = {$set: {}};
        for (var param in company) {
          companyObj.$set[param] = companyObj[param];
        } 
        let _query = {"_id": id};     
        Company.attachmentCompany(_query, userId.toString(), attachment);
        Company
          .update(_query, companyObj)
          .exec((err, saved) => {  
                err ? reject({message: err.message})
                    : resolve(saved);
          });
    });
});

companySchema.static('attachmentCompany', (query:Object, userId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let files:any = attachment;
        if (files.attachment) {
          Attachment.createAttachment(files.attachment, userId)
            .then(res => {
              var idAttachment = res.idAtt;
              Company
                .update(query, {
                  $push:{
                    "company_logo": idAttachment
                  }
                })
                .exec((err, saved) => {
                      err ? reject({message: err.message})
                          : resolve(saved);
                 });
            })
            .catch(err=>{
                resolve({message: "attachment error"});
            })              
        }
        else {
          resolve({message: "No Attachment Files"});
        }     
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
                err ? reject({message: err.message})
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
          .findByIdAndUpdate(id, {
            $pull: {
              "employee": employee
            }
          })
          .exec((err, updated) => {
                err ? reject({message: err.message})
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
                err ? reject({message: err.message})
                    : resolve(updated);
          });
    });
});

let Company = mongoose.model('Company', companySchema);

export default Company;
