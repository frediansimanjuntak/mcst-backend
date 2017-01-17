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

developmentSchema.static('getById', (namedevelopment:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
         Development
          .findOne({"name":namedevelopment})
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

developmentSchema.static('deleteDevelopment', (namedevelopment:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(namedevelopment)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }

        Development
          .findOneAndRemove({"name":namedevelopment})                
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

developmentSchema.static('updateDevelopment', (namedevelopment:string, development:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(development)) {
          return reject(new TypeError('Development is not a valid object.'));
        }

        Development
        .findOneAndUpdate({"name":namedevelopment}, development)
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
         .select({"newsletter": { $elemMatch: {"_id": new ObjectID(idnewsletter)}}})
          .exec((err, newsletters) => {
              err ? reject(err)
                  : resolve(newsletters);
          });

    });
});

developmentSchema.static('createNewsletter', (namedevelopment:string, userId:string, newsletter:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(newsletter)) {
        return reject(new TypeError('Newsletter is not a valid object.'));
      }

      let file:any = newsletter.files.attachmentfile;
      let key:string = 'attachment/newsletter/'+file.name;
      AWSService.upload(key, file).then(fileDetails => {
        let _attachment = new Attachment(newsletter);
        _attachment.name = fileDetails.name;
        _attachment.type = fileDetails.type;
        _attachment.url = fileDetails.url;
        _attachment.created_by=userId;
        _attachment.save((err, saved)=>{
          err ? reject(err)
              : resolve(saved);
        });
        var attachmentID=_attachment._id;
        Development
          .findOneAndUpdate({"name":namedevelopment}, {
                $push:{"newsletter.title":newsletter.title,
                       "newsletter.description":newsletter.description,
                       "newsletter.type":newsletter.type,
                       "newsletter.attachment":attachmentID,
                       "newsletter.released":newsletter.released,
                       "newsletter.pinned.rank":newsletter.rank,
                       "newsletter.created_by":userId
                    }
              })
          .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
              });
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

developmentSchema.static('updateNewsletter', (namedevelopment:string, idnewsletter:string, userId:string, newsletter:Object):Promise<any> => {
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

            let file:any = newsletter.files.attachmentfile;

            if(file!=null){
              let key:string = 'attachment/newsletter/'+file.name;
              AWSService.upload(key, file).then(fileDetails => {
              let _attachment = new Attachment(newsletter);
              _attachment.name = fileDetails.name;
              _attachment.type = fileDetails.type;
              _attachment.url = fileDetails.url;
              _attachment.created_by=userId;
              _attachment.save((err, saved)=>{
                err ? reject(err)
                    : resolve(saved);
              });
              var attachmentID=_attachment._id;
              Development
                .update(_query,{$set:{'newsletter.$.attachment':attachmentID}})
                .exec((err, saved) => {
                      err ? reject(err)
                          : resolve(saved);
                 });
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
         .select({"properties": { $elemMatch: {"_id": new ObjectID(idproperties)}}})                
          .exec((err, properties) => {
              err ? reject(err)
                  : resolve(properties);
          });
    });
});

developmentSchema.static('createProperties', (namedevelopment:string, properties:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(properties)) {
        return reject(new TypeError('Properties is not a valid object.'));
      }

      Development
      .findOneAndUpdate({"name":namedevelopment},     
        {
          $push:{"properties":properties}
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
developmentSchema.static('createStaffDevelopment', (namedevelopment:string, development:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(development)) {
        return reject(new TypeError('Staff Development is not a valid object.'));
      }

      Development
      .findOneAndUpdate({"name":namedevelopment},     
        {
          $push:{"staff":development.staff}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

developmentSchema.static('deleteStaffDevelopment', (namedevelopment:string, development:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(development)) {
        return reject(new TypeError('Staff Development is not a valid object.'));
      }

      Development
      .findOneAndUpdate({"name":namedevelopment},     
        {
          $pull:{"staff":development.staff}
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
      var ObjectID = mongoose.Types.ObjectId;

         Development
         // .aggregate([
         //   {$match:{_id:id}},
         //   {$unwind:"$properties"},
         //   {$match:{"properties._id":new ObjectID(idproperties)}},
         //   {$unwind:"$properties.tenant"},
         //   {$match:{"properties.tenant._id":new ObjectID(idtenant)}},
         //   {$project:{_id:id, tenant:"$properties.tenant"}}
         //   ])

         .find({"name": namedevelopment, "properties._id": idproperties, "properties.tenant._id": idtenant}, {"properties.tenant.$":1})
         // .select({"properties.tenant._id":new ObjectID(idtenant)})
         // .where({"properties.tenant._id":new ObjectID(idtenant)})
         .exec((err, properties) => {
              err ? reject(err)
                  : resolve(properties);
                  console.log(properties)
          });

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

      Development
      .findOneAndUpdate({"name":namedevelopment},     
        {
          $pull:{"properties":{"tenant":{"_id":idtenant}}}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
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
          tenantObj.$set['tenant.$.'+param] = tenant[param];
         }
        let ObjectID = mongoose.Types.ObjectId;

        Development
        .update({"name":namedevelopment, "properties.tenant": { $elemMatch: {"_id": new ObjectID(idtenant)}}},tenantObj)
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
          });
    });
});


let Development = mongoose.model('Development', developmentSchema);

export default Development;
