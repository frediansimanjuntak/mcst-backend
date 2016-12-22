import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import developmentSchema from '../model/development-model';

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

developmentSchema.static('getById', (id:string,):Promise<any> => {
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

developmentSchema.static('createNewsletter', (id:string, newsletter:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
      if (!_.isObject(newsletter)) {
        return reject(new TypeError('Newsletter is not a valid object.'));
      }

      Development
      .findByIdAndUpdate(id,     
        {
          $push:{"newsletter":newsletter}
        })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
        });
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

developmentSchema.static('updateNewsletter', 
  (id:string, title:Object, description:Object, type:Object, attachment:Object, released:Object, pinned:Object, released_by:Object, release_at:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(title)) {
          return reject(new TypeError('Newsletter is not a valid object.'));
        }        
        var ObjectID = mongoose.Types.ObjectId;  
        var idNews={"newsletter": { $elemMatch: {"_id": new ObjectID(id)}}};                               

        Development
        .update(idNews,
          {
            $set:{
              "newsletter":{
                "title":title,
                "description":description,
                "type":type,
                "attachment":attachment,
                "released":released,
                "pinned":pinned,
                "released_by":released_by,
                "release_at":release_at
              }
            }
          })
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
          });
    });
});

developmentSchema.static('updateProperties', (id:string, properties:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(properties)) {
          return reject(new TypeError('Newsletter is not a valid object.'));
        }        

        var ObjectID = mongoose.Types.ObjectId;                           

        Development
        .find({},{"properties": { $elemMatch: {"_id": new ObjectID(id)}}})
        .update({"properties":properties})
        .exec((err, saved) => {
              err ? reject(err)
                  : resolve(saved);
          });
    });
});

let Development = mongoose.model('Development', developmentSchema);

export default Development;
