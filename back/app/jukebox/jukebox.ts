import child_process = require('child_process');
import cron = require('node-cron');
import crypto = require('crypto');
import { Mongo } from '../mongo/mongo';
import { Music } from "../mongo/music";
import { environment } from '../environment';
import { Playlist } from './playlist';

export class Jukebox {
  mongo: Mongo;
  playlist: Playlist;
  childProcess: any;

  constructor() {
    this.mongo = new Mongo();
    this.playlist = new Playlist();
    process.send({code: 'playlist', playlist: this.playlist});
  }

  async refresh() {
    const newMusics: Array<Music> = [];
    const musics = await this.mongo.musics();
    while (musics.length > 0) {
      const index = Math.floor(Jukebox.secureRandom() * musics.length);
      const music = musics.splice(index, 1);
      newMusics.push(music[0]);
    }
    await this.playlist.swap(newMusics);
  }

  async startCron() {
    cron.schedule('0 */10 * * * *', async () => {
      if (!this.playlist.isPlaying) {
        await this.refresh();
        this.start();
      }
    });
    await this.refresh();
    this.start();
  }

  async start() {
    if (this.playlist.isPlaying) {
      return;
    }
    this.playlist.play();
    while (this.playlist.isPlaying) {
      if (!this.playlist.isPausing) {
        // check in schedule.
        const isInSchedule = await this.isInSchedule();
        if (!isInSchedule) {
          console.log('out of time');
          this.playlist.stop();
          break;
        }

        // head music.
        const music = await this.playlist.head();
        if (!music) {
          console.error('cannot read next music');
          this.playlist.pause();
          continue;
        }

        // create command-line for play.
        const command = environment.player.command.replace(/\<FILE\>/, music.fileName);
        await this.play(command).catch(() => {});

        // next music.
        this.playlist.next();
      } else {
        await new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 5000);
        });
      }
    }
  }

  play(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.childProcess = child_process.exec(command, (error, stdout, stderr) => {
        if (error || stderr) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  pause() {
    if (this.childProcess) {
      this.childProcess.kill();
      this.childProcess = undefined;
    }
    this.playlist.pause();
  }

  resume() {
    this.playlist.resume();
    this.start();
  }

  async isInSchedule() {
    let isPlayable = false;
    const schedule = await this.mongo.schedule();
    const now = new Date();
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

  private static secureRandom() {
    const randomBytes = crypto.randomBytes(4);
    const r = randomBytes.readUIntBE(0, 4);
    return r / 4294967295;
  }

  async onReceive(message: any) {
    switch (message.code) {
      case 'append':
        const created = await this.mongo.music(message.musicId);
        this.playlist.append(created);
        break;
      case 'update':
        const updated = await this.mongo.music(message.musicId);
        this.playlist.update(updated);
        break;
      case 'delete':
        this.playlist.remove(message.musicId);
        break;
      case 'pause':
        this.pause();
        break;
      case 'resume':
        this.resume();
        break;
    }
  }
}
