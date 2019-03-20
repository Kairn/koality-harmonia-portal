import { Album } from './album';

export class Track {

  trackId: number;
  trackName: string;
  composer: string;
  trackLength: number;
  audio: Int8Array;
  audioType: string;
  isDemo: string;
  album: Album;
  audioDataUrl: string;

}
