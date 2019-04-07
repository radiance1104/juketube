import { Environment } from '../environment';

export class Bgm {
  id: string;
  title: string;
  duration: number;

  constructor(id: string, title: string, duration: string) {
    this.id = id;
    this.title = title;
    this.duration = 0;
    const times = duration.split(':');
    for (const time of times) {
      this.duration *= 60;
      this.duration += Number(time);
    }
    console.log(this.duration);
  }

  filename(): string {
    return Environment.bgmPath + this.id + '.mp3';
  }
}
