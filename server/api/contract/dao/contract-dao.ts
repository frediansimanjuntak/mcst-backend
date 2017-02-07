import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import contractSchema from '../model/contract-model';
import Attachment from '../../attachment/dao/attachment-dao';
import Incident from '../../incident/dao/incident-dao';
import Petition from '../../petition/dao/petition-dao';
import {AWSService} from '../../../global/aws.service';

contractSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Contract
          .find(_query)
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
          .populate("development attachment quotation contract_note.attachment contract_note.posted_by contract_notice.attachment created_by")
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
        console.log(contract)

        Attachment.createAttachment(attachment, userId,).then(res => {
          var idAttachment=res.idAtt;

          var _contract = new Contract(contract);
              _contract.attachment = idAttachment;
              _contract.created_by = userId;
              _contract.development = developmentId;
              _contract.save((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
              });
              if(_contract.reference_type = "incident"){
                 Incident
                 .findByIdAndUpdate(_contract.reference_id,{
                   $set:{
                     "status":"in progress"
                   }
                 })
              }
              if(_contract.reference_type = "petition"){
                Petition
                .findByIdAndUpdate(_contract.reference_id, {
                  $set:{
                    "status":"in progress"
                  }
                })
              }

        })
        .catch(err=>{
          resolve({message:"error"});
        })                  
    });
});

contractSchema.static('deleteContract', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Contract
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

contractSchema.static('updateContract', (id:string, userId:string, contract:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(contract)) {
          return reject(new TypeError('Contract is not a valid object.'));
        }   
          let _query = {"_id":id};
          let contractObj = {$set: {}};
          for(var param in contract) {
            contractObj.$set[param] = contract[param];
           }
          let file:any = attachment;

          if(file!=null){

            Attachment.createAttachment(attachment, userId,).then(res => {
              var idAttachment=res.idAtt;

              Contract
                .update(_query,{$set:{'contract.$.attachment':idAttachment}})
                .exec((err, saved) => {
                      err ? reject(err)
                          : resolve(saved);
                 });
            })
            .catch(err=>{
              resolve({message:"error"});
            })             
          } 
          
          Contract
            .update(_query,contractObj)
            .exec((err, saved) => {
                  err ? reject(err)
                      : resolve(saved);
              });
    });
});

//contract schedule

contractSchema.static('getAllContractSchedule', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"_id":id};

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
          .select({"schedule":{$elemMatch:{"_id": new ObjectID (idcontractschedule)}}})
          .exec((err, contracts) => {
              err ? reject(err)
                  : resolve(contracts);
          });
    });
});

contractSchema.static('createContractSchedule', (id:string, contractschedule:Object, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(contractschedule)) {
        return reject(new TypeError('Contract Schedule is not a valid object.'));
      }
          Contract
            .findByIdAndUpdate(id,{
              $push:{"schedule":contractschedule}
            })
            .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
          });
    });
});

contractSchema.static('deleteContractSchedule', (id:string, idcontractschedule:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Contract
          .findByIdAndUpdate(id,{
            $pull:{"schedule":{"_id":idcontractschedule}}
          })
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

contractSchema.static('updateContractSchedule', (id:string, userId:string, contractschedule:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(contractschedule)) {
          return reject(new TypeError('Contract Schedule is not a valid object.'));
        }   
          let _query = {"_id":id};
          let contractscheduleObj = {$set: {}};
          for(var param in contractschedule) {
            contractscheduleObj.$set["schedule.$."+param] = contractschedule[param];
           }          
          
          Contract
            .update(_query,contractscheduleObj)
            .exec((err, saved) => {
                  err ? reject(err)
                      : resolve(saved);
              });
    });
});

//contract note 
contractSchema.static('getAllContractNote', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let _query = {"_id":id};

        Contract
          .find(_query)
          .select("contract_note")
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
          .select({"contract_note":{$elemMatch:{"_id": new ObjectID (idcontractnote)}}})
          .exec((err, contractnotes) => {
              err ? reject(err)
                  : resolve(contractnotes);
          });
    });
});

contractSchema.static('createContractNote', (id:string, userId:string, contract_note_remark:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(contract_note_remark)) {
        return reject(new TypeError('Contract Note is not a valid object.'));
      }              

        Attachment.createAttachment(attachment, userId,).then(res => {
          var idAttachment=res.idAtt;

          Contract
            .findByIdAndUpdate(id,{
              $push:{"contract_note.note_remark":contract_note_remark,
                     "contract_note.attachment":idAttachment,
                     "contract_note.posted_by":userId,
                     "contract_note.posted_on":new Date(),
                }
            })
            .exec((err, saved)=>{
                err ? reject(err)
                    : resolve(saved);
            });
        })
        .catch(err=>{
          resolve({message:"error"});
        })                
    });
});

