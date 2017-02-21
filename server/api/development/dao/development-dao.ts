import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import developmentSchema from '../model/development-model';
import Attachment from '../../attachment/dao/attachment-dao';
import {AWSService} from '../../../global/aws.service';
import {GlobalService} from '../../../global/global.service';

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
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

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

        let body:any = development;

        var _development = new Development(development);
        _development.name_url = GlobalService.slugify(body.name);
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

        let body:any = development;

        Development  
          .findByIdAndUpdate(id, {development, 
            $set: {
              "name_url": GlobalService.slugify(body.name)
            }
          })
          .exec((err, updated) => {
            err ? reject(err)
                : resolve(updated);
          });
    });
});


//Development Newsletter
developmentSchema.static('getNewsletter', (name_url:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }

        Development
          .findOne({"name_url": name_url})
          .select("newsletter")
          .exec((err, newsletters) => {
              err ? reject(err)
                  : resolve(newsletters);
          });
    });
});

developmentSchema.static('getByIdNewsletter', (name_url:string, idnewsletter:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isString(idnewsletter)) {
            return reject(new TypeError('Id Newsletter is not a valid string.'));
        }

        var ObjectID = mongoose.Types.ObjectId;

        Development 
          .findOne({"name_url": name_url})
          .populate("newsletter.attachment newsletter.release_by newsletter.created_by")
          .select({
            "newsletter": {
              $elemMatch: {
                "_id": new ObjectID(idnewsletter)
              }
            }
          })
          .exec((err, newsletters) => {
              err ? reject(err)
                  : resolve(newsletters);
          });
    });
});

developmentSchema.static('createNewsletter', (name_url:string, newsletter:Object, userId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isObject(newsletter)) {
            return reject(new TypeError('Newsletter is not a valid object.'));
        }
        if (!_.isObject(attachment)) {
            return reject(new TypeError('Attachment is not a valid.'));
        }

        let body:any = newsletter;

        Attachment.createAttachment(attachment, userId)
          .then(res => {
            var idAttachment=res.idAtt;

            Development
              .findOneAndUpdate({"name_url": name_url}, {
                $push:{
                  "newsletter": {
                    "title": body.title,
                    "description": body.description,
                    "type": body.type,
                    "attachment": idAttachment,
                    "released": body.released,
                    "pinned.rank": body.rank,
                    "created_by": userId
                  }
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
    });
});

developmentSchema.static('deleteNewsletter', (name_url:string, idnewsletter:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }

        Development
          .findOneAndUpdate({"name_url": name_url},
          {
            $pull:{
              "newsletter": {
                "_id": idnewsletter
              }
            }
          })
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

developmentSchema.static('updateNewsletter', (name_url:string, idnewsletter:string, userId:string, newsletter:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(newsletter)) {
          return reject(new TypeError('Properties is not a valid object.'));
        }   

        let newsletterObj = {$set: {}};
        for(var param in newsletter) {
          newsletterObj.$set['newsletter.$.'+param] = newsletter[param];
         }

        let ObjectID = mongoose.Types.ObjectId; 
        let _query={"name_url": name_url, "newsletter": {$elemMatch: {"_id": new ObjectID(idnewsletter)}}};

        let file:any = attachment;

        if(file!=null){
          Attachment.createAttachment(attachment, userId).then(res => {
            var idAttachment=res.idAtt;

            Development
              .update(_query,{
                $set: {
                  "newsletter.$.attachment": idAttachment
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

        Development
          .update(_query, newsletterObj)
          .exec((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
            });
    });
});

developmentSchema.static('releaseNewsletter',(name_url:string, userId:string, idnewsletter:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isString(idnewsletter)) {
            return reject(new TypeError('Id Newsletter is not a valid string.'));
        }

        var ObjectID = mongoose.Types.ObjectId;   
        var released = true;
        var released_by = userId; 
        var release_at = Date.now();                      

        Development
          .update({"name_url": name_url, "newsletter": {$elemMatch: {"_id": new ObjectID(idnewsletter)}}}, { 
              $set: {
                "newsletter.$.released": released,
                "newsletter.$.released_by": released_by,
                "newsletter.$.release_at": release_at
              }            
            })
          .exec((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
          });
    });
});

//Properties Development
developmentSchema.static('getProperties', (name_url:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }

        Development
          .findOne({"name_url": name_url})
          .select("properties")
          .populate ("properties.landlord properties.created_by properties.tenant.resident") 
          .exec((err, properties) => {
              err ? reject(err)
                  : resolve(properties);
          });
    });
});

developmentSchema.static('getByIdProperties', (name_url:string, idproperties:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isString(idproperties)) {
            return reject(new TypeError('Id Property is not a valid string.'));
        }

        var ObjectID = mongoose.Types.ObjectId;

        Development 
          .findOne({"name_url": name_url})
          .populate ("properties.landlord properties.created_by properties.tenant.resident") 
          .select({
           "properties": {
             $elemMatch: {
               "_id": new ObjectID(idproperties)
             }
           }
          })                
          .exec((err, properties) => {
              err ? reject(err)
                  : resolve(properties);
          });
    });
});

