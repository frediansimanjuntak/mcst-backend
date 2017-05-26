'use strict';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import config from '../config/environment/index';
import {GlobalService} from './global.service';
//Firebase Cloud Messaging (FCM)
var FCM = require('fcm-node');
var serverKey = config.fcm.serverKey; //put your server key here 
var fcm = new FCM(serverKey);

export class FCMService {
    static sendMessage(userToken:Object, type:string, title:string) {
        return new Promise((resolve:Function, reject:Function) => {            
            var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera) 
                "priority": "high",
                "content_available": true,
                "registration_ids": userToken, 
                "collapse_key": type,                
                "notification": {
                    "title": type, 
                    "body": title
                }         
            };
            fcm.send(message, function(err, response){
                if (err) {
                    console.log("Something has gone wrong!", err);
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
        });
  }
}