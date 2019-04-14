export class Music {
  url: string;
  youtubeId: string;
  title: string;
  artist: string;
  duration: number;
  fileName: string;

  constructor(url: string, youtubeId: string, title: string,
      artist: string, duration: string, fileName: string) {
    this.url = url;
    this.youtubeId = youtubeId;
    this.title = title;
    this.artist = artist;
    this.fileName = fileName;
    this.duration = 0;
    const times = duration.split(':');
    for (const time of times) {
      this.duration *= 60;
      this.duration += Number(time);
    }
  }
}
