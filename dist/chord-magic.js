!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.chordMagic=e():"undefined"!=typeof global?global.chordMagic=e():"undefined"!=typeof self&&(self.chordMagic=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

module.exports = {
  Add9: ["add9", "2"],
  Add11: ["add11", "4"],
  Major6: ["6","maj6","major6", "M6"],
  SixNine: ["6/9"],
  PowerChord: ["5"] // duh duh DUH, duh duh DUH-duh, duh duh DUH, duh duh ((c) Deep Purple)
};
},{}],2:[function(require,module,exports){
'use strict';

module.exports = {
  // sevenths
  Major7: ['Major', ["maj7", "Maj7", "M7", "+7"]],
  Minor7: ['Minor', ["m7", "Min7", "min7", "minor7"]],
  Dominant7: ['Major', ["7", "dom7", "dominant7"]],
  Diminished7: ['Diminished', ["dim7", "diminished7"]],

  // true extended
  Major9: ['Major', ["maj9", "M9", "9"]],
  Major11: ['Major', ["maj11", "M11", "11"]],
  Major13: ['Major', ["maj13", "M13", "13"]],

  // weird ones
  AugmentedDominant7: ['Major', ["7#5", "7(#5]"]],
  AugmentedMajor7: ['Major', ["maj7#5", "maj7(#5]"]],

  // TODO: I don't know what this one is - can't find it on wikipedia
  Minor9: ['Minor', ["min9", "m9", "minor9"]]
  
};
},{}],3:[function(require,module,exports){
'use strict';

module.exports = {
  Major:  ["", "major", "maj", "M"],
  Minor:  ["m", "minor", "min"],
  Augmented: ["aug", "augmented", "+"],
  Diminished: ["dim", "diminished"]
};
},{}],4:[function(require,module,exports){
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
},{"./chord-addeds":1,"./chord-extendeds":2,"./chord-qualities":3,"./chord-suspendeds":6,"./note-namings":8}],5:[function(require,module,exports){
'use strict';

module.exports = [
  'A',
  'Bb',
  'B',
  'C',
  'Db',
  'D',
  'Eb',
  'E',
  'F',
  'Gb',
  'G',
  'Ab'
];
},{}],6:[function(require,module,exports){
'use strict';

module.exports = {
  Sus4: ["sus4", "suspended", "sus"],
  Sus2: ["sus2", "suspended2"]
};
},{}],7:[function(require,module,exports){
'use strict';

exports.parse = require('./parse');
exports.prettyPrint = require('./pretty-print');
exports.transpose = require('./transpose');
},{"./parse":9,"./pretty-print":10,"./transpose":12}],8:[function(require,module,exports){
'use strict';

var English = {};
English['A'] = ['A'];
English['Bb'] = ['Bb', 'A#', 'Asharp', 'Bflat'];
English['B'] = ['B'];
English['C'] = ['C'];
English['Db'] = ['Db', 'C#', 'Dflat', 'Csharp'];
English['D'] = ['D'];
English['Eb'] = ['Eb', 'D#', 'Eflat', 'Dsharp'];
English['E'] = ['E'];
English['F'] = ['F'];
English['Gb'] = ['Gb', 'F#', 'Gflat', 'Gsharp'];
English['G'] = ['G'];
English['Ab'] = ['Ab', 'G#', 'Aflat', 'Gsharp'];

var NorthernEuropean = {};
NorthernEuropean['A'] = ['A'];
NorthernEuropean['Bb'] = ['B', 'A#', 'Asharp'];
NorthernEuropean['B'] = ['H'];
NorthernEuropean['C'] = ['C'];
NorthernEuropean['Db'] = ['Db', 'C#', 'Dflat', 'Csharp'];
NorthernEuropean['D'] = ['D'];
NorthernEuropean['Eb'] = ['Eb', 'D#', 'Eflat', 'Dsharp'];
NorthernEuropean['E'] = ['E'];
NorthernEuropean['F'] = ['F'];
NorthernEuropean['Gb'] = ['Gb', 'F#', 'Gflat', 'Gsharp'];
NorthernEuropean['G'] = ['G'];
NorthernEuropean['Ab'] = ['Ab', 'G#', 'Aflat', 'Gsharp'];

var SouthernEuropean = {};
SouthernEuropean['A'] = ['La'];
SouthernEuropean['Bb'] = ['Tib', 'La#'];
SouthernEuropean['B'] = ['Ti'];
SouthernEuropean['C'] = ['Do'];
SouthernEuropean['Db'] = ['Reb', 'Réb', 'Do#'];
SouthernEuropean['D'] = ['Re', 'Ré'];
SouthernEuropean['Eb'] = ['Mib', 'Re#'];
SouthernEuropean['E'] = ['Mi'];
SouthernEuropean['F'] = ['Fa'];
SouthernEuropean['Gb'] = ['Solb', 'Sob', 'Fa#'];
SouthernEuropean['G'] = ['Sol', 'So'];
SouthernEuropean['Ab'] = ['Lab', 'So#', 'Sol#'];

module.exports = {
  English: English,
  NorthernEuropean: NorthernEuropean,
  SouthernEuropean: SouthernEuropean
};
},{}],9:[function(require,module,exports){
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
},{"./chord-regexes":4,"./reverse-lookups":11}],10:[function(require,module,exports){
'use strict';

var noteNamings = require('./note-namings');
var chordQualities = require('./chord-qualities');
var chordExtendeds = require('./chord-extendeds');
var chordAddeds = require('./chord-addeds');
var chordSuspendeds = require('./chord-suspendeds');

module.exports = function prettyPrint(chord, opts) {
  opts = opts || {};
  var naming = opts.naming || 'English';
  // just use the first name for now, but later we may want to add options
  // to allow people to choose how to express chord. e.g. to prefer flats
  // instead of sharps, or prefer certain flats to certain sharps, etc.
  // (e.g. 'Bb' seems to be more common than 'A#', but 'F#' is more common than 'Ab')

  var str = noteNamings[naming][chord.root][0];
  if (chord.extended) {
    str += chordExtendeds[chord.extended][1][0];
  } else {
    str += chordQualities[chord.quality][0];
  }

  if (chord.added) {
    str += chordAddeds[chord.added][0];
  }

  if (chord.suspended) {
    str += chordSuspendeds[chord.suspended][0];
  }

  if (chord.overridingRoot) {
    str += '/' + noteNamings[naming][chord.overridingRoot][0];
  }
  return str;
};
},{"./chord-addeds":1,"./chord-extendeds":2,"./chord-qualities":3,"./chord-suspendeds":6,"./note-namings":8}],11:[function(require,module,exports){
'use strict';

// given a string and a note naming, return the structured version of it.

var rootLookups = {};

var noteNamings = require('./note-namings');
var chordQualities = require('./chord-qualities');
var chordExtendeds = require('./chord-extendeds');
var chordAddeds = require('./chord-addeds');
var chordSuspendeds = require('./chord-suspendeds');

Object.keys(noteNamings).forEach(function (noteNaming) {
  rootLookups[noteNaming] = {};
  addReverseLookups(rootLookups[noteNaming], noteNamings[noteNaming]);
});

var chordQualitiesLookups = {};

addReverseLookups(chordQualitiesLookups, chordQualities);

var chordExtendedsLookups = {};

addReverseLookupsForExtendeds(chordExtendedsLookups, chordExtendeds);

var chordSuspendedsLookups = {};

addReverseLookups(chordSuspendedsLookups, chordSuspendeds);

var chordAddedsLookups = {};

addReverseLookups(chordAddedsLookups, chordAddeds);

function addReverseLookups(reverseDict, dict) {
  Object.keys(dict).forEach(function (key) {
    var arr = dict[key];
    arr.forEach(function (element) {
      reverseDict[element] = key;
    });
  });
}

// extendeds are a little different, because they contain both the quality
// and the extendeds
function addReverseLookupsForExtendeds(reverseDict, dict) {
  Object.keys(dict).forEach(function (key) {
    var pair = dict[key];
    var quality = pair[0];
    var extendedsArr = pair[1];
    extendedsArr.forEach(function (element) {
      reverseDict[element] = {
        quality: quality,
        extended: key
      };
    });
  });
}

module.exports = {
  roots: rootLookups,
  qualities: chordQualitiesLookups,
  extendeds: chordExtendedsLookups,
  addeds: chordAddedsLookups,
  suspendeds: chordSuspendedsLookups
};
},{"./chord-addeds":1,"./chord-extendeds":2,"./chord-qualities":3,"./chord-suspendeds":6,"./note-namings":8}],12:[function(require,module,exports){
'use strict';

var chordRoots = require('./chord-roots');
var clone = require('./utils').clone;

function transposeNote(note, num) {

  var idx = chordRoots.indexOf(note);

  if (idx === -1) {
    throw new Error('unknown note: ' + note);
  }

  idx += num;

  if (idx > 0) {
    idx = idx % chordRoots.length;
  } else {
    idx = (chordRoots.length + idx) % chordRoots.length;
  }

  return chordRoots[idx];
}

module.exports = function transpose(chord, num) {
  if (typeof num !== 'number') {
    throw new Error('you need to provide a number');
  }

  var transposedChord = clone(chord);

  transposedChord.root = transposeNote(chord.root, num);

  if (chord.overridingRoot) {
    transposedChord.overridingRoot = transposeNote(chord.overridingRoot, num);
  }

  return transposedChord;
};
},{"./chord-roots":5,"./utils":13}],13:[function(require,module,exports){
'use strict';

var extend = require('extend');

exports.extend = extend;

exports.clone = function (obj) {
  return extend(true, {}, obj);
};
},{"extend":14}],14:[function(require,module,exports){
var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;
var undefined;

var isPlainObject = function isPlainObject(obj) {
	"use strict";
	if (!obj || toString.call(obj) !== '[object Object]' || obj.nodeType || obj.setInterval) {
		return false;
	}

	var has_own_constructor = hasOwn.call(obj, 'constructor');
	var has_is_property_of_method = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !has_own_constructor && !has_is_property_of_method) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {}

	return key === undefined || hasOwn.call(obj, key);
};

module.exports = function extend() {
	"use strict";
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if (typeof target !== "object" && typeof target !== "function" || target == undefined) {
			target = {};
	}

	for (; i < length; ++i) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && Array.isArray(src) ? src : [];
					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);

				// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}]},{},[7])
(7)
});
;