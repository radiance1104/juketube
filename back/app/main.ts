import cluster = require('cluster');
import { Rest } from './rest/rest';
import { Jukebox } from './jukebox/jukebox';

/*
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
*/
const JUKEBOX_PROCESS_ID = 1;
const REST_PROCESS_ID = 2;

if (cluster.isMaster) {
  const jukeboxWorker = cluster.fork();
  const restWorker = cluster.fork();
  Object.keys(cluster.workers).forEach(id => {
    cluster.workers[id].on('message', message => {
      if (id === JUKEBOX_PROCESS_ID.toString()) {
        restWorker.send(message);
      } else if (id === REST_PROCESS_ID.toString()) {
        jukeboxWorker.send(message);
      }
    });
  });
} else if (cluster.isWorker) {
  let jukebox;
  let rest;
  if (cluster.worker.id === JUKEBOX_PROCESS_ID) {
    // start jukebox
    jukebox = new Jukebox();
    jukebox.startCron();
  } else if (cluster.worker.id === REST_PROCESS_ID) {
    // start rest api server
    rest = new Rest();
    rest.start();
  }

  process.on('message', async message => {
    if (cluster.worker.id === JUKEBOX_PROCESS_ID) {
      jukebox.onReceive(message);
    } else if (cluster.worker.id === REST_PROCESS_ID) {
      rest.onReceive(message);
    }
  });
}
