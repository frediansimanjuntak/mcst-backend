import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import vehicleSchema from '../model/vehicle-model';
import Attachment from '../../attachment/dao/attachment-dao';
import Development from '../../development/dao/development-dao';
import {AWSService} from '../../../global/aws.service';

vehicleSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};
        Vehicles
          .find(_query)
          .populate("development owner created_by document")
          .exec((err, vehicles) => {
              err ? reject(err)
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
          .populate("development owner created_by document")
          .exec((err, vehicle) => {
              err ? reject(err)
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
          .populate("development owner created_by document")
          .exec((err, vehicle) => {
              err ? reject(err)
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
          .findOne({"license_plate":license})
          .populate("development owner created_by document")
          .exec((err, vehicle) => {
              err ? reject(err)
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
          .find({"owner":owner})
          .populate("development owner created_by document")
          .exec((err, vehicles) => {
              err ? reject(err)
                  : resolve(vehicles);
          });
    });
});

vehicleSchema.static('createVehicle', (vehicle:Object, userId:string, developmentId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(vehicle)) {  
        return reject(new TypeError('Lost and Found is not a valid object.'));
      }
      var _vehicle = new Vehicles(vehicle);
      _vehicle.created_by = userId;
      _vehicle.development = developmentId;
      _vehicle.save((err, saved) => {
        if(err){
          reject(err);
        }
        if(saved){
          let data = {
            "idDevelopment": saved.development,
            "idProperty": saved.property,
            "idVehicle": saved._id
          }
          Vehicles.addVehicleToProperty(data);
          if(attachment){
            Attachment.createAttachment(attachment, userId)
              .then(res => {
                var idAttachment = res.idAtt;
                saved.photo = idAttachment;
                saved.save((err, result) => {
                  err ? reject(err)
                      : resolve(result);
                })
              })
              .catch(err=>{
                resolve({message: "attachment error"});
              })
          }
          else{
            resolve(saved);
          }
        }
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
          console.log(updated);
            err ? reject(err)
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
          .findByIdAndRemove(id)
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

vehicleSchema.static('updateVehicle', (id:string, userId:string, vehicle:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(vehicle)) {
          return reject(new TypeError('Lost and Found is not a valid object.'));
        }

        let vehicleObj = {$set: {}};
        for(var param in vehicle) {
          vehicleObj.$set[param] = vehicle[param];
        }

        let ObjectID = mongoose.Types.ObjectId; 
        let _query={"_id": id};

        let file:any = attachment;
        var files = [].concat(attachment);
        var idAttachment = [];

        if(file != null){
          Attachment.createAttachment(attachment, userId).then(res => {
            var idAttachment = res.idAtt;

            Vehicles
              .update(_query,{
                $set: {
                  "photo": idAttachment
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
        
        Vehicles
          .update(_query, vehicleObj)
          .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
          });        
    });
});

let Vehicles = mongoose.model('Vehicles', vehicleSchema);

export default Vehicles;
