import { Album } from './album';
import { Koalibee } from './koalibee';

export class Review {

  reviewId: number;
  rating: number;
  reviewComment: string;
  album: Album;
  koalibee: Koalibee;
  albumName: string;
  koalibeeName: string;

}
