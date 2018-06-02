/* global describe it */

const chai = require('chai')
chai.should()
const expect = chai.expect

const chordMagic = require('../dist/chord-magic.cjs.js')
const parse = chordMagic.parse
const prettyPrint = chordMagic.prettyPrint
const transpose = chordMagic.transpose

function tests () {
  // this is like some White Album B-side shit right here
  let lotsaChords = ['Cmaj7', 'C#maj7', 'Amaj7', 'A#maj7', 'Dmaj7', 'Gmaj7', 'Gadd9', 'Gadd11',
    'Abadd9', 'Abminadd9', 'Gsus4', 'G#sus', 'Absus2', 'Asus4', 'G/F', 'G#/Bb', 'C/D', 'C7',
    'D#7', 'D#maj7', 'D#m7', 'D#min7', 'D#M7', 'C', 'CM', 'Cm', 'C2', 'C4', 'C9', 'C11', 'C13',
    'Am9', 'C6', 'C5', 'D5', 'Eb5', 'GMaj7', 'GM7', 'Gmaj7']

  describe('basic tests', function () {
    it('should pass the original java tests', function () {
      testRegex('Cmaj7', makeChord('C', 'Major', 'Major7', null, null, null))
      testRegex('C#maj7', makeChord('Db', 'Major', 'Major7', null, null, null))
      testRegex('Amaj7', makeChord('A', 'Major', 'Major7', null, null, null))
      testRegex('A#maj7', makeChord('Bb', 'Major', 'Major7', null, null, null))
      testRegex('Dmaj7', makeChord('D', 'Major', 'Major7', null, null, null))
      testRegex('Gmaj7', makeChord('G', 'Major', 'Major7', null, null, null))

      testRegex('Gadd9', makeChord('G', 'Major', null, 'Add9', null, null))
      testRegex('Gadd11', makeChord('G', 'Major', null, 'Add11', null, null))
      testRegex('Abadd9', makeChord('Ab', 'Major', null, 'Add9', null, null))
      testRegex('Abminadd9', makeChord('Ab', 'Minor', null, 'Add9', null, null))

      testRegex('Gsus4', makeChord('G', 'Major', null, null, 'Sus4', null))
      testRegex('G#sus', makeChord('Ab', 'Major', null, null, 'Sus4', null))
      testRegex('Absus2', makeChord('Ab', 'Major', null, null, 'Sus2', null))
      testRegex('Asus4', makeChord('A', 'Major', null, null, 'Sus4', null))

      testRegex('G/F', makeChord('G', 'Major', null, null, null, 'F'))
      testRegex('G#/Bb', makeChord('Ab', 'Major', null, null, null, 'Bb'))
      testRegex('C/D', makeChord('C', 'Major', null, null, null, 'D'))

      testRegex('C7', makeChord('C', 'Major', 'Dominant7', null, null, null))
      testRegex('D#7', makeChord('Eb', 'Major', 'Dominant7', null, null, null))
      testRegex('D#maj7', makeChord('Eb', 'Major', 'Major7', null, null, null))
      testRegex('D#m7', makeChord('Eb', 'Minor', 'Minor7', null, null, null))
      testRegex('D#min7', makeChord('Eb', 'Minor', 'Minor7', null, null, null))
      testRegex('D#-7', makeChord('Eb', 'Minor', 'Minor7', null, null, null))
      testRegex('D#M7', makeChord('Eb', 'Major', 'Major7', null, null, null))

      testRegex('C', makeChord('C', 'Major', null, null, null, null))
      testRegex('CM', makeChord('C', 'Major', null, null, null, null))
      testRegex('Cm', makeChord('C', 'Minor', null, null, null, null))

      testRegex('C2', makeChord('C', 'Major', null, 'Add9', null, null))
      testRegex('C4', makeChord('C', 'Major', null, 'Add11', null, null))

      testRegex('C9', makeChord('C', 'Major', 'Major9', null, null, null))
      testRegex('C11', makeChord('C', 'Major', 'Major11', null, null, null))
      testRegex('C13', makeChord('C', 'Major', 'Major13', null, null, null))

      testRegex('Am9', makeChord('A', 'Minor', 'Minor9', null, null, null))
      testRegex('C6', makeChord('C', 'Major', null, 'Major6', null, null))

      testRegex('C5', makeChord('C', 'Major', null, 'PowerChord', null, null))
      testRegex('D5', makeChord('D', 'Major', null, 'PowerChord', null, null))
      testRegex('Eb5', makeChord('Eb', 'Major', null, 'PowerChord', null, null))

      testRegex('GMaj7', makeChord('G', 'Major', 'Major7', null, null, null))
      testRegex('GM7', makeChord('G', 'Major', 'Major7', null, null, null))
      testRegex('Gmaj7', makeChord('G', 'Major', 'Major7', null, null, null))
    })

    it('should be commutative', function () {
      lotsaChords.forEach(function (stringChord) {
        let chord = parse(stringChord)
        let otherChord = parse(prettyPrint(chord))

        chord.should.deep.equal(otherChord)
      })
    })

    it('does English note names', function () {
      testRegex('C', makeChord('C', 'Major', null, null, null, null), 'English')
      testRegex('D', makeChord('D', 'Major', null, null, null, null), 'English')
      testRegex('E', makeChord('E', 'Major', null, null, null, null), 'English')
      testRegex('F', makeChord('F', 'Major', null, null, null, null), 'English')
    })

    it('does Northern European note names', function () {
      testRegex('B', makeChord('Bb', 'Major', null, null, null, null), 'NorthernEuropean')
      testRegex('C', makeChord('C', 'Major', null, null, null, null), 'NorthernEuropean')
      testRegex('H', makeChord('B', 'Major', null, null, null, null), 'NorthernEuropean')
      testRegex('F', makeChord('F', 'Major', null, null, null, null), 'NorthernEuropean')
    })

    it('does Southern European note names', function () {
      testRegex('Do', makeChord('C', 'Major', null, null, null, null), 'SouthernEuropean')
      testRegex('Re', makeChord('D', 'Major', null, null, null, null), 'SouthernEuropean')
      testRegex('Mi', makeChord('E', 'Major', null, null, null, null), 'SouthernEuropean')
      testRegex('Fa', makeChord('F', 'Major', null, null, null, null), 'SouthernEuropean')
    })

    it('transposes', function () {
      function testTranspose (input, num, output) {
        transpose(parse(input), num).should.deep.equal(parse(output))
      }
      testTranspose('G', 2, 'A')
      testTranspose('G7', 2, 'A7')
      testTranspose('A', -2, 'G')
      testTranspose('A7', 2, 'B7')
      testTranspose('G#', 2, 'Bb')
      testTranspose('A', 1, 'Bb')
      testTranspose('A', 12, 'A')
      testTranspose('G/F', 2, 'A/G')
      testTranspose('G/F', 14, 'A/G')
      testTranspose('G/F', -10, 'A/G')
      testTranspose('Bb/A', 0, 'Bb/A')

      testTranspose('Amaj7', 1, 'A#maj7')
      testTranspose('Amaj7', 1, 'Bbmaj7')
      testTranspose('Amaj7', 2, 'Bmaj7')
      testTranspose('Amaj7', 3, 'Cmaj7')
      testTranspose('Amaj7', 4, 'C#maj7')
      testTranspose('Amaj7', 5, 'Dmaj7')
      testTranspose('Amaj7', 6, 'D#maj7')
      testTranspose('Amaj7', 6, 'Ebmaj7')
      testTranspose('Amaj7', 7, 'Emaj7')
      testTranspose('Amaj7', 8, 'Fmaj7')
      testTranspose('Amaj7', 9, 'F#maj7')
      testTranspose('Amaj7', 9, 'Gbmaj7')
      testTranspose('Amaj7', 10, 'Gmaj7')
      testTranspose('Amaj7', 11, 'G#maj7')

      testTranspose('Amaj7', -11, 'A#maj7')
      testTranspose('Amaj7', -11, 'Bbmaj7')
      testTranspose('Amaj7', -10, 'Bmaj7')
      testTranspose('Amaj7', -9, 'Cmaj7')
      testTranspose('Amaj7', -8, 'C#maj7')
      testTranspose('Amaj7', -7, 'Dmaj7')
      testTranspose('Amaj7', -6, 'D#maj7')
      testTranspose('Amaj7', -6, 'Ebmaj7')
      testTranspose('Amaj7', -5, 'Emaj7')
      testTranspose('Amaj7', -4, 'Fmaj7')
      testTranspose('Amaj7', -3, 'F#maj7')
      testTranspose('Amaj7', -3, 'Gbmaj7')
      testTranspose('Amaj7', -2, 'Gmaj7')
      testTranspose('Amaj7', -1, 'G#maj7')
    })

    it('should pretty print', function () {
      prettyPrint(parse('Amaj7')).should.equal('Amaj7')
      prettyPrint(parse('AMaj7')).should.equal('Amaj7')
      prettyPrint(parse('AM7')).should.equal('Amaj7')
      prettyPrint(parse('A7')).should.equal('A7')
      prettyPrint(parse('A')).should.equal('A')

      prettyPrint(parse('A#maj7')).should.equal('Bbmaj7')
      prettyPrint(parse('A#Maj7')).should.equal('Bbmaj7')
      prettyPrint(parse('A#M7')).should.equal('Bbmaj7')
      prettyPrint(parse('A#7')).should.equal('Bb7')
      prettyPrint(parse('A#')).should.equal('Bb')

      prettyPrint(parse('Lamaj7', {naming: 'SouthernEuropean'})).should.equal('Amaj7')
      prettyPrint(parse('LaMaj7', {naming: 'SouthernEuropean'})).should.equal('Amaj7')
      prettyPrint(parse('LaM7', {naming: 'SouthernEuropean'})).should.equal('Amaj7')
      prettyPrint(parse('La7', {naming: 'SouthernEuropean'})).should.equal('A7')
      prettyPrint(parse('La', {naming: 'SouthernEuropean'})).should.equal('A')

      prettyPrint(parse('Amaj7'), {naming: 'SouthernEuropean'}).should.equal('Lamaj7')
      prettyPrint(parse('AMaj7'), {naming: 'SouthernEuropean'}).should.equal('Lamaj7')
      prettyPrint(parse('AM7'), {naming: 'SouthernEuropean'}).should.equal('Lamaj7')
      prettyPrint(parse('A7'), {naming: 'SouthernEuropean'}).should.equal('La7')
      prettyPrint(parse('A'), {naming: 'SouthernEuropean'}).should.equal('La')

      // TODO: all of these defaults may change in the future, depending on
      // what we think is the most "common" representation
      prettyPrint(parse('Cmaj7')).should.equal('Cmaj7')
      prettyPrint(parse('C#maj7')).should.equal('Dbmaj7')
      prettyPrint(parse('Amaj7')).should.equal('Amaj7')
      prettyPrint(parse('A#maj7')).should.equal('Bbmaj7')
      prettyPrint(parse('Dmaj7')).should.equal('Dmaj7')
      prettyPrint(parse('Gmaj7')).should.equal('Gmaj7')
      prettyPrint(parse('Gadd9')).should.equal('Gadd9')
      prettyPrint(parse('Gadd11')).should.equal('Gadd11')
      prettyPrint(parse('Abadd9')).should.equal('Abadd9')
      prettyPrint(parse('Abminadd9')).should.equal('Abmadd9')
      prettyPrint(parse('Gsus4')).should.equal('Gsus4')
      prettyPrint(parse('G#sus')).should.equal('Absus4')
      prettyPrint(parse('Absus2')).should.equal('Absus2')
      prettyPrint(parse('Asus4')).should.equal('Asus4')
      prettyPrint(parse('G/F')).should.equal('G/F')
      prettyPrint(parse('G#/Bb')).should.equal('Ab/Bb')
      prettyPrint(parse('C/D')).should.equal('C/D')
      prettyPrint(parse('C7')).should.equal('C7')
      prettyPrint(parse('D#7')).should.equal('Eb7')
      prettyPrint(parse('D#maj7')).should.equal('Ebmaj7')
      prettyPrint(parse('D#m7')).should.equal('Ebm7')
      prettyPrint(parse('D#min7')).should.equal('Ebm7')
      prettyPrint(parse('D#M7')).should.equal('Ebmaj7')
      prettyPrint(parse('C')).should.equal('C')
      prettyPrint(parse('CM')).should.equal('C')
      prettyPrint(parse('Cm')).should.equal('Cm')
      prettyPrint(parse('C2')).should.equal('Cadd9')
      prettyPrint(parse('C4')).should.equal('Cadd11')
      prettyPrint(parse('C9')).should.equal('Cmaj9')
      prettyPrint(parse('C11')).should.equal('Cmaj11')
      prettyPrint(parse('C13')).should.equal('Cmaj13')
      prettyPrint(parse('Am9')).should.equal('Amin9')
      prettyPrint(parse('C6')).should.equal('C6')
      prettyPrint(parse('C5')).should.equal('C5')
      prettyPrint(parse('D5')).should.equal('D5')
      prettyPrint(parse('Eb5')).should.equal('Eb5')
      prettyPrint(parse('GMaj7')).should.equal('Gmaj7')
      prettyPrint(parse('GM7')).should.equal('Gmaj7')
      prettyPrint(parse('Gmaj7')).should.equal('Gmaj7')
    })

    it('should throw errors', function () {
      expect(() => transpose('A')).to.throw()
      expect(() => transpose('J', 1)).to.throw()
    })

    it('should allow custom namings - flats', function () {
      let flatsOnly = [
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
      ]

      chordMagic.prettyPrint(chordMagic.parse('A'), {naming: flatsOnly}).should.equal('A')
      chordMagic.prettyPrint(chordMagic.parse('A#'), {naming: flatsOnly}).should.equal('Bb')
      chordMagic.prettyPrint(chordMagic.parse('Bb'), {naming: flatsOnly}).should.equal('Bb')
      chordMagic.prettyPrint(chordMagic.parse('C'), {naming: flatsOnly}).should.equal('C')
      chordMagic.prettyPrint(chordMagic.parse('C#'), {naming: flatsOnly}).should.equal('Db')
      chordMagic.prettyPrint(chordMagic.parse('D'), {naming: flatsOnly}).should.equal('D')
      chordMagic.prettyPrint(chordMagic.parse('Eb'), {naming: flatsOnly}).should.equal('Eb')
      chordMagic.prettyPrint(chordMagic.parse('F'), {naming: flatsOnly}).should.equal('F')
      chordMagic.prettyPrint(chordMagic.parse('F#'), {naming: flatsOnly}).should.equal('Gb')
      chordMagic.prettyPrint(chordMagic.parse('G'), {naming: flatsOnly}).should.equal('G')
      chordMagic.prettyPrint(chordMagic.parse('G#'), {naming: flatsOnly}).should.equal('Ab')
      chordMagic.prettyPrint(chordMagic.parse('Ab'), {naming: flatsOnly}).should.equal('Ab')

      chordMagic.prettyPrint(chordMagic.parse('D/F#'), {naming: flatsOnly}).should.equal('D/Gb')
      chordMagic.prettyPrint(chordMagic.parse('C#/Ab'), {naming: flatsOnly}).should.equal('Db/Ab')
      chordMagic.prettyPrint(chordMagic.parse('F#/C#'), {naming: flatsOnly}).should.equal('Gb/Db')
    })

    it('should allow custom namings - sharps', function () {
      let sharpsOnly = [
        'A',
        'A#',
        'B',
        'C',
        'C#',
        'D',
        'D#',
        'E',
        'F',
        'F#',
        'G',
        'G#'
      ]

      chordMagic.prettyPrint(chordMagic.parse('A'), {naming: sharpsOnly}).should.equal('A')
      chordMagic.prettyPrint(chordMagic.parse('A#'), {naming: sharpsOnly}).should.equal('A#')
      chordMagic.prettyPrint(chordMagic.parse('Bb'), {naming: sharpsOnly}).should.equal('A#')
      chordMagic.prettyPrint(chordMagic.parse('C'), {naming: sharpsOnly}).should.equal('C')
      chordMagic.prettyPrint(chordMagic.parse('C#'), {naming: sharpsOnly}).should.equal('C#')
      chordMagic.prettyPrint(chordMagic.parse('D'), {naming: sharpsOnly}).should.equal('D')
      chordMagic.prettyPrint(chordMagic.parse('Eb'), {naming: sharpsOnly}).should.equal('D#')
      chordMagic.prettyPrint(chordMagic.parse('F'), {naming: sharpsOnly}).should.equal('F')
      chordMagic.prettyPrint(chordMagic.parse('F#'), {naming: sharpsOnly}).should.equal('F#')
      chordMagic.prettyPrint(chordMagic.parse('G'), {naming: sharpsOnly}).should.equal('G')
      chordMagic.prettyPrint(chordMagic.parse('G#'), {naming: sharpsOnly}).should.equal('G#')
      chordMagic.prettyPrint(chordMagic.parse('Ab'), {naming: sharpsOnly}).should.equal('G#')

      chordMagic.prettyPrint(chordMagic.parse('D/F#'), {naming: sharpsOnly}).should.equal('D/F#')
      chordMagic.prettyPrint(chordMagic.parse('C#/Ab'), {naming: sharpsOnly}).should.equal('C#/G#')
      chordMagic.prettyPrint(chordMagic.parse('F#/C#'), {naming: sharpsOnly}).should.equal('F#/C#')
    })
  })
}

function testRegex (name, chord, noteNaming) {
  let opts = {
    naming: noteNaming || 'English'
  }
  let actual = parse(name, opts)
  actual.should.deep.equal(chord)
}

function makeChord (root, quality, extended, added, suspended, overridingRoot) {
  let res = {root: root}
  if (quality) {
    res.quality = quality
  }
  if (extended) {
    res.extended = extended
  }
  if (added) {
    res.added = added
  }
  if (suspended) {
    res.suspended = suspended
  }
  if (overridingRoot) {
    res.overridingRoot = overridingRoot
  }
  return res
}

tests()
