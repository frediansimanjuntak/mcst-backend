import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import developmentSchema from '../model/development-model';
import Attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';

developmentSchema.static('getAll', ():Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Development
          .find(_query)
          .exec((err, developments) => {
              err ? reject(err)
                  : resolve(developments);
          });
    });
});

developmentSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
         Development
          .findById(id)
          .populate("owner staff")
          .exec((err, developments) => {
              err ? reject(err)
                  : resolve(developments);
          });
    });
});

developmentSchema.static('createDevelopment', (development:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(development)) {
        return reject(new TypeError('Development is not a valid object.'));
      }

      var _development = new Development(development);

      _development.save((err, saved) => {

        err ? reject(err)
            : resolve(saved);
      });
    });
});

developmentSchema.static('deleteDevelopment', (id:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Development
          .findByIdAndRemove(id)            
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

developmentSchema.static('updateDevelopment', (id:string, development:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(development)) {
          return reject(new TypeError('Development is not a valid object.'));
        }

        Development
        .findByIdAndUpdate(id, development)
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});


//Development Newsletter
developmentSchema.static('getNewsletter', (namedevelopment:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
         Development
          .findOne({"name":namedevelopment})
          .select("newsletter")
          .exec((err, newsletters) => {
              err ? reject(err)
                  : resolve(newsletters);
          });
    });
});

developmentSchema.static('getByIdNewsletter', (namedevelopment:string, idnewsletter:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      var ObjectID = mongoose.Types.ObjectId;

         Development 
         .findOne({"name":namedevelopment})
         .populate("newsletter.attachment newsletter.release_by newsletter.created_by")
         .select({"newsletter": { $elemMatch: {"_id": new ObjectID(idnewsletter)}}})
          .exec((err, newsletters) => {
              err ? reject(err)
                  : resolve(newsletters);
          });

    });
});

developmentSchema.static('createNewsletter', (namedevelopment:string, newsletter:Object, userId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(newsletter)) {
        return reject(new TypeError('Newsletter is not a valid object.'));
      }
      let body:any = newsletter;

      Attachment.createAttachment(attachment, userId,).then(res => {
        var idAttachment=res.idAtt;

        Development
          .findOneAndUpdate({"name":namedevelopment}, {
                $push:{
                  "newsletter":{
                        "title":body.title,
                        "description":body.description,
                        "type":body.type,
                        "attachment":idAttachment,
                        "released":body.released,
                        "pinned.rank":body.rank,
                        "created_by":userId
                    }
                 }
              })
          .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
              });
      })
      .catch(err=>{
        resolve({message:"error"});
      })                     
    });
});

developmentSchema.static('deleteNewsletter', (namedevelopment:string, idnewsletter:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(namedevelopment)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }

        Development
          .findOneAndUpdate({"name":namedevelopment},
          {
            $pull:{"newsletter":{_id:idnewsletter}}
          })
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

developmentSchema.static('updateNewsletter', (namedevelopment:string, idnewsletter:string, userId:string, newsletter:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(newsletter)) {
          return reject(new TypeError('Properties is not a valid object.'));
        }   
            let newsletterObj = {$set: {}};
            for(var param in newsletter) {
              newsletterObj.$set['newsletter.$.'+param] = newsletter[param];
             }

            let ObjectID = mongoose.Types.ObjectId; 
            let _query={"name":namedevelopment, "newsletter": { $elemMatch: {"_id": new ObjectID(idnewsletter)}}};

            let file:any = attachment;
            let files = [].concat(attachment);
            let idAttachment = [];

            if(file!=null){
              Attachment.createAttachment(attachment, userId,).then(res => {
                var idAttachment=res.idAtt;

                Development
                  .update(_query,{$set:{'newsletter.$.attachment':idAttachment}})
                  .exec((err, saved) => {
                        err ? reject(err)
                            : resolve(saved);
                   });
              })
              .catch(err=>{
                resolve({message:"error"});
              })                  
            } 

            Development
              .update(_query,newsletterObj)
              .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
                });
    });
});

