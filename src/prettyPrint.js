import { noteNamings } from './noteNamings'
import { chordQualities } from './chordQualities'
import { chordExtendeds } from './chordExtendeds'
import { chordAddeds } from './chordAddeds.js'
import { chordSuspendeds } from './chordSuspendeds'

export function prettyPrint (chord, opts) {
  opts = opts || {}
  let naming = opts.naming || 'English'

  let toPrintableNote
  // can specify an object here or one of 'English', 'NorthernEuropean', 'SouthernEuropean'
  if (typeof naming === 'string') {
    toPrintableNote = note => noteNamings[naming][note][0]
  } else {
    let noteNamesAsList = Object.keys(noteNamings.English)
    toPrintableNote = note => naming[noteNamesAsList.indexOf(note)]
  }

  // just use the first name for now, but later we may want to add options
  // to allow people to choose how to express chord. e.g. to prefer flats
  // instead of sharps, or prefer certain flats to certain sharps, etc.
  // (e.g. 'Bb' seems to be more common than 'A#', but 'F#' is more common than 'Ab')

  let str = toPrintableNote(chord.root)
  if (chord.extended) {
    str += chordExtendeds[chord.extended][1][0]
  } else {
    str += chordQualities[chord.quality][0]
  }

  if (chord.added) {
    str += chordAddeds[chord.added][0]
  }

  if (chord.suspended) {
    str += chordSuspendeds[chord.suspended][0]
  }

  if (chord.overridingRoot) {
    str += '/' + toPrintableNote(chord.overridingRoot)
  }
  return str
}
