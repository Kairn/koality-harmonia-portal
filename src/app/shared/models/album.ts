import { Genre } from './genre';
import { Koalibee } from './koalibee';
import { Track } from './track';
import { Review } from './review';

export class Album {

  albumId: number;
  albumName: string;
  artist: string;
  artwork: Int8Array;
  artworkType: string;
  etaPrice: number;
  isPromoted: string;
  isPublished: string;
  genre: Genre;
  koalibee: Koalibee;
  trackList: Track[];
  reviewList: Review[];
  artworkDataUrl: string;

  constructor(
    albumName: string,
    artist: string,
    genreId: number,
    genreName: string
  ) {
    this.albumName = albumName;
    this.artist = artist;
    this.genre = new Genre(genreId, genreName);
  }

}
