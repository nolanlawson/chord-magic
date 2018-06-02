Chord Magic [![Build Status](https://travis-ci.org/nolanlawson/chord-magic.svg)](https://travis-ci.org/nolanlawson/chord-magic)
==========

Chord Magic is a parser, disambiguator, transposer, and pretty-printer for musical chords. It runs in Node.js and the browser.

```js
// parse a chord
var chord = chordMagic.parse('A7');

console.log(chord); // { root: 'A', quality: 'Major', extended: 'Dominant7' }

// transpose it up 3 half-steps
chord = chordMagic.transpose(chord, 3);

console.log(chord); // { root: 'C', quality: 'Major', extended: 'Dominant7' }
  
// pretty-print
chordMagic.prettyPrint(chord); // 'C7'

// pretty-print in Do-Re-Mi format
chordMagic.prettyPrint(chord, {naming: 'SouthernEuropean'}); // 'Do7'
```

Install
------

#### In Node.js

```bash
npm install chord-magic
```

```js
var chordMagic = require('chord-magic')
```

#### In the browser

Use `browserify` or just take the browser builds from the `dist` directory, which will simply give you a `window.chordMagic` object.

This thing is also in Bower:

```bash
bower install chord-magic
```

Usage
--------

#### Overview

* [`chordMagic.parse(string [, options])`](#chordmagicparsestring--options)
* [`chordMagic.transpose(chord, halfSteps)`](#chordmagictransposechord-halfsteps)
* [`chordMagic.prettyPrint(chord [, options])`](#chordmagicprettyprintchord-options)

#### chordMagic.parse(string [, options])

Parse a string with the given `options`. Returns either a structured object describing the parsed chord, or `undefined` if the parse failed.

`options` takes only a single option, `naming`, which can be either:

- `'English'` (A-B-C-D-E-F-G)
- `'NorthernEuropean'` (A-B-H-C-C#-D-D#-E-F-F#-G)
- `'SouthernEuropean'` (Do-Re-Mi-Fa-So-La-Ti-Do, and variants like Ré and Sol).

If no naming is specified, then `'English'` is the default.

```js
// Parse in three different naming styles:
chordMagic.parse('B');
chordMagic.parse('H', {naming: 'NorthernEuropean'});
chordMagic.parse('Ti', {naming: 'SouthernEuropean'});

// These all return the same thing:
// { root: 'B', quality: 'Major' }
```

The object returned describes the chord. Some examples:

```js
chordMagic.parse('C')
// { root: 'C', quality: 'Major' }

chordMagic.parse('Cm')
// { root: 'C', quality: 'Minor' }

chordMagic.parse('Cm7')
// { root: 'C', quality: 'Minor', extended: 'Minor7' }

chordMagic.parse('Csus4')
// { root: 'C', quality: 'Major', suspended: 'Sus4' }

chordMagic.parse('Cadd9')
// { root: 'C', quality: 'Major', added: 'Add9' }

chordMagic.parse('C/G')
// { root: 'C', quality: 'Major', overridingRoot: 'G' }
```

This object has six possible fields `root`, `quality`, `extended`, `suspended`, `added`, and `overridingRoot`:

**root** *(required)*

The root note of the chord. It will be one of:

```js
[ 'A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab' ]
```

Note that this value is always in English format, regardless of the format when you parsed it. Also, flats are always expressed, never sharps (e.g. always `'Bb'`, never `'A#'`). The goal here is that you never have to do the disambiguation yourself.

**quality** *(required)*

The [chord quality](http://en.wikipedia.org/wiki/Major_and_minor). It will be one of:

```js
[ 'Major', 'Minor', 'Augmented', 'Diminished' ]
```

**extended**

If the chord is [extended](http://en.wikipedia.org/wiki/Augmentation_%28music%29), then that will be expressed here. One of:

```js
[
  'Major7',
  'Minor7',
  'Dominant7',
  'Diminished7',
  'Major9',
  'Major11',
  'Major13',
  'AugmentedDominant7',
  'AugmentedMajor7',
  'Minor9'
]
```

**suspended**

If the chord is [suspended](http://en.wikipedia.org/wiki/Nonchord_tone#Suspension), then that will be expressed here. One of:

```js
[ 'Sus4', 'Sus2' ]
```

**added**

If the chord has an [added note](http://en.wikipedia.org/wiki/Added_tone_chord), then that will be expressed here. One of:

```js
[ 'Add9', 'Add11', 'Major6', 'SixNine', 'PowerChord' ]
```

The `'PowerChord'` is also known as an `'Add5'`, but I thought it was funny to call it a `'PowerChord'`.

**overridingRoot**

If the chord has a note that overrides the root note (e.g. `'D/F#'`, where F# overrides D), then that will be expressed here. The `overridingRoot` can be any of the 12 notes listed above for the `root`.

#### chordMagic.transpose(chord, halfSteps)

Transpose the given `chord` object to a new chord by the number of `halfSteps`.

This does not modify the input `chord`. `halfSteps` can be any valid integer.

Examples:

```js
chordMagic.transpose(chordMagic.parse('Amaj7'), 1)
// { root: 'Bb', quality: 'Major', extended: 'Major7' }

chordMagic.transpose(chordMagic.parse('Amaj7'), 2)
// { root: 'B', quality: 'Major', extended: 'Major7' }

chordMagic.transpose(chordMagic.parse('Amaj7'), 3)
// { root: 'C', quality: 'Major', extended: 'Major7' }

chordMagic.transpose(chordMagic.parse('Amaj7'), 4)
// { root: 'Db', quality: 'Major', extended: 'Major7' }

chordMagic.transpose(chordMagic.parse('Amaj7'), 5)
// { root: 'D', quality: 'Major', extended: 'Major7' }

chordMagic.transpose(chordMagic.parse('Amaj7'), -1)
// { root: 'Ab', quality: 'Major', extended: 'Major7' }

chordMagic.transpose(chordMagic.parse('Amaj7'), -2)
// { root: 'G', quality: 'Major', extended: 'Major7' }

chordMagic.transpose(chordMagic.parse('Amaj7'), -3)
// { root: 'Gb', quality: 'Major', extended: 'Major7' }
```

Of course, this also elegantly handles overriding roots:

```js
chordMagic.transpose(chordMagic.parse('C/G'), 3)
// { root: 'Eb', quality: 'Major', overridingRoot: 'Bb' }
```

#### chordMagic.prettyPrint(chord, [options])

Print a `chord` object into a nice string for display.

`options` takes only a single option, `naming`, as described above (i.e. `'English'` (default), `'NorthernEuropean'`, or `'SouthernEuropean'`).

Examples:

```js
chordMagic.prettyPrint(chordMagic.parse('C'))
// 'C'
chordMagic.prettyPrint(chordMagic.parse('C'), {naming: 'SouthernEuropean'})
// 'Do'
chordMagic.prettyPrint(chordMagic.parse('C'), {naming: 'NorthernEuropean'})
// 'C'
chordMagic.prettyPrint(chordMagic.parse('Cmin'))
// 'Cm'
chordMagic.prettyPrint(chordMagic.parse('Cmin7'))
// 'Cm7'
chordMagic.prettyPrint(chordMagic.parse('C'))
// 'C'
chordMagic.prettyPrint(chordMagic.parse('Cmaj7'))
// 'Cmaj7'
```

Currently this will just choose a single representation for each note (e.g. always `'Bb'` and never `'A#'`) as well as a single common representation for every other attribute (e.g. always `'m7'`, never `'min7'`, `'minor7'`, etc.).

Build this project
-------

    $ npm run build


Test this project
-------

    $ npm run test

Or to check code coverage:

    $ npm run coverage
