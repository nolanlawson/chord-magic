'use strict';

function Chord(root, quality, extended, added, suspended, overridingRoot) {
  this.root = root;
  this.quality = quality;
  this.extended = extended;
  this.added = added;
  this.suspended = suspended;
  this.overridingRoot = overridingRoot;
}

Chord.fromJSON = function (str) {
  var json = JSON.parse(str);
  return new Chord(json.root, json.quality, json.extended, json.added,
    json.suspended, json.overridingRoot);
};

Chord.prototype.toJSON = function () {
  var res = {
    root: this.root,
    quality: this.quality
  };
  if (this.extended) {
    res.extended = this.extended;
  }
  if (this.added) {
    res.added = this.added;
  }
  if (this.suspended) {
    res.suspended = this.suspended;
  }
  if (this.overridingRoot) {
    res.overridingRoot = this.overridingRoot;
  }
  return JSON.stringify(res);
};

module.exports = Chord;