import * as youtubedl from '@microlink/youtube-dl';
import moment = require('moment');
import fs = require('fs');
import { environment } from '../environment';
import { YoutubeInfo } from './youtube-info';

export class Youtube {
  constructor() {
  }

  // ダウンロード
  static download(url: string, title?: string, artist?: string): Promise<YoutubeInfo> {
    return new Promise<YoutubeInfo>((resolve, reject) => {
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
              const music = new YoutubeInfo(
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

  // ファイル名生成
  static fileName(): string {
    return environment.youtube.mp3Path + moment(new Date()).format('YYYYMMDDHHmmss') + '.mp3';
  }

  // ファイル削除
  static remove(fileName: string) {
    fs.unlinkSync(fileName);
  }
}