developmentSchema.static('createProperties', (name_url:string, userId:string, developmentId:string, properties:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isObject(properties)) {
            return reject(new TypeError('Properties is not a valid object.'));
        }

        Development
          .findOneAndUpdate({"name_url": name_url}, {
              $push:{"properties": properties                 
              }
            })
          .exec((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
          });
    });
});

developmentSchema.static('deleteProperties', (name_url:string, idproperties:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isString(idproperties)) {
            return reject(new TypeError('Id Unit is not a valid string.'));
        }

        Development
          .findOneAndUpdate({"name_url": name_url},
          {
            $pull:{
              "properties": {
                "_id": idproperties
              }
            }
          })
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

developmentSchema.static('updateProperties', (name_url:string, idproperties:string, properties:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isString(idproperties)) {
            return reject(new TypeError('Id Unit is not a valid string.'));
        }
        if (!_.isObject(properties)) {
            return reject(new TypeError('Properties is not a valid object.'));
        }        

        let propertiesObj = {$set: {}};
        for(var param in properties) {
          propertiesObj.$set['properties.$.'+param] = properties[param];
        }

        let ObjectID = mongoose.Types.ObjectId;    

        Development
          .update({"name_url": name_url, "properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}}, propertiesObj)
          .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
          });
    });
});


//Staff Development
developmentSchema.static('createStaffDevelopment', (name_url:string, staff:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
              return reject(new TypeError('Development Name is not a valid string.'));
          }
        if (!_.isObject(staff)) {
          return reject(new TypeError('Staff Development is not a valid object.'));
        }

        Development
          .findOneAndUpdate({"name_url": name_url},     
            {
              $push:{"staff": staff}
            })
          .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
          });
    });
});

developmentSchema.static('deleteStaffDevelopment', (name_url:string, staff:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isObject(staff)) {
            return reject(new TypeError('Staff Development is not a valid object.'));
        }

        Development
          .findOneAndUpdate({"name_url": name_url},     
            {
              $pull:{"staff": staff}
            })
          .exec((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
          });
    });
});


//Tenant
developmentSchema.static('getTenantProperties', (name_url:string, idproperties:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isString(idproperties)) {
            return reject(new TypeError('Id Unit is not a valid string.'));
        }

        var ObjectID = mongoose.Types.ObjectId;

        Development
          .find({"name_url": name_url},{"properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}})
          .select("properties.tenant")   
          .exec((err, properties) => {
              err ? reject(err)
                  : resolve(properties);
          });
    });
});

developmentSchema.static('getByIdTenantProperties', (name_url:string, idproperties:string, idtenant:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isString(idproperties)) {
            return reject(new TypeError('Id Unit is not a valid string.'));
        }
      
        var pipeline = [{
          $match: {
            "name_url": name_url
            }
          },
          {
            $unwind: "$properties"
          },
          {
            $match: {
              "properties._id": mongoose.Types.ObjectId(idproperties)
            }
          },
          {
            $unwind: "$properties.tenant"
          },
          {
            $match: {
              "properties.tenant._id": mongoose.Types.ObjectId(idtenant)
            }
          },
          {
            $project: {
              "_id": 0,
              "tenant": "$properties.tenant"
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

developmentSchema.static('createTenantProperties', (name_url:string, idproperties:string, tenant:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isString(idproperties)) {
            return reject(new TypeError('Id Unit Name is not a valid string.'));
        }
        if (!_.isObject(tenant)) {
            return reject(new TypeError('Properties is not a valid object.'));
        }        
        let ObjectID = mongoose.Types.ObjectId;

        Development
          .update({"name_url": name_url, "properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}}, {
            $push:{
              "properties.$.tenant": tenant  
            }
          })
          .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

developmentSchema.static('deleteTenantProperties', (name_url:string, idtenant:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isString(idtenant)) {
            return reject(new TypeError('Id Tenant is not a valid string.'));
        }

        let ObjectID = mongoose.Types.ObjectId; 

        Development
          .findOneAndUpdate({"name_url": name_url}, {
            $pull: {
              "properties.0.tenant": {
                "_id": new ObjectID(idtenant)
              }
            }
          }, {multi: true})
          .exec((err, updated) => {
              err ? reject(err)
                  : resolve(updated);
          });
    });
});

developmentSchema.static('updateTenantProperties', (name_url:string, idtenant:string, tenant:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isString(idtenant)) {
            return reject(new TypeError('Id Tenant is not a valid string.'));
        }
        if (!_.isObject(tenant)) {
          return reject(new TypeError('Properties is not a valid object.'));
        }        

        let tenantObj = {$set: {}};
        for(var param in tenant) {
          tenantObj.$set['properties.0.tenant.$.'+param] = tenant[param];
        }

        let ObjectID = mongoose.Types.ObjectId;

        Development
          .update({"name_url": name_url, "properties.tenant._id": new ObjectID(idtenant)}, tenantObj)
          .exec((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
          });
    });
});

