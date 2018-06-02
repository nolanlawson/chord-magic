// given a string and a note naming, return the structured version of it.

import { noteNamings } from './noteNamings'
import { chordQualities } from './chordQualities'
import { chordExtendeds } from './chordExtendeds'
import { chordAddeds } from './chordAddeds.js'
import { chordSuspendeds } from './chordSuspendeds'

const rootLookups = {}

Object.keys(noteNamings).forEach(function (noteNaming) {
  rootLookups[noteNaming] = {}
  addReverseLookups(rootLookups[noteNaming], noteNamings[noteNaming])
})

let chordQualitiesLookups = {}

addReverseLookups(chordQualitiesLookups, chordQualities)

let chordExtendedsLookups = {}

addReverseLookupsForExtendeds(chordExtendedsLookups, chordExtendeds)

let chordSuspendedsLookups = {}

addReverseLookups(chordSuspendedsLookups, chordSuspendeds)

let chordAddedsLookups = {}

addReverseLookups(chordAddedsLookups, chordAddeds)

function addReverseLookups (reverseDict, dict) {
  Object.keys(dict).forEach(function (key) {
    let arr = dict[key]
    arr.forEach(function (element) {
      reverseDict[element] = key
    })
  })
}

// extendeds are a little different, because they contain both the quality
// and the extendeds
function addReverseLookupsForExtendeds (reverseDict, dict) {
  Object.keys(dict).forEach(function (key) {
    let pair = dict[key]
    let quality = pair[0]
    let extendedsArr = pair[1]
    extendedsArr.forEach(function (element) {
      reverseDict[element] = {
        quality: quality,
        extended: key
      }
    })
  })
}

export const reverseLookups = {
  roots: rootLookups,
  qualities: chordQualitiesLookups,
  extendeds: chordExtendedsLookups,
  addeds: chordAddedsLookups,
  suspendeds: chordSuspendedsLookups
}
