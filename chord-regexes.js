'use strict';

var noteNamings = require('./note-namings');
var chordAddeds = require('./chord-addeds');
var chordSuspendeds = require('./chord-suspendeds');
var chordQualities = require('./chord-qualities');
var chordExtendeds = require('./chord-extendeds');

var chordRegexes = initializeChordRegexes();

module.exports = chordRegexes;

function initializeChordRegexes() {
  var map = {};

  Object.keys(noteNamings).forEach(function (noteNaming) {
    map[noteNaming] = initializeChordRegex(noteNamings[noteNaming]);
  });
  return map;
}

function initializeChordRegex(noteNaming) {
  var chordRegex = {};

  var regexString = createRegexString(noteNaming);
  var regexStringWithParens = createRegexStringWithParens(regexStringWithParens);

  chordRegex.regexString = regexString;
  chordRegex.regexStringWithParens = regexStringWithParens;
  chordRegex.pattern = new RegExp(regexString);
  chordRegex.patternWithParens = new RegExp(regexStringWithParens);

  return chordRegex;
}

function optional(pattern) {
  return "(" + pattern + "?)";
}

function concatenateAllValues(map) {
  var res = [];
  Object.keys(map).forEach(function (key) {
    res = res.concat(map[key]);
  });
  return res;
}

// extendeds are different; their values are an array of
// [type, names]
function concatenateAllValuesForExtendeds(map) {
  var res = [];
  Object.keys(map).forEach(function (key) {
    res = res.concat(map[key][1]);
  });
  return res;
}

function createRegexString(noteNaming) {
  return greedyDisjunction(concatenateAllValues(noteNaming), true) + // root note
    optional(greedyDisjunction(
      concatenateAllValues(chordQualities).concat(
        concatenateAllValuesForExtendeds(chordExtendeds)))) + // quality OR seventh
    optional(greedyDisjunction(concatenateAllValues(chordAddeds))) + // add
    optional(greedyDisjunction(concatenateAllValues(chordSuspendeds))) + // sus

    // overridden root note ("over")
    optional("(?:/" + greedyDisjunction(concatenateAllValues(noteNaming)) +
      ")");
}

function createRegexStringWithParens(regexString) {
  return "[\\(\\[]" + regexString + "[\\)\\]]";
}

function quote(str) {
  // stolen from http://stackoverflow.com/a/3614500/680742
  var regexpSpecialChars = /([\[\]\^\$\|\(\)\\\+\*\?\{\}\=\!])/gi;

  return str.replace(regexpSpecialChars, '\\$1');
}

/**
 * Take an array of strings and make a greedy disjunction regex pattern out of it,
 * with the longest strings first, e.g. ["sus4","sus","sus2"] -->
 *
 * (sus4|sus2|sus)
 * @param allAliases
 * @return
 */
function greedyDisjunction(aliases, matchingGroup) {

  aliases = aliases.slice(); // copy

  // sort by longest string first
  aliases.sort(function (a, b) {
    var lenCompare = b.length - a.length;
    if (lenCompare !== 0) {
      return lenCompare < 0 ? -1 : 1;
    }
    // else sort by normal string comparison
    return a < b ? -1 : 1;
  });

  var res = '(';

  if (!matchingGroup) {
    res +=  '?:'; //  non-matching group
  }

  aliases.forEach(function (alias, i) {
    if (!alias) {
      return; // e.g. the "major" quality can be expressed as an empty string, so skip in the regex
    }
    if (i > 0) {
      res += '|';
    }
    res += quote(alias);
  });

  return res + ')';
}

initializeChordRegexes();