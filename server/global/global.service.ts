'use strict';
import config from '../config/environment/index';

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
  static globalFunction():void {
    String.prototype.indexOfEnd = function(string) {
      var io = this.indexOf(string);
      return io == -1 ? -1 : io + string.length;
    };

    String.prototype.lastIndexOfEnd = function(string) {
      var io = this.lastIndexOf(string);
      return io == -1 ? -1 : io + string.length;
    };
  }
}
