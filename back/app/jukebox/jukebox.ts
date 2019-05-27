import child_process = require('child_process');
import cron = require('node-cron');
import { Mongo } from '../mongo/mongo';
import { Music } from "../mongo/music";
import { environment } from '../environment';

export class Jukebox {
  mongo: Mongo;
  playlist: Array<Music> = [];
  isPlaying = false;
  isPause = false;

  constructor() {
    this.mongo = new Mongo();
  }

  async refresh() {
    const newMusics: Array<Music> = [];
    await this.mongo.start();
    const musics = await this.mongo.musics();
    await this.mongo.stop();
    while (musics.length > 0) {
      const index = Math.floor(Math.random() * musics.length);
      const music = musics.splice(index, 1);
      newMusics.push(music[0]);
    }
    this.playlist = newMusics;
  }

  musicToPlayNext(): Music {
    let music = undefined;
    if (this.playlist && this.playlist.length > 0) {
      music = this.playlist.splice(0, 1)[0];
      this.playlist.push(music);
    }
    return music;
  }

  appendMusicToPlaylist(music: Music) {
    this.playlist.push(music);
  }

  removeMusicFromPlaylist(musicId: string) {
    let isRemoved = false;
    if (this.playlist.length > 0) {
      this.playlist.forEach((music, index) => {
        if (music._id.toString() === musicId) {
          if (index > 0 || !this.isPlaying || this.isPause) {
            isRemoved = true;
            this.playlist.splice(index, 1);
          }
        }
      });
    }
    return isRemoved;
  }

  updateMusicInPlaylist(music: Music) {
    const found = this.playlist.find(finding => {
      return finding._id.toString() === music._id.toString();
    })
    if (found) {
      found.title = music.title;
      found.artist = music.artist;
    }
  }

  startCron() {
    cron.schedule('0 */10 * * * *', () => {
      if (!this.isPause) {
        this.start();
      }
    });
    this.start();
  }

  async start() {
    if (this.isPlaying) {
      return;
    }
    this.isPlaying = true;
    while (this.isPlaying && !this.isPause) {

      const isPlayable = await this.isPlayable();
      if (!isPlayable) {
        this.isPlaying = false;
        break;
      }

      const music = this.musicToPlayNext();
      if (!music) {
        this.isPlaying = false;
        break;
      }

      const command = environment.player.command.replace(/\<FILE\>/, music.fileName);
      await this.play(command).catch(error => {
        console.error(error);
        this.isPlaying = false;
      });
    }
  }

  play(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      child_process.exec(command, (error, stdout, stderr) => {
        if (error || stderr) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  pause() {
    this.isPause = true;
  }

  resume() {
    this.isPause = false;
    this.start();
  }

  async isPlayable() {
    let isPlayable = false;
    await this.mongo.start();
    const schedule = await this.mongo.schedule();
    await this.mongo.stop();
    const now = new Date();
    // week
    if ((now.getDay() == 0 && schedule.weeks.sunday)
        || (now.getDay() == 1 && schedule.weeks.monday)
        || (now.getDay() == 2 && schedule.weeks.tuesday)
        || (now.getDay() == 3 && schedule.weeks.wednesday)
        || (now.getDay() == 4 && schedule.weeks.thursday)
        || (now.getDay() == 5 && schedule.weeks.friday)
        || (now.getDay() == 6 && schedule.weeks.saturday)) {
      const start = schedule.start.hour * 60 + schedule.start.minute;
      const end = schedule.end.hour * 60 + schedule.end.minute;
      const time = now.getHours() * 60 + now.getMinutes();
      if (time >= start && time <= end) {
        isPlayable = true;
      }
    }
    return isPlayable;
  }
}
