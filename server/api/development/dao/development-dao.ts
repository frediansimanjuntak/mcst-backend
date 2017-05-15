import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import developmentSchema from '../model/development-model';
import Attachment from '../../attachment/dao/attachment-dao';
import User from '../../user/dao/user-dao';
import {AWSService} from '../../../global/aws.service';
import {GlobalService} from '../../../global/global.service';

developmentSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {"development": development};

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
            .populate("newsletter.attachment  newsletter.release_by newsletter.created_by")
            .exec((err, newsletters) => {
                err ? reject(err)
                    : resolve(newsletters.newsletter);
            });
    });
});

developmentSchema.static('getByIdNewsletter', (name_url:string, idnewsletter:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }

        var ObjectID = mongoose.Types.ObjectId;

        Development 
            .findOne({"name_url": name_url})
            .populate("newsletter.attachment newsletter.release_by newsletter.created_by")
            .select({"newsletter": {$elemMatch: {"_id": new ObjectID(idnewsletter)}}})
            .exec((err, newsletters) => {
                if(err){
                    reject(err);
                }
                if(newsletters){
                    _.each(newsletters.newsletter, (result) => {
                        resolve(result);
                    })
                }
            });
    });
});

developmentSchema.static('createNewsletter', (name_url:string, newsletter:Object, userId:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
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
            .findOneAndUpdate({"name_url": name_url}, {
                $pull:{
                    "newsletter": {
                        "id": idnewsletter
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
            Attachment.createAttachment(attachment, userId)
                .then(res => {
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
            .populate ("properties.landlord.data.resident properties.created_by properties.tenant.data.resident") 
            .exec((err, properties) => {
                err ? reject(err)
                    : resolve(properties);
            });
    });
});

developmentSchema.static('getByIdDevProperties', (idDevelopment:string, idProperties:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        var ObjectID = mongoose.Types.ObjectId;
        Development 
            .findById(idDevelopment)
            .populate ("properties.landlord.data.resident properties.created_by properties.tenant.data.resident") 
            .select({"properties": {$elemMatch: {"_id": new ObjectID(idProperties)}}})                
            .exec((err, res) => {
                if(err){
                    reject(err);
                }
                if(res){
                    _.each(res.properties, (result) => {
                        resolve(result);
                    })
                }
            });        
    });
});

developmentSchema.static('getByIdProperties', (name_url:string, idproperties:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }

        var ObjectID = mongoose.Types.ObjectId;

        Development 
            .findOne({"name_url": name_url})
            .populate ("properties.landlord.data.resident properties.created_by properties.tenant.data.resident") 
            .select({"properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}})                
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

        Development
            .findOneAndUpdate({"name_url": name_url}, {
                $push: {
                    "properties": properties 
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

        Development
            .findOneAndUpdate({"name_url": name_url}, {
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

developmentSchema.static('generateCodeProperties', (name_url:string, idproperties:string, properties:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }    

        let body:any = properties;
          
        let landlordCode = Math.random().toString(36).substr(2, 5);  
        let tenantCode = Math.random().toString(36).substr(2, 5); 
        let updateObj = {$set: {}};
        let dataLandlord = {
            "code.landlord": landlordCode,
            "code.create_at_landlord": new Date()
        }
        let dataTenant = {
            "code.tenant": tenantCode,
            "code.create_at_tenant": new Date()
        }
        if (body.type == "landlord"){
            Development.updateProperties(name_url, idproperties, dataLandlord).then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
        }

        if (body.type == "tenant"){
            Development.updateProperties(name_url, idproperties, dataTenant).then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            });
        }

        if (body.type == "all"){
            Development.updateProperties(name_url, idproperties, dataLandlord).then((res) => {
                Development.updateProperties(name_url, idproperties, dataTenant).then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
            })
            .catch((err) => {
                reject(err);
            });
            
        }
    });
});

developmentSchema.static('deleteCodeProperties', (name_url:string, idproperties:string, properties:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }    

        let body:any = properties;
        let ObjectID = mongoose.Types.ObjectId;  
        let landlordCode = Math.random().toString(36).substr(2, 5);  
        let tenantCode = Math.random().toString(36).substr(2, 5); 

        if (body.type == "landlord"){
            Development
                .update({"name_url": name_url, "properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}}, {
                    $unset: {              
                        "properties.$.code.landlord": landlordCode,
                        "properties.$.code.create_at_landlord": new Date()
                    }
                })
                .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
                });
        }

        if (body.type == "tenant"){
            Development
                .update({"name_url": name_url, "properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}}, {
                    $unset: {              
                        "properties.$.code.tenant": tenantCode,
                        "properties.$.code.create_at_tenant": new Date()
                    }
                })
                .exec((err, saved) => {
                    err ? reject(err)
                        : resolve(saved);
                });
        }

        if (body.type == "all"){
            Development
            .update({"name_url": name_url, "properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}}, {
                $unset: {              
                    "properties.$.code.landlord": landlordCode,
                    "properties.$.code.create_at_landlord": new Date(),
                    "properties.$.code.tenant": tenantCode,
                    "properties.$.code.create_at_tenant": new Date()
                }
            })
            .exec((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
            });
        }

    });
});