developmentSchema.static('releaseNewsletter',(namedevelopment:string, userId:string, idnewsletter:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(namedevelopment)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        var ObjectID = mongoose.Types.ObjectId;   
        var released=true;
        var released_by=userId; 
        var release_at= Date.now();                      

        Development
        .update({"name":namedevelopment, "newsletter": { $elemMatch: {"_id": new ObjectID(idnewsletter)}}},
          { 
            $set:{
              "newsletter.$.released":released,
              "newsletter.$.released_by":released_by,
              "newsletter.$.release_at":release_at
            }            
          })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
          });
    });
});

//Properties Development
developmentSchema.static('getProperties', (namedevelopment:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
         Development
          .findOne({"name":namedevelopment})
          .select("properties")
          .exec((err, properties) => {
              err ? reject(err)
                  : resolve(properties);
          });
    });
});

developmentSchema.static('getByIdProperties', (namedevelopment:string, idproperties:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      var ObjectID = mongoose.Types.ObjectId;

         Development 
         .findOne({"name":namedevelopment})
         .populate ("properties.lanlord properties.created_by") 
         .select({"properties": { $elemMatch: {"_id": new ObjectID(idproperties)}}})                
          .exec((err, properties) => {
              err ? reject(err)
                  : resolve(properties);
          });
    });
});

developmentSchema.static('createProperties', (namedevelopment:string, userId:string, developmentId:string, properties:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(properties)) {
        return reject(new TypeError('Properties is not a valid object.'));
      }

      console.log(properties)

      Development
      .findOneAndUpdate({"name":namedevelopment},     
        {
          $push:{"properties":properties                 
          }
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

developmentSchema.static('deleteProperties', (namedevelopment:string, idproperties:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(namedevelopment)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }

        Development
          .findOneAndUpdate({"name":namedevelopment},
          {
            $pull:{"properties":{_id:idproperties}}
          })
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

developmentSchema.static('updateProperties', (namedevelopment:string, idproperties:string, properties:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(properties)) {
          return reject(new TypeError('Properties is not a valid object.'));
        }        

        let propertiesObj = {$set: {}};
        for(var param in properties) {
          propertiesObj.$set['properties.$.'+param] = properties[param];
         }
        let ObjectID = mongoose.Types.ObjectId;    

        Development
        .update({"name":namedevelopment, "properties": { $elemMatch: {"_id": new ObjectID(idproperties)}}},propertiesObj)
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
          });
    });
});


//Staff Development
developmentSchema.static('createStaffDevelopment', (namedevelopment:string, staff:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(staff)) {
        return reject(new TypeError('Staff Development is not a valid object.'));
      }

      Development
      .findOneAndUpdate({"name":namedevelopment},     
        {
          $push:{"staff":staff}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

developmentSchema.static('deleteStaffDevelopment', (namedevelopment:string, staff:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(staff)) {
        return reject(new TypeError('Staff Development is not a valid object.'));
      }

      Development
      .findOneAndUpdate({"name":namedevelopment},     
        {
          $pull:{"staff":staff}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});


//Tenant
developmentSchema.static('getTenantProperties', (namedevelopment:string, idproperties:string,):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      var ObjectID = mongoose.Types.ObjectId;

         Development
         .find({"name":namedevelopment},{"properties": { $elemMatch: {"_id": new ObjectID(idproperties)}}})
         .select("properties.tenant")   
          .exec((err, properties) => {
              err ? reject(err)
                  : resolve(properties);
          });
    });
});

developmentSchema.static('getByIdTenantProperties', (namedevelopment:string, idproperties:string, idtenant:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      
      var pipeline = [{
        $match:{
          "name":namedevelopment
          }
        },
        {
          $unwind:"$properties"
        },
        {
          $match:{
            "properties._id": mongoose.Types.ObjectId(idproperties)
          }
        },
        {
          $unwind:"$properties.tenant"
        },
        {
          $match:{
            "properties.tenant._id": mongoose.Types.ObjectId(idtenant)
          }
        },
        {
          $project:{
            "_id":0,
            "tenant":"$properties.tenant"
          }
        }
      ];      

       Development
       .aggregate(pipeline, (err, tenant)=>{
         err ? reject(err)
             : resolve(tenant);
       })
    });
});

