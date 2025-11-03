export class Music {
  _id: string;
  url: string;
  youtubeId: string;
  title: string;
  artist: string;
  duration: number;
  fileName: string;
  enable: boolean;

  constructor(
    _id: string,
    url: string,
    youtubeId: string,
    title: string,
    artist: string,
    duration: number,
    fileName: string,
    enable: boolean
  ) {
    this._id = _id;
    this.url = url;
    this.youtubeId = youtubeId;
    this.title = title;
    this.artist = artist;
    this.duration = duration;
    this.fileName = fileName;
    this.enable = enable;
  }
}
