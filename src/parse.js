import { chordRegexes } from './chordRegexes'
import {
  rootLookups,
  chordExtendedsLookups,
  chordQualitiesLookups,
  chordAddedsLookups,
  chordSuspendedsLookups
} from './reverseLookups'

function parseObject (match, noteNaming) {
  // match objects is 6 elements:
  // full string, root, quality or extended, added, suspended, overriding root
  // e.g. ["Cmaj7", "C", "maj7", "", "", ""]

  let res = {}

  res.root = rootLookups[noteNaming][match[1]]

  let foundExtended = chordExtendedsLookups[match[2]]
  if (foundExtended) {
    res.quality = foundExtended.quality
    res.extended = foundExtended.extended
  } else { // normal quality without extended
    res.quality = chordQualitiesLookups[match[2]]
  }

  if (match[3]) {
    res.added = chordAddedsLookups[match[3]]
  }

  if (match[4]) {
    res.suspended = chordSuspendedsLookups[match[4]]
  }

  if (match[5]) {
    // substring(1) to cut off the slash, because it's e.g. "/F"
    res.overridingRoot = rootLookups[noteNaming][match[5].substring(1)]
  }

  return res
}

export function parse (str, opts) {
  opts = opts || {}
  let noteNaming = opts.naming || 'English'

  let match = str.match(chordRegexes[noteNaming].pattern)

  return match && parseObject(match, noteNaming)
}
