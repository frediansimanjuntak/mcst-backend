import * as mongoose from 'mongoose';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import attachmentSchema from '../model/attachment-model';
import Development from '../../development/dao/development-dao';
import {AWSService} from '../../../global/aws.service';

attachmentSchema.static('getAll', (development:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        let _query = {};

        Attachment
          .find(_query)
          .exec((err, attachments) => {
              err ? reject(err)
                  : resolve(attachments);
          });
    });
});

attachmentSchema.static('getById', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {

        Attachment
          .findById(id)
          .exec((err, attachments) => {
              err ? reject(err)
                  : resolve(attachments);
          });
    });
});


attachmentSchema.static('createAttachment', (attachment:Object, userId:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(attachment)) {
          return reject(new TypeError('Attachment is not a valid object.'));
        }

        var files = [].concat(attachment);
        var idAtt = [];
        var errAtt = 0;

        if(files.length > 0)
        {
            var i = 0;
            var attachmentfile = function() {
              let file:any = files[i];
              let key:string = 'attachment/'+file.name;
              if(files[i].size >= 8388608) {
                for(var j =0; j < idAtt.length; j++){
                  Attachment.deleteAttachments(idAtt[j]);
                }
                reject({message: "Error uploading your images, file size to large"});
              }
              else{
                AWSService.upload(key, file).then(fileDetails => {
                  var fileName = fileDetails.name.replace(" ","%20");
                  var _attachment = new Attachment(attachment);
                  _attachment.name = fileDetails.name;
                  _attachment.type = fileDetails.type;
                  _attachment.key = 'attachment/'+fileName;
                  _attachment.description = fileName;
                  _attachment.save((err, saved) => {
                    if(err != null) 
                    {
                      errAtt = errAtt + 1;
                      for(var j =0; j < idAtt.length; j++){
                        Attachment.deleteAttachments(idAtt[j]);
                      }
                      reject({message: "Error uploading your images"});
                    }                
                  });

                  let idattach = _attachment.id;  
                  idAtt.push(idattach);
                   
                  if (i >= files.length - 1){
                    if(errAtt == 0) {
                      resolve({idAtt, errAtt});  
                    }
                    else{
                      resolve({errAtt});
                    }
                  }
                  else {
                    i++;
                    if(errAtt == 0) {
                      attachmentfile();
                    }
                  }              
                })
              }
            }
            if(errAtt == 0) {
              attachmentfile();
            }
        }
        else {
          resolve({message: "success"});
        }                 
    });      
});

attachmentSchema.static('deleteAttachment', (id:string):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isString(id)) {
            return reject(new TypeError('Id is not a valid string.'));
        }

        Attachment
          .findById(id)
          .exec((err, attachment) => {
            if (err)
              reject(err)
            if (attachment)
              attachment.remove((err:any) => {
                if (err)
                  reject(err)
                resolve({ message: "success" });
              });
            else
              reject(new Error("Attachment not found."));
          });
    });
});

attachmentSchema.static('updateAttachment', (id:string, attachment:Object):Promise<any> => {
    return new Promise((resolve:Function, reject:Function) => {
        if (!_.isObject(attachment)) {
          return reject(new TypeError('Attachment is not a valid object.'));
        }

        Attachment
          .findByIdAndUpdate(id, attachment)
          .exec((err, updated) => {
                err ? reject(err)
                    : resolve(updated);
          });
    });
});

let Attachment = mongoose.model('Attachment', attachmentSchema);

export default Attachment;
