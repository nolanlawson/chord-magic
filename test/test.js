/*jshint expr:true */
'use strict';

var chai = require('chai');
chai.use(require("chai-as-promised"));

var chordMagic = require('../lib');
var parse = chordMagic.parse;
var Chord = chordMagic.Chord;

//
// more variables you might want
//
var should = chai.should(); // var should = chai.should();

function testRegex(name, chord, noteNaming) {
  var opts = {
    naming: noteNaming || 'English'
  };
  var actual = parse(name, opts).toJSON();
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
        var chord = parse(stringChord);

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

    it('does English note names', function () {

      testRegex("C", new Chord('C', 'Major', null, null, null, null), 'English');
      testRegex("D", new Chord('D', 'Major', null, null, null, null), 'English');
      testRegex("E", new Chord('E', 'Major', null, null, null, null), 'English');
      testRegex("F", new Chord('F', 'Major', null, null, null, null), 'English');

    });

    it('does Northern European note names', function () {
      testRegex("B", new Chord('Bb', 'Major', null, null, null, null), 'NorthernEuropean');
      testRegex("C", new Chord('C', 'Major', null, null, null, null), 'NorthernEuropean');
      testRegex("H", new Chord('B', 'Major', null, null, null, null), 'NorthernEuropean');
      testRegex("F", new Chord('F', 'Major', null, null, null, null), 'NorthernEuropean');
    });

    it('does Southern European note names', function () {
      testRegex("Do", new Chord('C', 'Major', null, null, null, null), 'SouthernEuropean');
      testRegex("Re", new Chord('D', 'Major', null, null, null, null), 'SouthernEuropean');
      testRegex("Mi", new Chord('E', 'Major', null, null, null, null), 'SouthernEuropean');
      testRegex("Fa", new Chord('F', 'Major', null, null, null, null), 'SouthernEuropean');
    });

    it('transposes', function () {

      function testTranspose(input, num, output) {
        parse(input).transpose(num).toJSON().should.equal(
          parse(output).toJSON());
      }
      testTranspose('G', 2, 'A');
      testTranspose('G7', 2, 'A7');
      testTranspose('A', -2, 'G');
      testTranspose('A7', 2, 'B7');
      testTranspose('G#', 2, 'Bb');
      testTranspose('A', 1, 'Bb');
      testTranspose('A', 12, 'A');
      testTranspose('G/F', 2, 'A/G');
      testTranspose('G/F', 14, 'A/G');
      testTranspose('G/F', -10, 'A/G');
      testTranspose('Bb/A', 0, 'Bb/A');

      testTranspose('Amaj7', 1, 'A#maj7');
      testTranspose('Amaj7', 1, 'Bbmaj7');
      testTranspose('Amaj7', 2, 'Bmaj7');
      testTranspose('Amaj7', 3, 'Cmaj7');
      testTranspose('Amaj7', 4, 'C#maj7');
      testTranspose('Amaj7', 5, 'Dmaj7');
      testTranspose('Amaj7', 6, 'D#maj7');
      testTranspose('Amaj7', 6, 'Ebmaj7');
      testTranspose('Amaj7', 7, 'Emaj7');
      testTranspose('Amaj7', 8, 'Fmaj7');
      testTranspose('Amaj7', 9, 'F#maj7');
      testTranspose('Amaj7', 9, 'Gbmaj7');
      testTranspose('Amaj7', 10, 'Gmaj7');
      testTranspose('Amaj7', 11, 'G#maj7');

      testTranspose('Amaj7', -11, 'A#maj7');
      testTranspose('Amaj7', -11, 'Bbmaj7');
      testTranspose('Amaj7', -10, 'Bmaj7');
      testTranspose('Amaj7', -9, 'Cmaj7');
      testTranspose('Amaj7', -8, 'C#maj7');
      testTranspose('Amaj7', -7, 'Dmaj7');
      testTranspose('Amaj7', -6, 'D#maj7');
      testTranspose('Amaj7', -6, 'Ebmaj7');
      testTranspose('Amaj7', -5, 'Emaj7');
      testTranspose('Amaj7', -4, 'Fmaj7');
      testTranspose('Amaj7', -3, 'F#maj7');
      testTranspose('Amaj7', -3, 'Gbmaj7');
      testTranspose('Amaj7', -2, 'Gmaj7');
      testTranspose('Amaj7', -1, 'G#maj7');
    });

    it('should pretty print', function () {
      parse('Amaj7').prettyPrint().should.equal('Amaj7');
      parse('AMaj7').prettyPrint().should.equal('Amaj7');
      parse('AM7').prettyPrint().should.equal('Amaj7');
      parse('A7').prettyPrint().should.equal('A7');
      parse('A').prettyPrint().should.equal('A');

      parse('A#maj7').prettyPrint().should.equal('Bbmaj7');
      parse('A#Maj7').prettyPrint().should.equal('Bbmaj7');
      parse('A#M7').prettyPrint().should.equal('Bbmaj7');
      parse('A#7').prettyPrint().should.equal('Bb7');
      parse('A#').prettyPrint().should.equal('Bb');

      parse('Lamaj7', {naming: 'SouthernEuropean'}).prettyPrint().should.equal('Amaj7');
      parse('LaMaj7', {naming: 'SouthernEuropean'}).prettyPrint().should.equal('Amaj7');
      parse('LaM7', {naming: 'SouthernEuropean'}).prettyPrint().should.equal('Amaj7');
      parse('La7', {naming: 'SouthernEuropean'}).prettyPrint().should.equal('A7');
      parse('La', {naming: 'SouthernEuropean'}).prettyPrint().should.equal('A');

      parse('Amaj7').prettyPrint({naming: 'SouthernEuropean'}).should.equal('Lamaj7');
      parse('AMaj7').prettyPrint({naming: 'SouthernEuropean'}).should.equal('Lamaj7');
      parse('AM7').prettyPrint({naming: 'SouthernEuropean'}).should.equal('Lamaj7');
      parse('A7').prettyPrint({naming: 'SouthernEuropean'}).should.equal('La7');
      parse('A').prettyPrint({naming: 'SouthernEuropean'}).should.equal('La');

      // TODO: all of these defaults may change in the future, depending on
      // what we think is the most "common" representation
      parse('Cmaj7').prettyPrint().should.equal('Cmaj7');
      parse('C#maj7').prettyPrint().should.equal('Dbmaj7');
      parse('Amaj7').prettyPrint().should.equal('Amaj7');
      parse('A#maj7').prettyPrint().should.equal('Bbmaj7');
      parse('Dmaj7').prettyPrint().should.equal('Dmaj7');
      parse('Gmaj7').prettyPrint().should.equal('Gmaj7');
      parse('Gadd9').prettyPrint().should.equal('Gadd9');
      parse('Gadd11').prettyPrint().should.equal('Gadd11');
      parse('Abadd9').prettyPrint().should.equal('Abadd9');
      parse('Abminadd9').prettyPrint().should.equal('Abmadd9');
      parse('Gsus4').prettyPrint().should.equal('Gsus4');
      parse('G#sus').prettyPrint().should.equal('Absus4');
      parse('Absus2').prettyPrint().should.equal('Absus2');
      parse('Asus4').prettyPrint().should.equal('Asus4');
      parse('G/F').prettyPrint().should.equal('G/F');
      parse('G#/Bb').prettyPrint().should.equal('Ab/Bb');
      parse('C/D').prettyPrint().should.equal('C/D');
      parse('C7').prettyPrint().should.equal('C7');
      parse('D#7').prettyPrint().should.equal('Eb7');
      parse('D#maj7').prettyPrint().should.equal('Ebmaj7');
      parse('D#m7').prettyPrint().should.equal('Ebm7');
      parse('D#min7').prettyPrint().should.equal('Ebm7');
      parse('D#M7').prettyPrint().should.equal('Ebmaj7');
      parse('C').prettyPrint().should.equal('C');
      parse('CM').prettyPrint().should.equal('C');
      parse('Cm').prettyPrint().should.equal('Cm');
      parse('C2').prettyPrint().should.equal('Cadd9');
      parse('C4').prettyPrint().should.equal('Cadd11');
      parse('C9').prettyPrint().should.equal('Cmaj9');
      parse('C11').prettyPrint().should.equal('Cmaj11');
      parse('C13').prettyPrint().should.equal('Cmaj13');
      parse('Am9').prettyPrint().should.equal('Amin9');
      parse('C6').prettyPrint().should.equal('C6');
      parse('C5').prettyPrint().should.equal('C5');
      parse('D5').prettyPrint().should.equal('D5');
      parse('Eb5').prettyPrint().should.equal('Eb5');
      parse('GMaj7').prettyPrint().should.equal('Gmaj7');
      parse('GM7').prettyPrint().should.equal('Gmaj7');
      parse('Gmaj7').prettyPrint().should.equal('Gmaj7');

    });
  });
}

tests();
