import * as youtubedl from '@microlink/youtube-dl';
import { Bgm } from '../rest/bgm';

export class Youtube {
  constructor() {
  }

  static download(url: string) {
    youtubedl.getInfo(url, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        const bgm = new Bgm(info.id, info.title, info.duration);
        // need ffprobe/avprobe and ffppeg/avconf
        const filename = bgm.filename();
        youtubedl.exec(url, ['-x', '--audio-format', 'mp3', '-o', filename], {}, (error, output) => {
          if (error) {
            console.error(error);
          } else {

          }
        });
      }
    });
  }
}