contractSchema.static('deleteContractNote', (id:string, idcontractnote:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Contract
          .findByIdAndUpdate(id,{
            $pull:{"contract_note":{_id:idcontractnote}}
          })
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

contractSchema.static('updateContractNote', (id:string, idcontractnote:string, userId:string, contractnote:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(contractnote)) {
          return reject(new TypeError('Contract Note is not a valid object.'));
        }   
          let objectID = mongoose.Types.ObjectId;
          let _query = {"_id":id, "contract_note":{$elemMatch:{"_id": new objectID (idcontractnote)}}};

          let contractnoteObj = {$set: {}};
          for(var param in contractnote) {
            contractnoteObj.$set["contract_note.$."+param] = contractnote[param];
           }

          let file:any = attachment;
          var files = [].concat(attachment);
          var idAttachment = [];

          if(file!=null){
            Attachment.createAttachment(attachment, userId,).then(res => {
              var idAttachment=res.idAtt;

              Contract
                .update(_query,{$set:{'contract_note.$.attachment':idAttachment}})
                .exec((err, saved) => {
                      err ? reject(err)
                          : resolve(saved);
                 });
            })
            .catch(err=>{
              resolve({message:"error"});
            })              
          } 
          
          Contract
            .update(_query,contractnoteObj)
            .exec((err, saved) => {
                  err ? reject(err)
                      : resolve(saved);
              });
    });
});

//contract notice
contractSchema.static('getAllContractNotice', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let _query = {"_id":id};

        Contract
          .find(_query)
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

        let ObjectID = mongoose.Types.ObjectId;

        Contract
          .findById(id)
          .select({"contract_notice":{$elemMatch:{"_id": new ObjectID (idcontractnotice)}}})
          .exec((err, contractnotices) => {
              err ? reject(err)
                  : resolve(contractnotices);
          });
    });
});

contractSchema.static('createContractNotice', (id:string, userId:string, contractnotice:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(contractnotice)) {
        return reject(new TypeError('Contract Notice is not a valid object.'));
      }   
        let body:any = contractnotice;

        Attachment.createAttachment(attachment, userId,).then(res => {
          var idAttachment=res.idAtt;

          Contract
                    .findByIdAndUpdate(id,{
                      $push:{"contract_notice.title":body.note_remark,
                              "contract_notice.start_time":body.start_time,
                              "contract_notice.end_time":body.end_time,
                              "contract_notice.description":body.description,
                              "contract_notice.attachment":idAttachment,
                              "contract_notice.publish":body.publish
                        }
                    })
                    .exec((err, saved)=>{
                        err ? reject(err)
                            : resolve(saved);
                    });
        })
        .catch(err=>{
          resolve({message:"error"});
        })                   
    });
});

contractSchema.static('deleteContractNotice', (id:string, idcontractnotice:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Contract
          .findByIdAndUpdate(id,{
            $pull:{"contract_notice":{_id:idcontractnotice}}
          })
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

contractSchema.static('updateContractNotice', (id:string, idcontractnotice:string, userId:string, contractnotice:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(contractnotice)) {
          return reject(new TypeError('Contract Notice is not a valid object.'));
        } 
          let objectID = mongoose.Types.ObjectId;  
          let _query = {"contract_notice":{$elemMatch:{_id: new objectID(idcontractnotice)}}};

          let contractnoticeObj = {$set: {}};
          for(var param in contractnotice) {
            contractnoticeObj.$set["contract_notice.$."+param] = contractnotice[param];
           }

          let file:any = attachment;

          if(file!=null){
            Attachment.createAttachment(attachment, userId,).then(res => {
              var idAttachment=res.idAtt;

               Contract
                .findById(id)
                .update(_query,{$set:{'contract_notice.$.attachment':idAttachment}})
                .exec((err, saved) => {
                      err ? reject(err)
                          : resolve(saved);
                 });
            })
            .catch(err=>{
              resolve({message:"error"});
            }) 
          } 
          
          Contract
            .findById(id)
            .update(_query,contractnoticeObj)
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
        let _query = {"contract_notice":{$elemMatch:{_id: new objectID(idcontractnotice)}}};

        Contract
          .findById(id)
          .update(_query,{
              $set:{"contract_notice.$.publish":body.status}
          })
          .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let Contract = mongoose.model('Contract', contractSchema);

export default Contract;
