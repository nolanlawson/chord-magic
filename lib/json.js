'use strict';

exports.toJSON = function toJSON(chord) {
  var res = {
    root: chord.root,
    quality: chord.quality
  };
  if (chord.extended) {
    res.extended = chord.extended;
  }
  if (chord.added) {
    res.added = chord.added;
  }
  if (chord.suspended) {
    res.suspended = chord.suspended;
  }
  if (chord.overridingRoot) {
    res.overridingRoot = chord.overridingRoot;
  }
  return JSON.stringify(res);
};

exports.fromJSON = function fromJSON (Chord, str) {
  var json = JSON.parse(str);
  return new Chord(json.root, json.quality, json.extended, json.added,
    json.suspended, json.overridingRoot);
};