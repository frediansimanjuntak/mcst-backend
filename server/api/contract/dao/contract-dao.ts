import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import contractSchema from '../model/contract-model';
import Attachment from '../../attachment/dao/attachment-dao';
import Incident from '../../incident/dao/incident-dao';
import Petition from '../../petition/dao/petition-dao';
import {AWSService} from '../../../global/aws.service';

contractSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};

        Contract
          .find(_query)
          .populate("development company attachment quotation contract_note.attachment contract_note.posted_by contract_notice.attachment created_by")
          .exec((err, contracts) => {
              err ? reject(err)
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
          .populate("development company attachment quotation contract_note.attachment contract_note.posted_by contract_notice.attachment created_by")
          .exec((err, contracts) => {
              err ? reject(err)
                  : resolve(contracts);
          });
    });
});

contractSchema.static('createContract', (contract:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(contract)) {
          return reject(new TypeError('Contract is not a valid object.'));
        }
          let body:any = contract;

          Attachment.createAttachment(attachment, userId)
            .then(res => {
              var idAttachment=res.idAtt;

              var _contract = new Contract(contract);
              _contract.attachment = idAttachment;
              _contract.created_by = userId;
              _contract.development = developmentId;
              _contract.save((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
              });

              if(_contract.reference_type == "incident"){
                  Incident
                    .findByIdAndUpdate(_contract.reference_id, {
                      $set: {
                        "status": "in progress",
                        "contract": _contract._id
                      }
                    })
                    .exec((err, saved) => {
                      err ? reject(err)
                          : resolve(saved);
                    });
              }
              if(_contract.reference_type == "petition"){
                  Petition
                    .findByIdAndUpdate(_contract.reference_id, {
                      $set:{
                        "status": "in progress"
                      }
                    })
                    .exec((err, saved) => {
                        err ? reject(err)
                            : resolve(saved);
                    });
              }
            })
            .catch(err => {
              resolve({message: "attachment error"});
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
              err ? reject(err)
                  : resolve({message: "Delete Success"});
          });
    });
});

contractSchema.static('updateContract', (id:string, userId:string, contract:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        let body:any = contract;
        let file:any = attachment;        
        let attachmentfile = file.attachment;
        let _query = {"_id": id};

        if(attachmentfile){
          Attachment.createAttachment(attachmentfile, userId)
            .then(res => {
              var idAttachment = res.idAtt;
              Contract
                .update(_query, {
                    $set: {
                      "attachment": idAttachment
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
        
        Contract
          .update(_query, {
              $set:{
                "title": body.title,
                "contract_type": body.contract_type,
                "remark": body.remark,
                "start_time": body.start_time,
                "end_time": body.end_time,
                "updated_at": new Date()
              }
          })
          .exec((err, saved) => {
            err ? reject(err)
                : resolve(saved);             
          });
    });
});

//contract schedule
contractSchema.static('getAllContractSchedule', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        
        let _query = {"_id": id};

        Contract
          .find(_query)
          .exec((err, contracts) => {
              err ? reject(err)
                  : resolve(contracts);
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
              err ? reject(err)
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
            err ? reject(err)
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
              err ? reject(err)
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
                err ? reject(err)
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
          .exec((err, contractnotes) => {
              err ? reject(err)
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
          .exec((err, contractnotes) => {
              err ? reject(err)
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
          .select({"contract_note": {
              $elemMatch: {
                "_id" : new ObjectID (idcontractnote)
              }
            }
          })
          .exec((err, contractnotes) => {
            if(err){
              reject(err);
            }
            if(contractnotes){
                _.each(contractnotes.contract_note, (err, result) => {
                  if(err){
                    reject(err);
                  }
                  if(result){
                    resolve(result);
                  }
                })
                
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
        var referenceId = body.reference_id;  
        console.log(body);

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
              .exec((err, saved)=>{
                  err ? reject(err)
                      : resolve(saved);
              }); 
              if(body.status == "closed" && referenceId){
                  console.log(body.status)
                  Incident
                    .findByIdAndUpdate(referenceId, {
                      $set: {
                        "status": "resolved"
                      }
                    })
                    .exec((err, saved) => {
                        err ? reject(err)
                            : resolve(saved);
                    });
              }         
          })
          .catch(err=>{
            resolve({message: "attachment error"});
          })                
    });
});

contractSchema.static('deleteContractNote', (id:string, idcontractnote:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        console.log("ni id contracts"+ id);
        console.log("ni id contracts note"+ idcontractnote);

        Contract
          .update({"_id": id}, {
            $pull: {
              "contract_note" :{ "_id": idcontractnote}
            }
          })
          .exec((err, deleted) => {
              err ? reject(err)
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

        let file:any = attachment;
        var files = [].concat(attachment);
        var idAttachment = [];

        if(file != null){
          Attachment.createAttachment(attachment, userId)
            .then(res => {
              var idAttachment = res.idAtt;

              Contract
                .update(_query,{
                  $set:{
                    "contract_note.$.attachment": idAttachment                    
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
        
        Contract            
          .update(_query, {contractnoteObj, $set: {"updated_at": new Date()}})
          .exec((err, saved) => {
                err ? reject(err)
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
              err ? reject(err)
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
              err ? reject(err)
                  : resolve(contractnotices);
          });
    });
});

contractSchema.static('getByIdContractNotice', (id:string, idcontractnotice:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        if (!_.isString(idcontractnotice)) {
            return reject(new TypeError('Id Contract Notice not a valid string.'));
        }
        
        let ObjectID = mongoose.Types.ObjectId;

        Contract
          .findById(id)
          .select({
            "contract_notice": {
              $elemMatch: {
                "_id": new ObjectID (idcontractnotice)
              }
            }
          })
          .populate("contract_notice.attachment")
          .exec((err, contractnotices) => {
            if(err){
              reject(err);
            }
            if(contractnotices){
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
                  err ? reject(err)
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
              err ? reject(err)
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

        let file:any = attachment;

        if(file != null){
          Attachment.createAttachment(attachment, userId)
            .then(res => {
              var idAttachment = res.idAtt;

               Contract
                .findById(id)
                .update(_query, {
                  $set: {
                    "contract_notice.$.attachment": idAttachment
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
        
        Contract
          .findById(id)
          .update(_query, {contractnoticeObj, $set:{"updated_at": new Date()}})
          .exec((err, saved) => {
                err ? reject(err)
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
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let Contract = mongoose.model('Contract', contractSchema);

export default Contract;
