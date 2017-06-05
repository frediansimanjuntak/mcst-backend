import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import contractSchema from '../model/contract-model';
import Attachment from '../../attachment/dao/attachment-dao';
import Incident from '../../incident/dao/incident-dao';
import Petition from '../../petition/dao/petition-dao';
import Company from '../../company/dao/company-dao';
import {AWSService} from '../../../global/aws.service';
import {GlobalService} from '../../../global/global.service';

contractSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};

        Contract
          .find(_query)
          .populate("development company attachment quotation contract_note.attachment contract_notice.attachment")
          .populate({
              path: 'contract_note.posted_by',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .sort({"created_at": -1})
          .exec((err, contracts) => {
              err ? reject({message: err.message})
                  : resolve(contracts);
          });
    });
});

contractSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Contract
          .findById(id)
          .populate("development company attachment quotation contract_note.attachment contract_notice.attachment ")
          .populate({
              path: 'contract_note.posted_by',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .exec((err, contracts) => {
              err ? reject({message: err.message})
                  : resolve(contracts);
          });
    });
});

contractSchema.static('changeIncidentStatus', (id:string, idContract:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id && idContract)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Incident
          .findByIdAndUpdate(id, {
            $set: {
              "status": "in progress",
              "contract": idContract
            }
          })
          .exec((err, saved) => {
            err ? reject({message: err.message})
                : resolve(saved);
          });
    });
});

contractSchema.static('addContractInPetition', (id:string, idContract:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id && idContract)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Petition
          .findByIdAndUpdate(id, {
            $set: {
              "contract": idContract
            }
          })
          .exec((err, saved) => {
            err ? reject({message: err.message})
                : resolve(saved);
          });
    });
});

contractSchema.static('generateCode', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        var generateCode = function() {
          let randomCode = GlobalService.randomCode();
          let _query = {"reference_no": randomCode};
          Contract
            .find(_query)
            .exec((err, contract) => {
              if (err) {
                reject({message: err.message});
              }
              if (contract) {
                if (contract.length > 0) {
                  generateCode();
                }
                else {
                  resolve(randomCode);
                }
              }
            })
        }
        generateCode();
    });
});

contractSchema.static('createContract', (contract:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(contract)) {
          return reject(new TypeError('Contract is not a valid object.'));
        }
        let body:any = contract;
        Contract.generateCode().then((code) => {
          var _contract = new Contract(body);
          _contract.created_by = userId;
          _contract.reference_no = code;
          _contract.development = developmentId;
          _contract.confirmation.costumer.sign = body.sign;
          _contract.confirmation.costumer.date = new Date();
          _contract.save((err, contract) => {
            if (err) {
              reject({message: err.message});
            }
            else if (contract) {
              if (body.new_company) {
                Company.createCompany(body.new_company, userId, developmentId.toString()).then((company) => {
                  let idCompany = company._id;
                  contract.company = idCompany;
                  contract.save((err, saved) => {
                    if (err) {
                      reject({message: err.message});
                    }
                  })
                })
                .catch((err) => {
                  reject({message: err.message});
                })
              }
              if (contract.reference_type == "incident") {
                Contract.changeIncidentStatus(contract.reference_id.toString(), contract._id.toString());
              }
              if (contract.reference_type == "petition") {
                Contract.addContractInPetition(contract.reference_id.toString(), contract._id.toString());
              }
              if (attachment) {
                let _query = {"_id": contract._id};
                Contract.attachmentContract(_query, userId.toString(), attachment);                
              }
              resolve(contract);
            }
          });
        })
        .catch((err) => {
          reject({message: err.message});
        })                                  
    });
});

contractSchema.static('deleteContract', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Contract
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject({message: err.message})
                  : resolve({message: "Delete Success"});
          });
    });
});

contractSchema.static('updateContract', (id:string, userId:string, contract:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let body: any = contract;
        let _query = {"_id": id};
        let contractObj = {$set: {}};
        if (body.file == 'not null') {
          Contract.attachmentContract(_query, userId.toString(), attachment).then(res => {
            Contract
              .update(_query, {
                $set: {
                  'start_time': body.start_time,
                  'end_time': body.end_time,
                  'contract_type': body.contract_type,
                  'title': body.title,
                  'remark': body.remark,
                  'updated_at': new Date()
                }
              })
              .exec((err, saved) => {
                err ? reject({message: err.message})
                    : resolve(saved);             
              });    
          });
        }
        else {
          Contract
            .update(_query, {
              $set: {
                'start_time': body.start_time,
                'end_time': body.end_time,
                'contract_type': body.contract_type,
                'title': body.title,
                'remark': body.remark,
                'updated_at': new Date()
              }
            })
            .exec((err, saved) => {
              err ? reject({message: err.message})
                  : resolve(saved);             
            });
        }
    });
});

contractSchema.static('attachmentContract', (query:Object, userId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let file:any = attachment;        
        let attachmentfile = file.attachment;
        if (attachmentfile) {
          Attachment.createAttachment(attachmentfile, userId)
            .then(res => {
              var idAttachment = res.idAtt;
              Contract
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
            .catch(err=>{
              resolve({message: "attachment error"});
            })             
        } 
        else {
          resolve({message: "No Attachment Files"});
        }
    });
});

