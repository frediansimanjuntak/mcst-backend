import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import vehicleSchema from '../model/vehicle-model';
import Attachment from '../../attachment/dao/attachment-dao';
import Development from '../../development/dao/development-dao';
import User from '../../user/dao/user-dao';
import {AWSService} from '../../../global/aws.service';

vehicleSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};
        Vehicles
          .find(_query)
          .populate("development document")
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'owner',
              model: 'User',
              select: '-salt -password'
          })
          .exec((err, vehicles) => {
              err ? reject({message: err.message})
                  : resolve(vehicles);
          });
    });
});

vehicleSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Vehicles
          .findById(id)
          .populate("development document")
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'owner',
              model: 'User',
              select: '-salt -password'
          })
          .exec((err, vehicle) => {
              err ? reject({message: err.message})
                  : resolve(vehicle);
          });
    });
});

vehicleSchema.static('getByProperty', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Vehicles
          .find({"property": id})
          .populate("development document")
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'owner',
              model: 'User',
              select: '-salt -password'
          })
          .exec((err, vehicle) => {
              err ? reject({message: err.message})
                  : resolve(vehicle);
          });
    });
});

vehicleSchema.static('getByLicensePlate', (license:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(license)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Vehicles
          .findOne({"license_plate": license})
          .populate("development document")
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'owner',
              model: 'User',
              select: '-salt -password'
          })
          .exec((err, vehicle) => {
              err ? reject({message: err.message})
                  : resolve(vehicle);
          });
    });
});

vehicleSchema.static('getByOwner', (owner:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(owner)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        Vehicles
          .find({"owner": owner})
          .populate("development document")
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'owner',
              model: 'User',
              select: '-salt -password'
          })
          .exec((err, vehicles) => {
              err ? reject({message: err.message})
                  : resolve(vehicles);
          });
    });
});

vehicleSchema.static('getOwnVehicle', (developmentId:string, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {$or: [{"owner": userId}, {"created_by": userId}], "development": developmentId};
        Vehicles
          .find(_query)
          .populate("development document")
          .populate({
              path: 'created_by',
              model: 'User',
              select: '-salt -password'
          })
          .populate({
              path: 'owner',
              model: 'User',
              select: '-salt -password'
          })
          .exec((err, vehicles) => {
              err ? reject({message: err.message})
                  : resolve(vehicles);
          });
    });
});

vehicleSchema.static('createVehicle', (vehicle:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(vehicle)) {  
        return reject(new TypeError('Lost and Found is not a valid object.'));
      }
      let body:any = vehicle;
      Vehicles
        .find({"license_plate": body.license_plate})
        .exec((err, veh) => {
          if (err){
            reject({message: err.message});
          }
          else if (veh) {
            if (veh.length == 0) {
              var _vehicle = new Vehicles(vehicle);
              _vehicle.created_by = userId;
              _vehicle.development = developmentId;
              _vehicle.save((err, saved) => {
                if (err) {
                  reject({message: err.message});
                }
                if (saved) {
                  let data = {
                    "idDevelopment": saved.development,
                    "idProperty": saved.property,
                    "idVehicle": saved._id,
                    "idUser": saved.owner
                  };
                  let _query = {"_id": saved._id};    
                  Vehicles.addVehicleToProperty(data);
                  Vehicles.addVehicleToUser(data);                 
                  Vehicles.addAttachmentVehicle(attachment, _query, userId.toString());          
                  resolve(saved);
                }
              });
            }
            else {
              resolve({message: "This Vehicles is Already"});
            }
          }
        })              
    });
});

vehicleSchema.static('addVehicleToUser', (data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(data)) {  
        return reject(new TypeError('Lost and Found is not a valid object.'));
      }

      let ObjectID = mongoose.Types.ObjectId;   
      let body:any = data;

      User
        .update({"_id": body.idUser}, {
          $push: {
            "vehicles": body.idVehicle
          }
        })
        .exec((err, updated) => {
          err ? reject({message: err.message})
              : resolve(updated);
        });       
    });
});

