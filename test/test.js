/*jshint expr:true */
'use strict';

var chai = require('chai');
chai.use(require("chai-as-promised"));

var chordParser = require('../');
var Chord = require('../chord');

//
// more variables you might want
//
var should = chai.should(); // var should = chai.should();

function testRegex(name, chord) {
  var actual = chordParser.parse(name).toJSON();
  var expected = chord.toJSON();
  actual.should.deep.equal(expected);
}

function tests() {

  // this is like some White Album B-side shit right here
  var lotsaChords = ['Cmaj7', 'C#maj7', 'Amaj7', 'A#maj7', 'Dmaj7', 'Gmaj7', 'Gadd9', 'Gadd11',
    'Abadd9', 'Abminadd9', 'Gsus4', 'G#sus', 'Absus2', 'Asus4', 'G/F', 'G#/Bb', 'C/D', 'C7',
    'D#7', 'D#maj7', 'D#m7', 'D#min7', 'D#M7', 'C', 'CM', 'Cm', 'C2', 'C4', 'C9', 'C11', 'C13',
    'Am9', 'C6', 'C5', 'D5', 'Eb5', 'GMaj7', 'GM7', 'Gmaj7'];

  describe('basic tests', function () {

    it('should pass the original java tests', function () {

      testRegex("Cmaj7", new Chord('C', 'Major', 'Major7', null, null, null));
      testRegex("C#maj7", new Chord('Db', 'Major', 'Major7', null, null, null));
      testRegex("Amaj7", new Chord('A', 'Major', 'Major7', null, null, null));
      testRegex("A#maj7", new Chord('Bb', 'Major', 'Major7', null, null, null));
      testRegex("Dmaj7", new Chord('D', 'Major', 'Major7', null, null, null));
      testRegex("Gmaj7", new Chord('G', 'Major', 'Major7', null, null, null));

      testRegex("Gadd9", new Chord('G', 'Major', null, 'Add9', null, null));
      testRegex("Gadd11", new Chord('G', 'Major', null, 'Add11', null, null));
      testRegex("Abadd9", new Chord('Ab', 'Major', null, 'Add9', null, null));
      testRegex("Abminadd9", new Chord('Ab', 'Minor', null, 'Add9', null, null));

      testRegex("Gsus4", new Chord('G', 'Major', null, null, 'Sus4', null));
      testRegex("G#sus", new Chord('Ab', 'Major', null, null, 'Sus4', null));
      testRegex("Absus2", new Chord('Ab', 'Major', null, null, 'Sus2', null));
      testRegex("Asus4", new Chord('A', 'Major', null, null, 'Sus4', null));

      testRegex("G/F", new Chord('G', 'Major', null, null, null, 'F'));
      testRegex("G#/Bb", new Chord('Ab', 'Major', null, null, null, 'Bb'));
      testRegex("C/D", new Chord('C', 'Major', null, null, null, 'D'));

      testRegex("C7", new Chord('C', 'Major', 'Dominant7', null, null, null));
      testRegex("D#7", new Chord('Eb', 'Major', 'Dominant7', null, null, null));
      testRegex("D#maj7", new Chord('Eb', 'Major', 'Major7', null, null, null));
      testRegex("D#m7", new Chord('Eb', 'Minor', 'Minor7', null, null, null));
      testRegex("D#min7", new Chord('Eb', 'Minor', 'Minor7', null, null, null));
      testRegex("D#M7", new Chord('Eb', 'Major', 'Major7', null, null, null));

      testRegex("C", new Chord('C', 'Major', null, null, null, null));
      testRegex("CM", new Chord('C', 'Major', null, null, null, null));
      testRegex("Cm", new Chord('C', 'Minor', null, null, null, null));

      testRegex("C2", new Chord('C', 'Major', null, 'Add9', null, null));
      testRegex("C4", new Chord('C', 'Major', null, 'Add11', null, null));

      testRegex("C9", new Chord('C', 'Major', 'Major9', null, null, null));
      testRegex("C11", new Chord('C', 'Major', 'Major11', null, null, null));
      testRegex("C13", new Chord('C', 'Major', 'Major13', null, null, null));

      testRegex("Am9", new Chord('A', 'Minor', 'Minor9', null, null, null));
      testRegex("C6", new Chord('C', 'Major', null, 'Major6', null, null));

      testRegex("C5", new Chord('C', 'Major', null, 'PowerChord', null, null));
      testRegex("D5", new Chord('D', 'Major', null, 'PowerChord', null, null));
      testRegex("Eb5", new Chord('Eb', 'Major', null, 'PowerChord', null, null));

      testRegex("GMaj7", new Chord('G', 'Major', 'Major7', null, null, null));
      testRegex("GM7", new Chord('G', 'Major', 'Major7', null, null, null));
      testRegex("Gmaj7", new Chord('G', 'Major', 'Major7', null, null, null));

    });

    it('should serialize to/from json', function () {

      lotsaChords.forEach(function (stringChord) {
        var chord = chordParser.parse(stringChord);

        var asJson = chord.toJSON();

        var fromJson = Chord.fromJSON(asJson);

        var fullCircle = fromJson.toJSON();


        asJson.should.equal(fullCircle);

        var fields = ['root', 'quality', 'extended', 'suspended', 'added', 'overridingRoot'];

        fields.forEach(function (field) {
          if (chord[field]) {
            chord[field].should.equal(fromJson[field]);
          } else { // undefined
            should.not.exist(fromJson[field]);
          }
        });
      });
    });
  });
}

tests();
