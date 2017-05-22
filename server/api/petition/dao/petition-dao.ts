import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import petitionSchema from '../model/petition-model';
import Attachment from '../../attachment/dao/attachment-dao';
import Company from '../../company/dao/company-dao';
import Contract from '../../contract/dao/contract-dao';
import Development from '../../development/dao/development-dao';
import {AWSService} from '../../../global/aws.service';

petitionSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};

        Petition
          .find(_query)
          .populate("development attachment")
          .populate({
            path: 'contract',
            populate: {
              path: 'company',
              model: 'Company',
              select: '_id name'
            }
          })
          .populate({
            path: 'created_by',
            populate: {
              path: 'default_development',
              model: 'Development'
            }
          })
          .exec((err, petitions) => {
              err ? reject(err)
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
            populate: {
              path: 'default_development',
              model: 'Development'
            }
          })
          .exec((err, petitions) => {
            if(err){
              reject(err);
            }
            if(petitions){
              let user = petitions.created_by;
              let developmentID = user.default_development._id;
              let developmentName = user.default_development.name;
              if(user.default_property.property){
                let propertyID = user.default_property.property;
                Development.getByIdDevProperties(developmentID.toString(), propertyID).then((res) => {
                  let data = {
                    "name": user.name,
                    "phone": user.phone,
                    "address": developmentName + " blk " + res.address.block_no + " #"+ res.address.unit_no + "-" + res.address.unit_no_2
                  }
                  resolve({petitions, "user_details": data});
                })
                .catch((err) => {
                  reject(err);
                })
              }
              else{
                resolve(petitions);
              }
            }
          });
    });
});

petitionSchema.static('getOwn', (userId:string, development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development, "created_by": userId};

        Petition
          .find(_query)
          .populate("development attachment")
          .populate({
            path: 'contract',
            populate: {
              path: 'company',
              model: 'Company',
              select: '_id name'
            }
          })
          .populate({
            path: 'created_by',
            populate: {
              path: 'default_development',
              model: 'Development'
            }
          })
          .exec((err, bookings) => {
              err ? reject(err)
                  : resolve(bookings);
          });
    });
});

petitionSchema.static('generateCode', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        var generateCode = function(){
          let randomCode = Math.floor(Math.random()*9000000000) + 1000000000;;
          let _query = {"registration_no": randomCode};
          Petition
            .find(_query)
            .exec((err, petition) => {
              if(err){
                reject(err);
              }
              if(petition){
                if(petition.length != 0){
                  generateCode();
                }
                if(petition.length == 0){
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
        if(body.petition_type == "new tenant"){
          extra = body.tenant;
        }

        Petition.generateCode().then((code) => {
          var _petition = new Petition(petition);
          _petition.reference_no = code;
          _petition.created_by = userId;
          _petition.extra = extra;
          _petition.development = developmentId;        
          _petition.save((err, petitions) => {
            if(err){
              reject(err);
            }
            if(petitions){
              if(petitions.petition_type != "new tenant"){
                let data = {
                  "property": body.property,
                  "company": body.company,
                  "title": body.petition_type,
                  "contract_type": body.petition_type,
                  "reference_type": "petition",
                  "reference_id": petitions._id,
                  "start_time": body.start_time,
                  "end_time": body.end_time,
                  "created_by": userId,
                  "remark": body.remark,
                  "new_company": body.new_company,
                  "sign": body.sign
                }
                Contract.createContract(data, userId, developmentId, file.attachment).then((result) =>{
                  petitions.contract = result._id;
                  petitions.save((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
                  });
                })
                .catch(err=>{
                  reject(err);
                })
              }
              else{
                if(file.attachment){
                   Attachment.createAttachment(file.attachment, userId)
                    .then(res => {
                      let idAttachment = res.idAtt;
                      petitions.attachment = idAttachment;
                      petitions.save((err, saved) => {
                        if(err){
                          reject(err);
                        }
                      });              
                    })
                    .catch(err=>{
                      reject(err);
                    })
                }                   
                resolve(petitions); 
              }   
            }
          }); 
        })        
        .catch((err) => {
          reject(err);
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
              err ? reject(err)
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
        for(var param in petition) {
          petitionObj.$set[param] = petition[param];
        }

        let ObjectID = mongoose.Types.ObjectId; 
        let _query = {"_id": id};

        var files = [].concat(attachment);
        var idAttachment = [];

        if(attachment != null){
          Attachment.createAttachment(attachment, userId)
            .then(res => {
              var idAttachment=res.idAtt;

              Petition
                .update(_query,{
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
        
        Petition
          .update(_query, petitionObj)
          .exec((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
            }); 
    });
});

petitionSchema.static('archieve', (arrayId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let body:any = arrayId
        Petition
          .update({"_id": {$in: body.ids}}, {
            $set: {
              "archieve": true
            }
          }, {multi: true})
          .exec((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
          });
    });
});

petitionSchema.static('unarchieve', (arrayId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {      
      let body:any = arrayId
      Petition
        .update({"_id": {$in: body.ids}}, {
          $set: {
            "archieve": false
          }
        }, {multi: true})
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

let Petition = mongoose.model('Petition', petitionSchema);

export default Petition;