vehicleSchema.static('addVehicleToProperty', (data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(data)) {  
        return reject(new TypeError('Lost and Found is not a valid object.'));
      }
      let ObjectID = mongoose.Types.ObjectId;   
      let body:any = data;
      Development
        .update({"_id": body.idDevelopment, "properties": {$elemMatch: {"_id": new ObjectID(body.idProperty)}}}, {
          $push: {
            "properties.$.vehicles": body.idVehicle
          }
        })
        .exec((err, updated) => {
            err ? reject({message: err.message})
                : resolve(updated);
        });       
    });
});

vehicleSchema.static('deleteVehicle', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Vehicles
          .findById(id)
          .exec((err, vehicle) => {
            if (err) {
              reject({message: err.message});
            }
            if (vehicle) {
              let data = {
                "idDevelopment": vehicle.development,
                "idProperty": vehicle.property,
                "idVehicle": vehicle._id,
                "idUser": vehicle.owner
              }
              Vehicles.deleteVehicleToUser(data);
              Vehicles.deleteVehicleToProperty(data);
              Vehicles
              .findByIdAndRemove(id)
              .exec((err, deleted) => {
                  err ? reject({message: err.message})
                      : resolve({message: "Delete Success"});
              });
            }
            else {
              resolve({message: "No data to delete"});
            }
          })        
    });
});

vehicleSchema.static('deleteVehicleToUser', (data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(data)) {  
        return reject(new TypeError('Lost and Found is not a valid object.'));
      }
      let ObjectID = mongoose.Types.ObjectId;   
      let body:any = data;
      User
        .update({"_id": body.idUser}, {
          $pull: {
            "vehicles": body.idVehicle
          }
        })
        .exec((err, updated) => {
            err ? reject({message: err.message})
                : resolve(updated);
        });       
    });
});

vehicleSchema.static('deleteVehicleToProperty', (data:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(data)) {  
        return reject(new TypeError('Lost and Found is not a valid object.'));
      }
      let ObjectID = mongoose.Types.ObjectId;   
      let body:any = data;
      Development
        .update({"_id": body.idDevelopment, "properties": {$elemMatch: {"_id": new ObjectID(body.idProperty)}}}, {
          $pull: {
            "properties.$.vehicles": body.idVehicle
          }
        })
        .exec((err, updated) => {
          console.log(updated);
            err ? reject({message: err.message})
                : resolve(updated);
        });       
    });
});

vehicleSchema.static('updateVehicle', (id:string, userId:string, vehicle:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(vehicle)) {
          return reject(new TypeError('Lost and Found is not a valid object.'));
        }
        let vehicleObj = {$set: {}};
        for (var param in vehicle) {
          vehicleObj.$set[param] = vehicle[param];
        }
        let ObjectID = mongoose.Types.ObjectId; 
        let _query = {"_id": id};           
        Vehicles.addAttachmentVehicle(attachment, _query, userId.toString());
        Vehicles
          .update(_query, vehicleObj)
          .exec((err, saved) => {
              err ? reject({message: err.message})
                  : resolve(saved);
          });        
    });
});

vehicleSchema.static('addAttachmentVehicle', (attachment:Object, query:Object, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      let files:any = attachment;
      console.log(files);
      if (files) {
        let documentAtt = files.document;
        Attachment.createAttachment(documentAtt, userId).then(res => {
          let idAttachment = res.idAtt;
          Vehicles
            .update(query,{
              $set: {
                "document": idAttachment
              }
            })
            .exec((err, saved) => {
                err ? reject({message: err.message})
                    : resolve(saved);
            });
        })
        .catch(err=>{
          resolve(err);
        })              
      } 
      else {
        resolve({message: "No Attachment Files"});
      }
    });
});

let Vehicles = mongoose.model('Vehicles', vehicleSchema);

export default Vehicles;