//delete Landlord
developmentSchema.static('deleteLandlord', (name_url:string, idproperties:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }

        let ObjectID = mongoose.Types.ObjectId; 
        
        Development
            .findOne({"name_url": name_url})
            .select({"properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}})  
            .exec((err, developments) => {
                if(err){
                    reject(err);
                }
                if(developments){
                    let developmentId = developments._id;
                    let properties = developments.properties;
                    for(var i = 0; i < properties.length; i++){
                        let landlordData = properties[i].landlord.data;
                        let landlordId = landlordData.resident;
                         User
                            .update({"_id": landlordId, "owned_property.property": idproperties, "owned_property.development": developmentId},{
                                $set: {
                                    "owned_property.$.active": false
                                }
                            })
                            .exec((err, updated) => {
                                if(err){
                                    reject(err);
                                }
                                if(updated){
                                    Development
                                        .update({"name_url": name_url, "properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}}, {
                                            $push: {
                                                "properties.$.landlord.history":{
                                                    "date": new Date(),
                                                    "data": landlordData
                                                }
                                            },
                                            $unset: {  
                                                "properties.$.landlord.data": ""
                                            }
                                        }, {upsert: true})
                                        .exec((err, updated) => {
                                            if(err){
                                                reject(err);
                                            }
                                            if(updated){
                                                resolve(updated);
                                            }
                                        })
                                }
                            });
                    }                    
                }
            })
    });
});

//change Landlord
developmentSchema.static('changeLandlord', (name_url:string, idproperties:string, landlord:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }

        let body:any = landlord
        let ObjectID = mongoose.Types.ObjectId; 
        
        Development
            .findOne({"name_url": name_url})
            .select({"properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}})  
            .exec((err, developments) => {
                if(err){
                    reject(err);
                }
                if(developments){
                    resolve(developments);
                    let developmentId = developments._id;
                    let properties = developments.properties;
                    for(var i = 0; i < properties.length; i++){
                        let landlordData = properties[i].landlord.data;
                        let landlordId = landlordData.resident;
                         User
                            .update({"_id": landlordId, "owned_property.property": idproperties, "owned_property.development": developmentId},{
                                $set: {
                                    "owned_property.$.active": false
                                }
                            })
                            .exec((err, updated) => {
                                if(err){
                                    reject(err);
                                }
                                if(updated){
                                    Development
                                        .update({"name_url": name_url, "properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}}, {
                                            $push: {
                                                "properties.$.landlord.history":{
                                                    "date": new Date(),
                                                    "data": landlordData
                                                }
                                            },
                                            $set: {  
                                                "properties.$.landlord.data": {
                                                    "resident": body.resident,
                                                    "remarks": body.remarks,
                                                    "created_at": new Date()
                                                }
                                            }
                                        }, {upsert: true})
                                        .exec((err, updated) => {
                                            if(err){
                                                reject(err);
                                            }
                                            if(updated){
                                                 User
                                                    .update({"_id": body.resident, "owned_property.property": idproperties, "owned_property.development": developmentId},{
                                                        $set: {
                                                            "owned_property.$.active": false
                                                        }
                                                    })
                                                    .exec((err, updated) => {
                                                        if(err){
                                                            reject(err);
                                                        }
                                                        if(updated){
                                                            resolve(updated);
                                                        }
                                                    })
                                            }
                                        })
                                }
                            });
                    }                    
                }
            })
    });
});

