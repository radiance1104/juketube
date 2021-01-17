export class Music {
  _id: string;
  url: string;
  youtubeId: string;
  title: string;
  artist: string;
  duration: number;
  fileName: string;
  enable: boolean;

  constructor(url: string, youtubeId: string, title: string,
      artist: string, duration: number, fileName: string,
      enable: boolean) {
    this.url = url;
    this.youtubeId = youtubeId;
    this.title = title;
    this.artist = artist;
    this.fileName = fileName;
    this.duration = duration;
    this.enable = enable;
  }
}
