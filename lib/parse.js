'use strict';

var chordRegexes = require('./chord-regexes');
var reverseLookups = require('./reverse-lookups');

module.exports = function parse(str, opts) {
  opts = opts || {};
  var noteNaming = opts.naming || 'English';

  var match = str.match(chordRegexes[noteNaming].pattern);

  return match && parseObject(match, noteNaming);
};

function parseObject(match, noteNaming) {

  // match objects is 6 elements:
  // full string, root, quality or extended, added, suspended, overriding root
  // e.g. ["Cmaj7", "C", "maj7", "", "", ""]

  var res = {};

  res.root = reverseLookups.roots[noteNaming][match[1]];

  var foundExtended = reverseLookups.extendeds[match[2]];
  if (foundExtended) {
    res.quality = foundExtended.quality;
    res.extended = foundExtended.extended;
  } else { // normal quality without extended
    res.quality = reverseLookups.qualities[match[2]];
  }

  if (match[3]) {
    res.added = reverseLookups.addeds[match[3]];
  }

  if (match[4]) {
    res.suspended = reverseLookups.suspendeds[match[4]];
  }

  if (match[5]) {
    // substring(1) to cut off the slash, because it's e.g. "/F"
    res.overridingRoot = reverseLookups.roots[noteNaming][match[5].substring(1)];
  }

  return res;
}