//contract schedule
contractSchema.static('getAllContractSchedule', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }        
        Contract
          .findById(id)
          .exec((err, contracts) => {
              err ? reject({message: err.message})
                  : resolve(contracts.schedule);
          });
    });
});

contractSchema.static('getByIdContractSchedule', (id:string, idcontractschedule:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let ObjectID = mongoose.Types.objectId;
        Contract
          .findById(id)
          .select({
            "schedule": {
              $elemMatch: {
                "_id": new ObjectID (idcontractschedule)
              }
            }
          })
          .exec((err, contracts) => {
              err ? reject({message: err.message})
                  : resolve(contracts);
          });
    });
});

contractSchema.static('createContractSchedule', (id:string, contractschedule:Object, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
              return reject(new TypeError('Id is not a valid string.'));
        }
        Contract
          .findByIdAndUpdate(id, {
            $push : {"schedule": contractschedule}
          })
          .exec((err, saved) => {
            err ? reject({message: err.message})
                : resolve(saved);
          });
    });
});

contractSchema.static('deleteContractSchedule', (id:string, idcontractschedule:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Contract
          .findByIdAndUpdate(id, {
            $pull : {
              "schedule": {
                "_id": idcontractschedule
              }
            }
          })
          .exec((err, deleted) => {
              err ? reject({message: err.message})
                  : resolve({message: "Delete Success"});
          });
    });
});

contractSchema.static('updateContractSchedule', (id:string, userId:string, contractschedule:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let _query = {"_id": id};
        let contractscheduleObj = {$set: {}};
        for(var param in contractschedule) {
          contractscheduleObj.$set["schedule.$."+param] = contractschedule[param];
         }                    
        Contract
          .update(_query, contractscheduleObj)
          .exec((err, saved) => {
                err ? reject({message: err.message})
                    : resolve(saved);
          });
    });
});

//contract note 
contractSchema.static('getAllContractNote', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};
        Contract
          .find(_query)
          .select("contract_note")
          .populate("contract_note.attachment contract_note.posted_by")
          .sort({"contract_note.posted_on": -1})
          .exec((err, contractnotes) => {
              err ? reject({message: err.message})
                  : resolve(contractnotes);
          });
    });
});

contractSchema.static('getContractNote', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let _query = {"_id": id};
        Contract
          .findOne(_query)
          .select("contract_note")
          .populate("contract_note.attachment contract_note.posted_by")
          .sort({"contract_note.posted_on": -1})
          .exec((err, contractnotes) => {
              err ? reject({message: err.message})
                  : resolve(contractnotes);
          });
    });
});

contractSchema.static('getByIdContractNote', (id:string, idcontractnote:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let ObjectID = mongoose.Types.ObjectId;
        Contract
          .findById(id)
          .populate("contract_note.attachment contract_note.posted_by")
          .select({"contract_note": {$elemMatch: {"_id" : new ObjectID (idcontractnote)}}})
          .exec((err, contract) => {
            if (err) {
              reject({message: err.message});
            }
            else if (contract) {
                resolve(contract);
                // if(contract.contract_note.length > 0){
                //     _.each(contract.contract_note, (err, result) => {
                //         err ? reject({message: err.message})
                //             : resolve(result);
                //     }) 
                // }  
                // else {
                //     resolve({message: "No Data in Contract Note"})
                // }                            
            }
          });
    });
});

contractSchema.static('createContractNote', (id:string, userId:string, contract_note:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
              return reject(new TypeError('Id is not a valid string.'));
        }
        let body:any = contract_note; 
        Attachment.createAttachment(attachment, userId)
          .then(res => {
            var idAttachment = res.idAtt;
            Contract
              .findByIdAndUpdate(id,{
                $push:{
                  "contract_note": {
                    "note_remark": body.note_remark,
                    "attachment": idAttachment,
                    "posted_by": userId,
                    "posted_on": new Date()
                  }
                },
                $set:{
                  "status" : body.status,
                  "updated_at": new Date()
                }
              })
              .exec((err, saved) => {
                  if (err) {
                      reject(err);
                  }
                  else if (saved) {
                    if (body.status == "closed") {
                        Contract
                            .findById(id)
                            .exec((err, contract) => {
                                if (err) {
                                    reject(err);
                                }
                                else if (contract) {
                                    let refId = contract.reference_id;
                                    if (contract.reference_type == "incident") {
                                        Contract.changeStatusBooking(refId);
                                    }
                                    else if (contract.reference_type == "petition") {
                                        Contract.changeStatusPetition(refId);
                                    }   
                                    resolve(contract);                         
                                }
                            })                 
                    }
                  }
              });                        
          })
          .catch(err=>{
            resolve({message: "attachment error"});
          })                
    });
});

