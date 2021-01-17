import { Music } from '../mongo/music';

export class Playlist {
  musics: Array<Music> = [];
  isPlaying = false;
  isPausing = true;

  swap(musics: Array<Music>) {
    this.musics = musics;
    this.notify();
  }

  next() {
    if (this.musics && this.musics.length > 0) {
      let enable = false;
      const found = this.musics.find(music => {
        return music.enable;
      });
      if (found) {
        while (!enable) {
          const music = this.musics.splice(0, 1)[0];
          this.musics.push(music);
          enable = this.musics[0].enable;
        }
      }
      this.notify();
    }
  }

  head(): Music {
    let music = undefined;
    if (this.musics && this.musics.length > 0) {
      if (!this.musics[0].enable) {
        this.next();
      }
      music = this.musics[0];
    }
    return music.enable ? music : null;
  }

  append(music: Music) {
    this.musics.push(music);
    this.notify();
  }

  update(music: Music) {
    const found = this.musics.find(find => {
      return find._id.toString() === music._id.toString();
    });
    found.title = music.title;
    found.artist = music.artist;
    found.enable = music.enable;
    this.notify();
  }

  remove(musicId: string) {
    let isRemoved = false;
    if (this.musics.length > 0) {
      this.musics.forEach((music, index) => {
        if (music._id.toString() === musicId) {
          isRemoved = true;
          this.musics.splice(index, 1);
        }
      });
    }
    this.notify();
    return isRemoved;
  }

  play() {
    this.isPlaying = true;
    this.notify();
  }

  stop() {
    this.isPlaying = false;
    this.notify();
  }

  pause() {
    this.isPausing = true;
    this.notify();
  }

  resume() {
    this.isPausing = false;
    this.notify();
  }

  private notify() {
    process.send({code: 'playlist', playlist: this});
  }
}
