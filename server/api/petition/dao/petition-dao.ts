import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import petitionSchema from '../model/petition-model';
import Attachment from '../../attachment/dao/attachment-dao';
import Company from '../../company/dao/company-dao';
import Contract from '../../contract/dao/contract-dao';
import Development from '../../development/dao/development-dao';
import {AWSService} from '../../../global/aws.service';
import {GlobalService} from '../../../global/global.service';

petitionSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};
        Petition
          .find(_query)
          .populate("development attachment created_by")
          .populate({
            path: 'contract',
            populate: {
              path: 'company',
              model: 'Company',
              select: '_id name'
            }
          })
          .sort({"created_at": -1})
          .exec((err, petitions) => {
              err ? reject({message: err.message})
                  : resolve(petitions);
          });
    });
});

petitionSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Petition
          .findById(id)
          .populate("development attachment")
          .populate({
            path: 'contract',
            populate: {
              path: 'company',
              model: 'Company'
            }
          })
          .populate({
            path: 'created_by',
            model: 'User',
            populate: {
              path: 'default_development',
              model: 'Development',
              select: '_id name'
            }
          })
          .exec((err, petitions) => {
            if (err) {
              reject({message: err.message});
            }
            else if (petitions) {
              let user = petitions.created_by;
              let developmentID = user.default_development._id;
              let developmentName = user.default_development.name;
              if (user.default_property.property) {
                let propertyID = user.default_property.property;
                Development.getByIdDevProperties(developmentID, propertyID).then((res) => {
                  let data = {
                    "name": user.name,
                    "phone": user.phone,
                    "address": developmentName + " blk " + res.address.block_no + " #"+ res.address.unit_no + "-" + res.address.unit_no_2
                  }
                  resolve({petitions, "user_details": data});
                })
                .catch((err) => {
                  reject({message: err.message});
                })
              }
              else {
                resolve({"petitions": petitions});
              }
            }
            else {
               resolve({message: "Petition not found"});
            }
          });
    });
});

petitionSchema.static('getOwn', (userId:string, development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development, "created_by": userId};
        Petition
          .find(_query)
          .populate("development attachment created_by")
          .populate({
            path: 'contract',
            populate: {
              path: 'company',
              model: 'Company',
              select: '_id name'
            }
          })
          .exec((err, bookings) => {
              err ? reject({message: err.message})
                  : resolve(bookings);
          });
    });
});

petitionSchema.static('generateCode', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        var generateCode = function() {
          let randomCode = GlobalService.randomCode();
          let _query = {"registration_no": randomCode};
          Petition
            .find(_query)
            .exec((err, petition) => {
              if (err) {
                reject({message: err.message});
              }
              else if (petition) {
                if (petition.length > 0) {
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

petitionSchema.static('createPetition', (petition:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(petition)) {
          return reject(new TypeError('Petition is not a valid object.'));
        }
        let body:any = petition;
        let file:any = attachment;
        let extra;
        if (body.petition_type == "new tenant") {
          extra = body.tenant;
        }
        Petition.generateCode().then((code) => {
          var _petition = new Petition(petition);
          _petition.reference_no = code;
          _petition.created_by = userId;
          _petition.extra = extra;
          _petition.development = developmentId;        
          _petition.save((err, petitions) => {
            if (err) {
              reject({message: err.message});
            }
            else if (petitions) {
              if (petitions.petition_type != "new tenant") {
                Petition.createContractPetition(petition, userId.toString(), petitions._id.toString(), developmentId.toString(), attachment);
              }
              let _query = {"_id": petitions._id};
              Petition.addAttachmentPetition(attachment, _query, userId.toString());                  
              resolve(petitions);                
            }
          }); 
        })        
        .catch((err) => {
          reject({message: err.message});
        })                    
    });
});

petitionSchema.static('createContractPetition', (petition:Object, userId:string, petitionId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      let body:any = petition;
      let file:any = attachment;
      let data = {
        "property": body.property,
        "company": body.company,
        "title": body.petition_type,
        "contract_type": body.petition_type,
        "reference_type": "petition",
        "reference_id": petitionId,
        "start_time": body.start_time,
        "end_time": body.end_time,
        "created_by": userId,
        "remark": body.remark,
        "new_company": body.new_company,
        "sign": body.sign
      }
      Contract.createContract(data, userId, developmentId, file.attachment).then((result) => {
        Petition
          .findByIdAndUpdate(petitionId, {
            $set: {
              "contract": result._id
            }
          })
          .exec((err, updated) => {
            err ? reject({message: err.message})
                : resolve(updated);
          })       
      })
      .catch(err=>{
        reject({message: err.message});
      })
    });
});

petitionSchema.static('deletePetition', (id:string, ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Petition
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject({message: err.message})
                  : resolve();
          });
    });
});

petitionSchema.static('updatePetition', (id:string, userId:string, petition:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(petition)) {
          return reject(new TypeError('Petition is not a valid object.'));
        }
        let petitionObj = {$set: {}};
        for (var param in petition) {
          petitionObj.$set[param] = petition[param];
        }
        let ObjectID = mongoose.Types.ObjectId; 
        let _query = {"_id": id};
        Petition.addAttachmentPetition(attachment, _query, userId.toString());    
        Petition
          .update(_query, petitionObj)
          .exec((err, saved) => {
              err ? reject({message: err.message})
                  : resolve(saved);
          }); 
    });
});

petitionSchema.static('archieve', (arrayId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let body:any = arrayId;
        Petition
          .update({"_id": {$in: body.ids}}, {
            $set: {
              "archieve": true
            }
          }, {multi: true})
          .exec((err, saved) => {
              err ? reject({message: err.message})
                  : resolve(saved);
          });
    });
});

petitionSchema.static('unarchieve', (arrayId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {      
      let body:any = arrayId;
      Petition
        .update({"_id": {$in: body.ids}}, {
          $set: {
            "archieve": false
          }
        }, {multi: true})
        .exec((err, saved) => {
              err ? reject({message: err.message})
                  : resolve(saved);
        });
    });
});

petitionSchema.static('addAttachmentPetition', (attachment:Object, query:Object, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {      
       let file:any = attachment;
       if (file.attachment) {
          Attachment.createAttachment(file.attachment, userId)
            .then((res) => {
              let idAttachment = res.idAtt;
              Petition
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
            .catch((err) => {
              reject({message: err.message});
            })
      }
      else {
        resolve({message: "No Attachment Files"});
      }
    });
});

let Petition = mongoose.model('Petition', petitionSchema);

export default Petition;