contractSchema.static('changeStatusBooking', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        Incident
            .update({"_id": id}, {
                $set: {
                    "status": "resolved"
                }
            })
            .exec((err, saved) => {
                err ? reject({message: err.message})
                    : resolve(saved);
            });
    });
});

contractSchema.static('changeStatusPetition', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        Petition
            .update({"_id": id}, {
                $set: {
                    "status": "resolved"
                }
            })
            .exec((err, saved) => {
                err ? reject({message: err.message})
                    : resolve(saved);
            });
    });
});

contractSchema.static('deleteContractNote', (id:string, idcontractnote:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Contract
          .update({"_id": id}, {
            $pull: {
              "contract_note" :{ "_id": idcontractnote}
            }
          })
          .exec((err, deleted) => {
              err ? reject({message: err.message})
                  : resolve({message: "Delete Success"});
          });
    });
});

contractSchema.static('updateContractNote', (id:string, idcontractnote:string, userId:string, contractnote:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let body:any = contractnote  
        let objectID = mongoose.Types.ObjectId;
        let _query = {"_id": id, "contract_note": {$elemMatch:{"_id": new objectID (idcontractnote)}}};
        let contractnoteObj = {$set: {}};          
        for(var param in contractnote) {
          contractnoteObj.$set["contract_note.$."+param] = contractnote[param];
        }
        Contract.attachmentContract(_query, userId.toString(), attachment);        
        Contract            
          .update(_query, {contractnoteObj, $set: {"updated_at": new Date()}})
          .exec((err, saved) => {
                err ? reject({message: err.message})
                    : resolve(saved);
            });
    });
});

//contract notice
contractSchema.static('getAllContractNotice', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Contract
          .find(_query)
          .select("contract_notice")
          .exec((err, contractnotices) => {
              err ? reject({message: err.message})
                  : resolve(contractnotices);
          });
    });
});

contractSchema.static('getContractNotice', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let _query = {"_id": id};
        Contract
          .findOne(_query)
          .select("contract_notice")
          .exec((err, contractnotices) => {
              err ? reject({message: err.message})
                  : resolve(contractnotices);
          });
    });
});

contractSchema.static('getByIdContractNotice', (id:string, idcontractnotice:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }        
        let ObjectID = mongoose.Types.ObjectId;
        Contract
          .findById(id)
          .select({"contract_notice": {$elemMatch: {"_id": new ObjectID (idcontractnotice)}}})
          .populate("contract_notice.attachment")
          .exec((err, contractnotices) => {
            if (err) {
              reject({message: err.message});
            }
            else if (contractnotices) {
                resolve(contractnotices);
            }
          });
    });
});

contractSchema.static('createContractNotice', (id:string, userId:string, contractnotice:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        } 
        let body:any = contractnotice;
        Attachment.createAttachment(attachment, userId,)
          .then(res => {
            var idAttachment = res.idAtt;
            Contract
              .findByIdAndUpdate(id,{
                $push: {
                  "contract_notice": {
                    "title": body.title,
                    "start_time": body.start_time,
                    "end_time": body.end_time,
                    "description": body.description,
                    "attachment": idAttachment,
                    "created_at": new Date(),
                    "publish": body.publish
                  }
                },
                $set: {"updated_at": new Date()}
              })
              .exec((err, saved)=>{
                  err ? reject({message: err.message})
                      : resolve(saved);
              });
          })
          .catch(err=>{
            resolve({message: "attachment error"});
          })                   
    });
});

contractSchema.static('deleteContractNotice', (id:string, idcontractnotice:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Contract
          .findByIdAndUpdate(id, {
            $pull:{
              "contract_notice": {
                "_id": idcontractnotice
              }
            }
          })
          .exec((err, deleted) => {
              err ? reject({message: err.message})
                  : resolve();
          });
    });
});

contractSchema.static('updateContractNotice', (id:string, idcontractnotice:string, userId:string, contractnotice:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }        
        let objectID = mongoose.Types.ObjectId;  
        let _query = {"contract_notice": {$elemMatch: {_id: new objectID(idcontractnotice)}}};
        let contractnoticeObj = {$set: {}};
        for(var param in contractnotice) {
          contractnoticeObj.$set["contract_notice.$."+param] = contractnotice[param];
        }
        Contract.attachmentContract(_query, userId.toString(), attachment);        
        Contract
          .findById(id)
          .update(_query, {contractnoticeObj, $set:{"updated_at": new Date()}})
          .exec((err, saved) => {
                err ? reject({message: err.message})
                    : resolve(saved);
            });
    });
});

contractSchema.static('publishContractNotice', (id:string, idcontractnotice:string, contractnotice:Object ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let body:any = contractnotice;
        let objectID = mongoose.Types.ObjectId;  
        let _query = {"contract_notice": {$elemMatch: {_id: new objectID(idcontractnotice)}}};
        Contract
          .findById(id)
          .update(_query,{
              $set: {
                "contract_notice.$.publish": true
              }
          })
          .exec((err, updated) => {
              err ? reject({message: err.message})
                  : resolve(updated);
          });
    });
});

let Contract = mongoose.model('Contract', contractSchema);

export default Contract;
