import { youtubeDl } from 'youtube-dl-exec';
import moment = require('moment');
import fs = require('fs');
// import child_process = require('child_process');
import { spawn } from 'child_process';
import { exec } from 'node:child_process';
// import { promisify } from 'node:util';
import { environment } from '../environment';
import { YoutubeInfo } from './youtube-info';

// const execAsync = promisify(exec);

export class Youtube {
  constructor() {
  }

  static async download(url: string, title?: string, artist?: string): Promise<YoutubeInfo> {
    const fileName = Youtube.fileName();
    const tmpName = Youtube.tmpName();
    const downloadName = environment.normalization.enable ? tmpName : fileName;

    try {
      // 動画情報を取得
      const info = await youtubeDl(url, {
        dumpSingleJson: true,
        noCheckCertificates: true,
        quiet: true,
      });

      // 動画をダウンロード
      await youtubeDl(url, {
        extractAudio: true,
        audioFormat: 'mp3',
        audioQuality: 0,
        ffmpegLocation: environment.youtube.ffmpegLocation,
        output: downloadName,
        noCheckCertificates: true,
        quiet: true,
      });

      // ダウンロードしたファイルを標準化
      if (environment.normalization.enable) {
        await Youtube.normalize(tmpName, fileName);
        await Youtube.removeTmpFile(tmpName);
      }

      // YoutubeInfoオブジェクトを生成し返す
      const youtubeInfo = new YoutubeInfo(
        url,
        info['id'],
        title ? title : info['title'],
        artist ? artist : 'NO NAME',
        `${info['duration']}`,
        fileName
      );
      return youtubeInfo;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * MP3のファイル名
   * @returns ファイル名
   */
  static fileName(): string {
    return environment.youtube.mp3Path + moment(new Date()).format('YYYYMMDDHHmmss') + '.mp3';
  }

  /**
   * 一時ファイルのファイル名
   * @returns ファイル名
   */
  static tmpName(): string {
    return environment.youtube.mp3Path + 'tmp' + moment(new Date()).format('YYYYMMDDHHmmss') + '.mp3';
  }

  /**
   * ファイル削除
   * @param fileName ファイル名
   */
  static remove(fileName: string) {
    fs.unlinkSync(fileName);
  }

  /**
   * sourceのmp3を標準化（音量の均一化）をし、destinationに保存する
   * @param source 標準化するファイル
   * @param destination 標準化後のファイル
   */
  static normalize(source: string, destination: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = environment.normalization.command
        .replace(/\<IN\>/, source)
        .replace(/\<OUT\>/, destination);

      const ffmpeg = spawn(command, { shell: true });
      ffmpeg.stdout.on('data', (data) => {
        // console.log(data.toString());
      });
      ffmpeg.stderr.on('data', (data) => {
        console.error(data.toString());
      });
      ffmpeg.on('close', (code) => {
        if (code == 0) {
          resolve();
        } else {
          reject(code);
        }
      });
    });
  }

  /**
   * 一時ファイルを削除する
   * @param fileName ファイル名
   */
  static async removeTmpFile(fileName: string): Promise<void> {
    const command = 'rm ' + fileName;
    try {
      const { stderr } = await exec(command);
    } catch (error) {
      throw error;
    }
  }
}
