import * as youtubedl from '@microlink/youtube-dl';
import moment = require('moment');
import { environment } from '../environment';
import { Music } from './music';

export class Youtube {
  constructor() {
  }

  static download(url: string, title?: string, artist?: string): Promise<Music> {
    return new Promise<Music>((resolve, reject) => {
      youtubedl.getInfo(url, (error, info) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          const fileName = Youtube.fileName();
          // need ffprobe/avprobe and ffppeg/avconf
          youtubedl.exec(url, ['-x', '--audio-format', 'mp3', '-o', fileName], {}, (error, output) => {
            if (error) {
              console.error(error);
              reject(error);
            } else {
              const music = new Music(
                url,
                info.id,
                title ? title : info.title,
                artist ? artist : 'NO NAME',
                info.duration,
                fileName);
              resolve(music);
            }
          });
        }
      });  
    });
  }

  static fileName(): string {
    return environment.youtube.mp3Path + moment(new Date()).format('YYYYMMDDHHmmss') + '.mp3';
  }
}
