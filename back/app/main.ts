// import cluster from 'node:cluster';
import { Rest } from './rest/rest';
import { Jukebox } from './jukebox/jukebox';

const cluster = require('node:cluster');

const JUKEBOX_PROCESS_ID = 1;
const REST_PROCESS_ID = 2;

if (cluster.isPrimary) {
  console.log('Master process starting...');

  // ワーカー生成
  const jukeboxWorker = cluster.fork();
  const restWorker = cluster.fork();

  // ワーカー間メッセージ中継
  jukeboxWorker.on('message', (message: any) => {
    restWorker?.send(message);
  });
  restWorker.on('message', (message: any) => {
    jukeboxWorker?.send(message);
  });

  // clusterが終了した際(send exitはしていない)
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.id} exited (code=${code}, signal=${signal})`);
  });

} else {
  // Worker プロセス
  if (cluster.worker.id === JUKEBOX_PROCESS_ID) {
    // JukeBoxを起動する
    const jukebox = new Jukebox();
    jukebox.startCron();

    process.on('message', (message: any) => {
      jukebox.onReceive(message);
    });
  } else if (cluster.worker.id === REST_PROCESS_ID) {
    // REST APIサーバを起動する
    const rest = new Rest();
    rest.start();

    process.on('message', (message: any) => {
      rest.onReceive(message);
    });
  }
}
