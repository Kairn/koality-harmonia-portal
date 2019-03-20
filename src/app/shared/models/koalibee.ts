import { Credentials } from './credentials';
import { Album } from './album';

export class Koalibee {

  koalibeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  etaBalance: number;
  avatar: Int8Array;
  avatarType: string;
  credentials: Credentials;
  albumList: Album[];
  avatarDataUrl: string;

}
