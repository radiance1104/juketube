import {Youtube} from './youtube/youtube';

class Main {
  constructor() {
  }

  start() {
    const url = 'https://www.youtube.com/watch?v=-3UBfHCF_3s';
    Youtube.download(url);
  }
}

const main = new Main();
main.start();
