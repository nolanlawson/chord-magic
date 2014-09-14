'use strict';

var transpose = require('./transpose');
var json = require('./json');
var prettyPrint = require('./pretty-print');

function Chord(root, quality, extended, added, suspended, overridingRoot) {
  this.root = root;
  this.quality = quality;
  this.extended = extended;
  this.added = added;
  this.suspended = suspended;
  this.overridingRoot = overridingRoot;
}

Chord.fromJSON = function (str) {
  return json.fromJSON(Chord, str);
};

Chord.prototype.toJSON = function () {
  return json.toJSON(this);
};

Chord.prototype.clone = function () {
  return Chord.fromJSON(this.toJSON());
};

Chord.prototype.transpose = function (num) {
  return transpose(this, num);
};

Chord.prototype.prettyPrint = function (opts) {
  opts = opts || {};
  var naming = opts.naming || 'English';
  return prettyPrint(this, naming);
};

module.exports = Chord;