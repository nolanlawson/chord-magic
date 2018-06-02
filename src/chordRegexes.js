
import { noteNamings } from './noteNamings'
import { chordAddeds } from './chordAddeds.js'
import { chordSuspendeds } from './chordSuspendeds'
import { chordQualities } from './chordQualities'
import { chordExtendeds } from './chordExtendeds'

function initializeChordRegexes () {
  let map = {}

  Object.keys(noteNamings).forEach(function (noteNaming) {
    map[noteNaming] = initializeChordRegex(noteNamings[noteNaming])
  })
  return map
}

function initializeChordRegex (noteNaming) {
  let chordRegex = {}

  let regexString = createRegexString(noteNaming)
  let regexStringWithParens = createRegexStringWithParens(regexString)

  chordRegex.regexString = regexString
  chordRegex.regexStringWithParens = regexStringWithParens
  chordRegex.pattern = new RegExp(regexString)
  chordRegex.patternWithParens = new RegExp(regexStringWithParens)

  return chordRegex
}

function optional (pattern) {
  return '(' + pattern + '?)'
}

function concatenateAllValues (map) {
  let res = []
  Object.keys(map).forEach(function (key) {
    res = res.concat(map[key])
  })
  return res
}

// extendeds are different; their values are an array of
// [type, names]
function concatenateAllValuesForExtendeds (map) {
  let res = []
  Object.keys(map).forEach(function (key) {
    res = res.concat(map[key][1])
  })
  return res
}

function createRegexString (noteNaming) {
  return greedyDisjunction(concatenateAllValues(noteNaming), true) + // root note
    optional(greedyDisjunction(
      concatenateAllValues(chordQualities).concat(
        concatenateAllValuesForExtendeds(chordExtendeds)))) + // quality OR seventh
    optional(greedyDisjunction(concatenateAllValues(chordAddeds))) + // add
    optional(greedyDisjunction(concatenateAllValues(chordSuspendeds))) + // sus

    // overridden root note ("over")
    optional('(?:/' + greedyDisjunction(concatenateAllValues(noteNaming)) +
      ')')
}

function createRegexStringWithParens (regexString) {
  return '[\\(\\[]' + regexString + '[\\)\\]]'
}

function quote (str) {
  // stolen from http://stackoverflow.com/a/3614500/680742
  let regexpSpecialChars = /([[\]^$|()\\+*?{}=!])/gi

  return str.replace(regexpSpecialChars, '\\$1')
}

/**
 * Take an array of strings and make a greedy disjunction regex pattern out of it,
 * with the longest strings first, e.g. ["sus4","sus","sus2"] -->
 *
 * (sus4|sus2|sus)
 * @param allAliases
 * @return
 */
function greedyDisjunction (aliases, matchingGroup) {
  aliases = aliases.slice() // copy

  // sort by longest string first
  aliases.sort(function (a, b) {
    let lenCompare = b.length - a.length
    if (lenCompare !== 0) {
      return lenCompare < 0 ? -1 : 1
    }
    // else sort by normal string comparison
    return a < b ? -1 : 1
  })

  let res = '('

  if (!matchingGroup) {
    res += '?:' //  non-matching group
  }

  aliases.forEach(function (alias, i) {
    if (!alias) {
      return // e.g. the "major" quality can be expressed as an empty string, so skip in the regex
    }
    if (i > 0) {
      res += '|'
    }
    res += quote(alias)
  })

  return res + ')'
}

export const chordRegexes = initializeChordRegexes()
