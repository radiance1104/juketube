import { Rest } from './rest/rest';
import { Jukebox } from './jukebox/jukebox';

class Main {
  constructor() {
  }

  async start() {
    // start jukebox
    const jukebox = new Jukebox();
    await jukebox.refresh();
    jukebox.startCron();

    // start rest api server
    const rest = new Rest(jukebox);
    rest.start();
  }
}

const main = new Main();
main.start();
