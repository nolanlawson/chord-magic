const English = {}
English['A'] = ['A']
English['Bb'] = ['Bb', 'A#', 'Asharp', 'Bflat']
English['B'] = ['B']
English['C'] = ['C']
English['Db'] = ['Db', 'C#', 'Dflat', 'Csharp']
English['D'] = ['D']
English['Eb'] = ['Eb', 'D#', 'Eflat', 'Dsharp']
English['E'] = ['E']
English['F'] = ['F']
English['Gb'] = ['Gb', 'F#', 'Gflat', 'Gsharp']
English['G'] = ['G']
English['Ab'] = ['Ab', 'G#', 'Aflat', 'Gsharp']

const NorthernEuropean = {}
NorthernEuropean['A'] = ['A']
NorthernEuropean['Bb'] = ['B', 'A#', 'Asharp']
NorthernEuropean['B'] = ['H']
NorthernEuropean['C'] = ['C']
NorthernEuropean['Db'] = ['Db', 'C#', 'Dflat', 'Csharp']
NorthernEuropean['D'] = ['D']
NorthernEuropean['Eb'] = ['Eb', 'D#', 'Eflat', 'Dsharp']
NorthernEuropean['E'] = ['E']
NorthernEuropean['F'] = ['F']
NorthernEuropean['Gb'] = ['Gb', 'F#', 'Gflat', 'Gsharp']
NorthernEuropean['G'] = ['G']
NorthernEuropean['Ab'] = ['Ab', 'G#', 'Aflat', 'Gsharp']

const SouthernEuropean = {}
SouthernEuropean['A'] = ['La']
SouthernEuropean['Bb'] = ['Tib', 'La#']
SouthernEuropean['B'] = ['Ti']
SouthernEuropean['C'] = ['Do']
SouthernEuropean['Db'] = ['Reb', 'Réb', 'Do#']
SouthernEuropean['D'] = ['Re', 'Ré']
SouthernEuropean['Eb'] = ['Mib', 'Re#']
SouthernEuropean['E'] = ['Mi']
SouthernEuropean['F'] = ['Fa']
SouthernEuropean['Gb'] = ['Solb', 'Sob', 'Fa#']
SouthernEuropean['G'] = ['Sol', 'So']
SouthernEuropean['Ab'] = ['Lab', 'So#', 'Sol#']

export const noteNamings = {
  English: English,
  NorthernEuropean: NorthernEuropean,
  SouthernEuropean: SouthernEuropean
}
