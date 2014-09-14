'use strict';

var extend = require('extend');

exports.extend = extend;

exports.clone = function (obj) {
  return extend(true, {}, obj);
};