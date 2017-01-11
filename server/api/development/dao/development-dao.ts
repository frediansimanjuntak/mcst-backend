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
          .exec((err, developments) => {
              err ? reject(err)
                  : resolve(developments);
          });
    });
});

developmentSchema.static('getByIdNewsletter', (id:string, idnewsletter:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      var ObjectID = mongoose.Types.ObjectId;

         Development 
         .findById(id)
         .select({"newsletter": { $elemMatch: {"_id": new ObjectID(idnewsletter)}}})
          .exec((err, newsletters) => {
              err ? reject(err)
                  : resolve(newsletters);
          });

    });
});

developmentSchema.static('getByIdProperties', (id:string, idproperties:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      var ObjectID = mongoose.Types.ObjectId;

         Development 
         .findById(id)
         .select({"properties": { $elemMatch: {"_id": new ObjectID(idproperties)}}})                
          .exec((err, properties) => {
              err ? reject(err)
                  : resolve(properties);
          });

    });
});

developmentSchema.static('getNewsletter', (id:string,):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
         Development
          .findById(id)
          .select("newsletter")
          .exec((err, newsletters) => {
              err ? reject(err)
                  : resolve(newsletters);
          });
    });
});

developmentSchema.static('getProperties', (id:string,):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
         Development
          .findById(id)
          .select("properties")
          .exec((err, properties) => {
              err ? reject(err)
                  : resolve(properties);
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

developmentSchema.static('createNewsletter', (id:string, userId:string, newsletter:Object):Promise<any> => {
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
          .findByIdAndUpdate(id, {
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

developmentSchema.static('createProperties', (id:string, properties:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(properties)) {
        return reject(new TypeError('Properties is not a valid object.'));
      }

      Development
      .findByIdAndUpdate(id,     
        {
          $push:{"properties":properties}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

developmentSchema.static('createTenantProperties', (id:string, idproperties:string, properties:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(properties)) {
          return reject(new TypeError('Properties is not a valid object.'));
        }        

        let propertiesObj = {$push: {'properties.tenant':properties.tenant}};
        let ObjectID = mongoose.Types.ObjectId;    

        Development
        .update({"_id":id, "properties": { $elemMatch: {"_id": new ObjectID(idproperties)}}},propertiesObj)
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
          });
    });
});

developmentSchema.static('deleteTenantProperties', (id:string, idproperties:string, properties:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(properties)) {
          return reject(new TypeError('Properties is not a valid object.'));
        }        

        let propertiesObj = {$pull: {'properties.tenant':properties.tenant}};
        let ObjectID = mongoose.Types.ObjectId;    

        Development
        .update({"_id":id, "properties": { $elemMatch: {"_id": new ObjectID(idproperties)}}},propertiesObj)
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
          });
    });
});

developmentSchema.static('deleteTenantProperties', (id:string, properties:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(properties)) {
        return reject(new TypeError('Properties is not a valid object.'));
      }

      Development
      .findByIdAndUpdate(id,     
        {
          $pull:{"properties.tenant":properties.tenant}
        })
        .exec((err, saved) => {
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

developmentSchema.static('deleteNewsletter', (id:string, idnewsletter:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Development
          .findByIdAndUpdate(id,
          {
            $pull:{"newsletter":{_id:idnewsletter}}
          })
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

developmentSchema.static('deleteProperties', (id:string, idproperties:string ):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Development
          .findByIdAndUpdate(id,
          {
            $pull:{"properties":{_id:idproperties}}
          })
          .exec((err, deleted) => {
              err ? reject(err)
                  : resolve();
          });
    });
});

developmentSchema.static('releaseNewsletter',(id:string, userId:string, idnewsletter:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }
        var ObjectID = mongoose.Types.ObjectId;   
        var released=true;
        var released_by=userId; 
        var release_at= Date.now();                      

        Development
        .update({"_id":id, "newsletter": { $elemMatch: {"_id": new ObjectID(idnewsletter)}}},
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

developmentSchema.static('updateNewsletter', (id:string, idnewsletter:string, userId:string, newsletter:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(newsletter)) {
          return reject(new TypeError('Properties is not a valid object.'));
        }   
            let newsletterObj = {$set: {}};
            for(var param in newsletter) {
              newsletterObj.$set['newsletter.$.'+param] = newsletter[param];
             }

            let ObjectID = mongoose.Types.ObjectId; 
            let _query={"_id":id, "newsletter": { $elemMatch: {"_id": new ObjectID(idnewsletter)}}};

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

developmentSchema.static('updateProperties', (id:string, idproperties:string, properties:Object):Promise<any> => {
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
        .update({"_id":id, "properties": { $elemMatch: {"_id": new ObjectID(idproperties)}}},propertiesObj)
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
          });
    });
});

developmentSchema.static('createStaffDevelopment', (id:string, development:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(development)) {
        return reject(new TypeError('Staff Development is not a valid object.'));
      }

      Development
      .findByIdAndUpdate(id,     
        {
          $push:{"staff":development.staff}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

developmentSchema.static('deleteStaffDevelopment', (id:string, development:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(development)) {
        return reject(new TypeError('Staff Development is not a valid object.'));
      }

      Development
      .findByIdAndUpdate(id,     
        {
          $pull:{"staff":development.staff}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
    });
});

let Development = mongoose.model('Development', developmentSchema);

export default Development;
