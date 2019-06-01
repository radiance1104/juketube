import * as youtubedl from '@microlink/youtube-dl';
import moment = require('moment');
import fs = require('fs');
import child_process = require('child_process');
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
          const tmpName = Youtube.tmpName();
          // need ffprobe/avprobe and ffppeg/avconf
          const downloadName = environment.normalization.enable ? tmpName : fileName;
          youtubedl.exec(url, ['-x', '--audio-format', 'mp3', '-o', downloadName], {}, async (error, output) => {
            if (error) {
              console.error(error);
              reject(error);
            } else {
              if (environment.normalization.enable) {
                const rename = Youtube.fileName();
                await Youtube.normalize(tmpName, fileName);
                await Youtube.erazeTmpFile(tmpName);
              }

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

  static fileName(): string {
    return environment.youtube.mp3Path + moment(new Date()).format('YYYYMMDDHHmmss') + '.mp3';
  }

  static tmpName(): string {
    return environment.youtube.mp3Path + 'tmp' + moment(new Date()).format('YYYYMMDDHHmmss') + '.mp3';
  }

  static remove(fileName: string) {
    fs.unlinkSync(fileName);
  }

  static normalize(source: string, destination: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const command = environment.normalization.command.replace(/\<IN\>/, source)
                                                       .replace(/\<OUT\>/, destination);
      child_process.exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  static erazeTmpFile(fileName: string) {
    return new Promise((resolve, reject) => {
      const command = 'rm ' + fileName;
      child_process.exec(command, (error, stdout, stderr) => {
        resolve();
      });
    });
  }
}
