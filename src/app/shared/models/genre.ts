export class Genre {

  static generEnumeration = [
    'Classical',
    'Musical theatre',
    'Jazz',
    'Rock',
    'Popular',
    'Rapping',
    'Hip hop',
    'Blues',
    'Game soundtrack',
    'Country',
    'Folk',
    'Heavy metal',
    'Disco',
    'Dance',
    'Ambient',
    'Techno'
  ];

  genreId: number;
  genreName: string;

  constructor(genreId: number, generName: string) {
    this.genreId = genreId;
    this.genreName = generName;
  }

}
