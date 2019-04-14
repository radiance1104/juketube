import { Rest } from './rest/rest';

class Main {
  constructor() {
  }

  start() {
    const rest = new Rest();
    rest.start();
  }
}

const main = new Main();
main.start();