//Register Vehicle
developmentSchema.static('getRegisterVehicleProperties', (name_url:string, idproperties:string,):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isString(idproperties)) {
            return reject(new TypeError('Id Unit is not a valid string.'));
        }

        var ObjectID = mongoose.Types.ObjectId;

        Development
          .find({"name_url": name_url}, {"properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}})
          .select("properties.registered_vehicle")  
          .populate("properties.register_vehicle.owner properties.register_vehicle.document") 
          .exec((err, properties) => {
              err ? reject(err)
                  : resolve(properties);
          });
    });
});

developmentSchema.static('getByIdRegisterVehicleProperties', (name_url:string, idproperties:string, idregistervehicle:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isString(idproperties)) {
            return reject(new TypeError('Id Unit is not a valid string.'));
        }
        if (!_.isString(idregistervehicle)) {
            return reject(new TypeError('Id Register Vehicle is not a valid string.'));
        }

        var pipeline = [{
          $match:{
            "name_url": name_url
            }
          },
          {
            $unwind: "$properties"
          },
          {
            $match: {
              "properties._id": mongoose.Types.ObjectId(idproperties)
            }
          },
          {
            $unwind: "$properties.registered_vehicle"
          },
          {
            $match: {
              "properties.registered_vehicle._id": mongoose.Types.ObjectId(idregistervehicle)
            }
          },
          {
            $project: {
              "_id": 0,
              "registered_vehicle": "$properties.registered_vehicle"
            }
          }
        ];      

        Development       
          .aggregate(pipeline, (err, tenant)=>{         
           err ? reject(err)
               : resolve(tenant);
          })
          .populate("properties.register_vehicle.owner properties.register_vehicle.document") 
    });
});

developmentSchema.static('createRegisterVehicleProperties', (name_url:string, idproperties:string, userId:string, registervehicle:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isString(idproperties)) {
            return reject(new TypeError('Id Unit is not a valid string.'));
        }
        if (!_.isObject(registervehicle)) {
          return reject(new TypeError('Properties is not a valid object.'));
        }  
        if (!_.isObject(attachment)) {
          return reject(new TypeError('Attachment is not a valid.'));
        }      
        
        let ObjectID = mongoose.Types.ObjectId; 
        let body:any = registervehicle;

        Attachment.createAttachment(attachment, userId)
          .then(res => {
            var idAttachment = res.idAtt;

            Development
              .update({"name_url": name_url, "properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}}, {
                $push:{
                  "properties.$.registered_vehicle": {
                    "license_plate": body.license_plate,
                    "owner": body.owner,
                    "transponder": body.transponder,
                    "document": idAttachment,
                    "registered_on": new Date(),
                    "remarks": body.remarks
                  }  
                }
              })
              .exec((err, updated) => {
                    err ? reject(err)
                        : resolve(updated);
                });
          })
          .catch(err=>{
            resolve({message: "attachment error"});
          })         
    });
});

developmentSchema.static('deleteRegisterVehicleProperties', (name_url:string, idregistervehicle:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isString(idregistervehicle)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        let ObjectID = mongoose.Types.ObjectId; 

        Development
          .findOneAndUpdate({"name_url": name_url},     
          {
            $pull:{
              "properties.0.registered_vehicle": {
                "_id": new ObjectID(idregistervehicle)
              }
            }
          }, {multi: true})
          .exec((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
          });
    });
});

developmentSchema.static('updateRegisterVehicleProperties', (name_url:string, idregistervehicle:string, userId:string, registervehicle:Object, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        if (!_.isString(idregistervehicle)) {
            return reject(new TypeError('Register Vehicle is not a valid string.'));
        }
        if (!_.isObject(registervehicle)) {
          return reject(new TypeError('Register Vehicle is not a valid object.'));
        }  
        if (!_.isObject(attachment)) {
          return reject(new TypeError('Attachment is not a valid.'));
        } 

        let ObjectID = mongoose.Types.ObjectId; 
        let body:any = registervehicle;
        var query = {"name_url": name_url, "properties.registered_vehicle._id": new ObjectID(idregistervehicle)};

        let registervehicleObj = {$set: {}};
        for(var param in registervehicle) {
          registervehicleObj.$set['properties.0.registered_vehicle.$.'+param] = registervehicle[param];
         }

        if(attachment != null){
          Attachment.createAttachment(attachment, userId)
            .then(res => {
              var idAttachment = res.idAtt;

              Development
                .update(query, {
                  $set: {
                    "properties.0.registered_vehicle.$.document": idAttachment
                  } 
                })
                .exec((err, updated) => {
                      err ? reject(err)
                          : resolve(updated);
                });
            })
            .catch(err=>{
              resolve({message: "attachment error"});
            })    
        }

        Development
          .update(query, registervehicleObj)
          .exec((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
          });
    });
});


let Development = mongoose.model('Development', developmentSchema);

export default Development;
