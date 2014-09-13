'use strict';

var Chord = require('./chord');
var chordRegexes = require('./chord-regexes');
var reverseLookups = require('./reverse-lookups');

exports.Chord = Chord;
exports.parse = function parse(str, opts) {
  opts = opts || {};
  var noteNaming = opts.naming || 'English';

  var match = str.match(chordRegexes[noteNaming].pattern);

  return match && parseObject(match, noteNaming);
};

function parseObject(match, noteNaming) {

  // match objects is 6 elements:
  // full string, root, quality or extended, added, suspended, overriding root
  // e.g. ["Cmaj7", "C", "maj7", "", "", ""]

  var root;
  var quality;
  var extended;
  var added;
  var suspended;
  var overridingRoot;

  root = reverseLookups.roots[noteNaming][match[1]];

  var foundExtended = reverseLookups.extendeds[match[2]];
  if (foundExtended) {
    quality = foundExtended.quality;
    extended = foundExtended.extended;
  } else { // normal quality without extended
    quality = reverseLookups.qualities[match[2]];
  }

  if (match[3]) {
    added = reverseLookups.addeds[match[3]];
  }

  if (match[4]) {
    suspended = reverseLookups.suspendeds[match[4]];
  }

  if (match[5]) {
    // substring(1) to cut off the slash, because it's e.g. "/F"
    overridingRoot = reverseLookups.roots[noteNaming][match[5].substring(1)];
  }

  return new Chord(root, quality, extended, added, suspended, overridingRoot);
}