//Staff Development
developmentSchema.static('createStaffDevelopment', (name_url:string, staff:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }

        Development
            .findOneAndUpdate({"name_url": name_url}, {
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

        Development
        .findOneAndUpdate({"name_url": name_url}, {
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

        var pipeline = [{
            $match: {
                "name_url": name_url,
                "properties.tenant.data._id": mongoose.Types.ObjectId(idtenant)
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
                $unwind: "$properties.tenant.data"
            },
            {
                $match: {
                    "properties.tenant.data._id": mongoose.Types.ObjectId(idtenant)
                }
            },
            {
                $project: {
                    "_id": 0,
                    "tenant": "$properties.tenant.data"
            }
        }];      

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

developmentSchema.static('deleteTenantProperties', (name_url:string, idtenant:string, idproperties:string, tenant:Object, development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
            return reject(new TypeError('Development Name is not a valid string.'));
        }
        let ObjectID = mongoose.Types.ObjectId;
        
        Development.getByIdTenantProperties(name_url, idproperties, idtenant)
        .then(res => {            
            for(var i = 0; i < res.length; i++){
                let tenant = res[i].tenant;
                let resident = tenant.resident;
                Development
                    .findOne({"name_url": name_url})
                    .exec((err, developments) => {
                        if(err){
                            reject(err);
                        }
                        if(developments){
                            let developmentId = developments._id;
                            User
                                .update({"_id": resident, "rented_property.property": idproperties, "rented_property.development": developmentId},{
                                    $set: {
                                        "rented_property.$.active": false
                                    }
                                })
                                .exec((err, updated) => {
                                    if(err){
                                        reject(err);
                                    }
                                    if(updated){
                                        Development
                                            .update({"name_url": name_url, "properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}}, {
                                                $push: {
                                                    "properties.$.tenant.history": {
                                                        "date": new Date(),
                                                        "data": tenant
                                                    }
                                                },
                                                $pull: {
                                                    "properties.$.tenant.data": {
                                                        "_id": mongoose.Types.ObjectId(idtenant)
                                                    }
                                                }
                                            })
                                            .exec((err, updated) => {
                                                err ? reject(err)
                                                    : resolve(updated);
                                            });
                                    }
                                });
                        }
                    }) 
            }
        })     
    });
});

developmentSchema.static('updateTenantProperties', (name_url:string, idtenant:string, tenant:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
        return reject(new TypeError('Development Name is not a valid string.'));
        }      

        let tenantObj = {$set: {}};
        for(var param in tenant) {
           tenantObj.$set['properties.0.tenant.$.'+param] = tenant[param];
        }

        let ObjectID = mongoose.Types.ObjectId;

        Development
            .update({"name_url": name_url, "properties.tenant.data._id": new ObjectID(idtenant)}, tenantObj)
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

        var ObjectID = mongoose.Types.ObjectId;

        Development
            .findOne({"name_url": name_url})
            .select({"properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}})  
            .populate("properties.register_vehicle.owner properties.register_vehicle.document") 
            .exec((err, res) => {
                if(err){
                    reject(err);
                }
                if(res){
                    let property;
                    if(res.properties){
                        property = res.properties
                    }
                    console.log(property);
                    _.each(property, (res) => {
                        resolve(res.registered_vehicle);
                    })
                }
            });
    });
});

developmentSchema.static('getByIdRegisterVehicleProperties', (name_url:string, idproperties:string, idregistervehicle:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
    if (!_.isString(name_url)) {
    return reject(new TypeError('Development Name is not a valid string.'));
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
    }];      

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

        let ObjectID = mongoose.Types.ObjectId; 
        let body:any = registervehicle;
        console.log(registervehicle);
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

developmentSchema.static('getOwnerVehicleByLicensePlat', (name_url:string, license_plate:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
        return reject(new TypeError('Development Name is not a valid string.'));
        }
        var _query = {"name_url": name_url, "properties.registered_vehicle.license_plate": license_plate};

        Development
            .find(_query)
            .exec((err, saved) => {
                err ? reject(err)
                    : resolve(saved);
            });
    });
});

developmentSchema.static('deleteRegisterVehicleProperties', (name_url:string, idregistervehicle:string, idproperties: string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(name_url)) {
        return reject(new TypeError('Development Name is not a valid string.'));
        }
        let ObjectID = mongoose.Types.ObjectId; 

        Development
            .update({"name_url": name_url, "properties": {$elemMatch: {"_id": new ObjectID(idproperties)}}}, {
                $pull:{
                    "properties.$.registered_vehicle": {
                        "_id": new ObjectID(idregistervehicle)
                    }
                }
            })
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