developmentSchema.static('createTenantProperties', (namedevelopment:string, idproperties:string, tenant:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(tenant)) {
          return reject(new TypeError('Properties is not a valid object.'));
        }        
        let ObjectID = mongoose.Types.ObjectId;    
        Development
        .update({"name":namedevelopment, "properties": { $elemMatch: {"_id": new ObjectID(idproperties)}}}, {
          $push:{
            "properties.$.tenant":tenant  
          }
        })
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

developmentSchema.static('deleteTenantProperties', (namedevelopment:string, idtenant:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isString(idtenant)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let ObjectID = mongoose.Types.ObjectId; 

        Development
        .findOneAndUpdate({"name":namedevelopment},     
        {
            $pull:{"properties.0.tenant":{"_id": new ObjectID(idtenant)}}
        },{multi: true})
          .exec((err, updated) => {
                err ? reject(err)
                    : resolve(updated);
          });
     });
});

developmentSchema.static('updateTenantProperties', (namedevelopment:string, idtenant:string, tenant:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(tenant)) {
          return reject(new TypeError('Properties is not a valid object.'));
        }        

        let tenantObj = {$set: {}};
        for(var param in tenant) {
          tenantObj.$set['properties.0.tenant.$.'+param] = tenant[param];
         }
        let ObjectID = mongoose.Types.ObjectId;

        Development
        .update({"name":namedevelopment, "properties.tenant._id": new ObjectID(idtenant)},tenantObj)
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
          });
    });
});

//Register Vehicle
developmentSchema.static('getRegisterVehicleProperties', (namedevelopment:string, idproperties:string,):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      var ObjectID = mongoose.Types.ObjectId;

         Development
         .find({"name":namedevelopment},{"properties": { $elemMatch: {"_id": new ObjectID(idproperties)}}})
         .select("properties.registered_vehicle")   
          .exec((err, properties) => {
              err ? reject(err)
                  : resolve(properties);
          });
    });
});

developmentSchema.static('getByIdRegisterVehicleProperties', (namedevelopment:string, idproperties:string, idregistervehicle:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      var pipeline = [{
        $match:{
          "name":namedevelopment
          }
        },
        {
          $unwind:"$properties"
        },
        {
          $match:{
            "properties._id": mongoose.Types.ObjectId(idproperties)
          }
        },
        {
          $unwind:"$properties.registered_vehicle"
        },
        {
          $match:{
            "properties.registered_vehicle._id": mongoose.Types.ObjectId(idregistervehicle)
          }
        },
        {
          $project:{
            "_id":0,
            "registered_vehicle":"$properties.registered_vehicle"
          }
        }
      ];      

       Development
       .aggregate(pipeline, (err, tenant)=>{
         err ? reject(err)
             : resolve(tenant);
       })
    });
});

developmentSchema.static('createRegisterVehicleProperties', (namedevelopment:string, idproperties:string, registervehicle:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(registervehicle)) {
          return reject(new TypeError('Properties is not a valid object.'));
        }        
        let ObjectID = mongoose.Types.ObjectId;    
        Development
        .update({"name":namedevelopment, "properties": { $elemMatch: {"_id": new ObjectID(idproperties)}}}, {
          $push:{
            "properties.$.registered_vehicle":registervehicle  
          }
        })
        .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

developmentSchema.static('deleteRegisterVehicleProperties', (namedevelopment:string, idregistervehicle:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isString(idregistervehicle)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let ObjectID = mongoose.Types.ObjectId; 

        Development
          .findOneAndUpdate({"name":namedevelopment},     
          {
              $pull:{"properties.0.registered_vehicle":{"_id": new ObjectID(idregistervehicle)}}
          },{multi: true})
          .exec((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
          });
    });
});

developmentSchema.static('updateRegisterVehicleProperties', (namedevelopment:string, idregistervehicle:string, registervehicle:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(registervehicle)) {
          return reject(new TypeError('Properties is not a valid object.'));
        }        

        let registervehicleObj = {$set: {}};
        for(var param in registervehicle) {
          registervehicleObj.$set['properties.0.registered_vehicle.$.'+param] = registervehicle[param];
         }
        let ObjectID = mongoose.Types.ObjectId;

        Development
        .update({"name":namedevelopment, "properties.registered_vehicle._id": new ObjectID(idregistervehicle)},registervehicleObj)
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
          });
    });
});


let Development = mongoose.model('Development', developmentSchema);

export default Development;
