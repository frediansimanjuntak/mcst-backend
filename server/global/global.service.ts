'use strict';
import config from '../config/environment/index';
import Development from '../api/development/dao/development-dao';

declare global {
  interface String {
    indexOfEnd(string:string): number;
    lastIndexOfEnd(string:string): number;
  }
}

export class GlobalService {
  static init():void {
    let _root = process.cwd();
  }

  static initGlobalFunction():void {
    String.prototype.indexOfEnd = function(string) {
      var io = this.indexOf(string);
      return io == -1 ? -1 : io + string.length;
    };

    String.prototype.lastIndexOfEnd = function(string) {
      var io = this.lastIndexOf(string);
      return io == -1 ? -1 : io + string.length;
    };
  }

  static validateEmail(email) {
    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
  }

  static validateObjectId(id) {
    var patt = new RegExp("^[0-9a-fA-F]{24}$");
    return patt.test(id);
  }

  static slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '');         // Trim - from end of text
  }

  static autoPasswordUser() {
    let password = Math.random().toString(36).substr(2, 6).toUpperCase(); 
    return password;
  }

  static verivicationCode() {
    let code = Math.random().toString(36).substr(2, 4).toUpperCase(); 
    return code;
  }

  static randomCode(){
    let randomCode = Math.floor(Math.random() * 9000000000) + 1000000000;
    return randomCode;
  }

  static propertyCode(type){
    let randomCode = Math.random().toString(36).substr(2, 5);
    let _query;
    var generateCode = function() {
      if (type == 'landlord'){
        _query = {"properties.code.landlord": randomCode};
      }
      else if (type == 'tenant') {
        _query = {"properties.code.tenant": randomCode};
      }
      Development
        .find(_query)
        .exec((err, petition) => {
          if (err) {
            return({message: err.message});
          }
          else if (petition) {
            if (petition.length > 0) {
              generateCode();
            }
            else {
              return randomCode;
            }
          }
        })
    }
    generateCode();
  } 
}