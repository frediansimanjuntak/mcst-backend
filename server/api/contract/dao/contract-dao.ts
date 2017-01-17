import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import contractSchema from '../model/contract-model';
import Attachment from '../../attachment/dao/attachment-dao';
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
          .exec((err, contracts) => {
              err ? reject(err)
                  : resolve(contracts);
          });
    });
});

contractSchema.static('createContract', (contract:Object, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(contract)) {
        return reject(new TypeError('Contract is not a valid object.'));
      }
        let file:any = contract.files.attachmentfile;
        if(file!=null){
          let key:string = 'attachment/contract/'+file.name;
          AWSService.upload(key, file).then(fileDetails => {
          let _attachment = new Attachment(contract);
          _attachment.name = fileDetails.name;
          _attachment.type = fileDetails.type;
          _attachment.url = fileDetails.url;
          _attachment.created_by=userId;
          _attachment.save((err, saved)=>{
            err ? reject(err)
                : resolve(saved);
          });
          var attachmentID=_attachment._id;
          var _contract = new Contract(contract);
          _contract.attachment = attachmentId;
          _contract.created_by = userId;
          _contract.save((err, saved) => {
            err ? reject(err)
                : resolve(saved);
          });
          })
        }      
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

contractSchema.static('updateContract', (id:string, userId:string, contract:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(contract)) {
          return reject(new TypeError('Contract is not a valid object.'));
        }   
          let _query = {"_id":id};
          let contractObj = {$set: {}};
          for(var param in contract) {
            contractObj.$set[param] = contract[param];
           }
          let file:any = contract.files.attachmentfile;
          if(file!=null){
            let key:string = 'attachment/contract/'+file.name;
            AWSService.upload(key, file).then(fileDetails => {
            let _attachment = new Attachment(contract);
            _attachment.name = fileDetails.name;
            _attachment.type = fileDetails.type;
            _attachment.url = fileDetails.url;
            _attachment.created_by=userId;
            _attachment.save((err, saved)=>{
              err ? reject(err)
                  : resolve(saved);
            });
            var attachmentID=_attachment._id;
            Contract
              .update(_query,{$set:{'contract.$.attachment':attachmentID}})
              .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
               });
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

contractSchema.static('createContractNote', (id:string, userId:string, contractnote:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(contractnote)) {
        return reject(new TypeError('Contract Note is not a valid object.'));
      }              

        let file:any = contractnote.files.attachmentfile;
        if(file!=null){
          let key:string = 'attachment/contract_note/'+file.name;
          AWSService.upload(key, file).then(fileDetails => {
          let _attachment = new Attachment(contractnote);
          _attachment.name = fileDetails.name;
          _attachment.type = fileDetails.type;
          _attachment.url = fileDetails.url;
          _attachment.created_by=userId;
          _attachment.save((err, saved)=>{
            err ? reject(err)
                : resolve(saved);
          });
          var attachmentID=_attachment._id;
            Contract
            .findByIdAndUpdate(id,{
              $push:{"contract_note.note_remark":contractnote.note_remark,
                      "contract_note.attachment":attachmentID,
                      "contract_note.posted_by":userId,
                      "contract_note.posted_on":new Date(),
                }
            })
            .exec((err, saved)=>{
                err ? reject(err)
                    : resolve(saved);
            }); 
          })
        }      
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

contractSchema.static('updateContractNote', (id:string, idcontractnote:string, userId:string, contractnote:Object):Promise<any> => {
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
          let file:any = contractnote.files.attachmentfile;
          if(file!=null){
            let key:string = 'attachment/contract/'+file.name;
            AWSService.upload(key, file).then(fileDetails => {
            let _attachment = new Attachment(contractnote);
            _attachment.name = fileDetails.name;
            _attachment.type = fileDetails.type;
            _attachment.url = fileDetails.url;
            _attachment.created_by=userId;
            _attachment.save((err, saved)=>{
              err ? reject(err)
                  : resolve(saved);
            });
            var attachmentID=_attachment._id;
            Contract
              .update(_query,{$set:{'contract_note.$.attachment':attachmentID}})
              .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
               });
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

contractSchema.static('createContractNotice', (id:string, userId:string, contractnotice:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(contractnotice)) {
        return reject(new TypeError('Contract Notice is not a valid object.'));
      }              

        let file:any = contractnotice.files.attachmentfile;
        if(file!=null){
          let key:string = 'attachment/contract_note/'+file.name;
          AWSService.upload(key, file).then(fileDetails => {
          let _attachment = new Attachment(contractnotice);
          _attachment.name = fileDetails.name;
          _attachment.type = fileDetails.type;
          _attachment.url = fileDetails.url;
          _attachment.created_by=userId;
          _attachment.save((err, saved)=>{
            err ? reject(err)
                : resolve(saved);
          });
          var attachmentID=_attachment._id;
            Contract
            .findByIdAndUpdate(id,{
              $push:{"contract_note.title":contractnotice.note_remark,
                      "contract_note.start_time":contractnotice.start_time,
                      "contract_note.end_time":contractnotice.end_time,
                      "contract_note.description":contractnotice.description,
                      "contract_note.publish":contractnotice.publish
                }
            })
            .exec((err, saved)=>{
                err ? reject(err)
                    : resolve(saved);
            }); 
          })
        }      
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

contractSchema.static('updateContractNotice', (id:string, idcontractnotice:string, userId:string, contractnotice:Object):Promise<any> => {
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
          let file:any = contractnotice.files.attachmentfile;
          if(file!=null){
            let key:string = 'attachment/contract/'+file.name;
            AWSService.upload(key, file).then(fileDetails => {
            let _attachment = new Attachment(contractnotice);
            _attachment.name = fileDetails.name;
            _attachment.type = fileDetails.type;
            _attachment.url = fileDetails.url;
            _attachment.created_by=userId;
            _attachment.save((err, saved)=>{
              err ? reject(err)
                  : resolve(saved);
            });
            var attachmentID=_attachment._id;
            Contract
              .findById(id)
              .update(_query,{$set:{'contract_notice.$.attachment':attachmentID}})
              .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
               });
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

contractSchema.static('publishContractNotice', (id:string, idcontractnotice:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        let objectID = mongoose.Types.ObjectId;  
          let _query = {"contract_notice":{$elemMatch:{_id: new objectID(idcontractnotice)}}};

        Contract
          .findById(id)
          .update(_query,{
              $set:{"contract_notice.$.publish":"true"}
          })
          .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

let Contract = mongoose.model('Contract', contractSchema);

export default Contract;
