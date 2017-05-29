import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import contractorSchema from '../model/contractor-model';
import Attachment from '../../attachment/dao/attachment-dao';
import Company from '../../company/dao/company-dao';
import {AWSService} from '../../../global/aws.service';

contractorSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};
        Contractor
          .find(_query)
          .exec((err, contractors) => {
              err ? reject({message: err.message})
                  : resolve(contractors);
          });
    });
});

contractorSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Contractor
          .findById(id)
          .populate("company created_by")
          .exec((err, contractors) => {
              err ? reject({message: err.message})
                  : resolve(contractors);
          });
    });
});

contractorSchema.static('createContractor', (contractor:Object, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(contractor)) {
          return reject(new TypeError('Company is not a valid object.'));
        }
        let body:any = contractor;
        let companyId = body.company;
        let role = body.role;
        if (role == "employee") {
          var _contractor = new Contractor(contractor);
          _contractor.created_by = userId;
          _contractor.save((err, saved) => {
            if (err) {
              reject({message: err.message});
            }
            if (saved) {
              Company
                .findByIdAndUpdate(companyId, {
                  $push: {
                    "employee": saved._id
                  }
                })
                .exec((err, updated) => {
                  err ? reject({message: err.message})
                      : resolve(updated);
                })
            }
          });          
        }
        if (role == "admin") {
          Company
            .findById(companyId)
            .exec((err, res) => {
              if (err) {
                reject({message: err.message});
              }
              if (res) {
                if (res.chief) {
                  resolve({message: "Admin already exists"})
                }
                if (!res.chief) {
                  var _contractor = new Contractor(contractor);
                  _contractor.created_by = userId;
                  _contractor.save((err, saved) => {
                    if (err) {
                      reject({message: err.message});
                    }
                    if (saved) {
                      Company
                        .findByIdAndUpdate(companyId, {
                          $set: {
                            "chief": saved._id
                          }
                        })
                        .exec((err, updated) => {
                          err ? reject({message: err.message})
                              : resolve(updated);
                        })
                    }
                  });                  
                }
              }
            })          
        }                
    });
});


contractorSchema.static('deleteContractor', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Contractor
          .findById(id)
          .exec((err, res) => {
            if (err) {
              reject({message: err.message});
            }
            else if (res) {
              let role = res.role;
              let company = res.company;
              if (role == "admin") {
                Company
                  .update({"_id": company}, {
                    $unset: {
                      "chief": id
                    }
                  })
                  .exec((err, updated) => {
                    err ? reject({message: err.message})
                        : resolve(updated);
                  })
              }
              if (role == "employee") {
                Company
                  .update({"_id": company}, {
                    $pull: {
                      "employee": id
                    }
                  })
                  .exec((err, updated) => {
                    err ? reject({message: err.message})
                        : resolve(updated);
                  })
              }
              Contractor
                .findByIdAndRemove(id)
                .exec((err, deleted) => {
                    err ? reject({message: err.message})
                        : resolve({message: "Delete Success"});
                });
            }
          })        
    });
});

contractorSchema.static('updateContractor', (id:string, userId:string, contractor:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }       
        let contractorObj = {$set: {}};
        for(var param in contractor) {
          contractorObj.$set[param] = contractor[param];
        }
        let _query = {"_id": id}
        Contractor.attachmentContractor(_query, userId.toString(), attachment);
        Contractor
          .update(_query, contractorObj)
          .exec((err, saved) => {
              err ? reject({message: err.message})
                  : resolve(saved);
          });
    });
});

contractorSchema.static('attachmentContractor', (query:Object, userId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let file:any = attachment;        
        let attachmentfile = file.attachment;
        if (attachmentfile) {
          Attachment.createAttachment(attachmentfile, userId)
            .then(res => {
              var idAttachment = res.idAtt;
              Contractor
                .update(query, {
                    $set: {
                      "profile_picture": idAttachment
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

contractorSchema.static('activateContractor', (id:string, active:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Contractor
          .findByIdAndUpdate(id, {
              $set:{
                "active": true
              }
          })
          .exec((err, updated) => {
                err ? reject({message: err.message})
                    : resolve(updated);
          });
    });
});

contractorSchema.static('deactivateContractor', (id:string, active:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Contractor
          .findByIdAndUpdate(id, {
              $set:{
                "active": false
              }
          })
          .exec((err, updated) => {
                err ? reject({message: err.message})
                    : resolve(updated);
          });
    });
});

let Contractor = mongoose.model('Contractor', contractorSchema);

export default Contractor;
