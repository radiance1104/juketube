import * as core from "express-serve-static-core";
import * as http from "http";
import express = require('express');
import bodyParser = require('body-parser');
import { environment } from '../environment';
import { Youtube } from '../youtube/youtube';
import { YoutubeInfo} from '../youtube/youtube-info'
import { Mongo } from '../mongo/mongo';
import { Music } from "../mongo/music";

export class Rest {
  app: core.Express;
  server: http.Server;
  mongo: Mongo;
  playlist: any;
  constructor() {
    this.mongo = new Mongo();
  }

  start() {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    this.server = app.listen(environment.restServer.port, () => {
      console.info('listening to PORT: ' + environment.restServer.port);
    });

    app.use((request, response, next) => {
      response.header('Access-Control-Allow-Origin', '*');
      response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      next();
    });

    app.get('/musics', async (request, response, next) => {
      try {
        const musics = await this.mongo.musics();
        response.send(musics);
      } catch (error) {
        // INTERNAL SERVER ERROR
        response.sendStatus(500);
      }
    });

    app.post('/musics', (request, response, next) => {
      try {
        if (request.body.url) {
          Youtube.download(request.body.url, request.body.title, request.body.artist).then(async (info: YoutubeInfo) => {
            const music = new Music(
              info.url,
              info.youtubeId,
              request.body.title ? request.body.title : info.title,
              request.body.artist ? request.body.artist : info.artist,
              info.duration,
              info.fileName);
            const inserted = await this.mongo.insertMusic(music);
            music._id = inserted.insertedId;
            process.send({code: 'append', musicId: music._id});
            response.send(music);
          }).catch(error => {
            // INTERNAL SERVER ERROR
            response.sendStatus(500);
          });
        } else {
          // BAD REQUEST
          response.sendStatus(400);
        }
      } catch (error) {
        // INTERNAL SERVER ERROR
        response.sendStatus(500);
      }
    });

    app.put('/musics/:id', async (request, response, next) => {
      try {
        if (request.params.id && (request.body.title || request.body.artist)) {
          const newMusic = {};
          if (request.body.title) {
            newMusic['title'] = request.body.title;
          }
          if (request.body.artist) {
            newMusic['artist'] = request.body.artist;
          }
          const updated = await this.mongo.updateMusic(request.params.id, newMusic);
          const music = await this.mongo.music(request.params.id);
          process.send({code: 'update', musicId: request.params.id});
          response.send(music);
        } else {
          // BAD REQUEST
          response.sendStatus(400);
        }
      } catch (error) {
        // INTERNAL SERVER ERROR
        response.sendStatus(500);
      }
    });

    app.delete('/musics/:id', async (request, response, next) => {
      try {
        if (request.params.id) {
          let isRemovable = false;
          if (this.playlist.musics.length > 0) {
            this.playlist.musics.forEach((music, index) => {
              if (music._id.toString() === request.params.id) {
                if (index > 0 || !this.playlist.isPlaying || this.playlist.isPausing) {
                  isRemovable = true;
                }
              }
            });
          }
          if (isRemovable) {
            // DBから削除する
            const found = await this.mongo.music(request.params.id);
            if (found) {
              const deleted = await this.mongo.deleteMusic(request.params.id);
              // ファイルを削除する
              Youtube.remove(found.fileName);
              process.send({code: 'delete', musicId: request.params.id});
              response.send();
            } else {
              // NOT FOUND
              response.sendStatus(404);
            }
          } else {
            // CONFLICT
            response.sendStatus(409);
          }
        } else {
          // BAD REQUEST
          response.sendStatus(400);
        }
      } catch (error) {
        // INTERNAL SERVER ERROR
        response.sendStatus(500);
      }
    });

    app.get('/playlist', (request, response, next) => {
      try {
        response.send(this.playlist.musics);
      } catch (error) {
        // INTERNAL SERVER ERROR
        response.sendStatus(500);
      }
    });

    app.get('/schedule', async (request, response, next) => {
      try {
        const schedule = await this.mongo.schedule();
        response.send(schedule);
      } catch (error) {
        // INTERNAL SERVER ERROR
        response.sendStatus(500);
      }
    });

    app.put('/schedule', async (request, response, next) => {
      try {
        if (request.body && request.body.start && request.body.end && request.body.weeks) {
          const start = request.body.start;
          const end = request.body.end;
          const weeks = request.body.weeks;
          const schedule = {
            start: { hour: start.hour, minute: start.minute },
            end: { hour: end.hour, minute: end.minute },
            weeks: {
              monday: weeks.monday,
              tuesday: weeks.tuesday,
              wednesday: weeks.wednesday,
              thursday: weeks.thursday,
              friday: weeks.friday,
              saturday: weeks.saturday,
              sunday: weeks.sunday
            }
          };
          await this.mongo.updateSchedule(schedule);
          response.send();
        } else {
          // BAD REQUEST
          response.sendStatus(400);
        }
      } catch (error) {
        // INTERNAL SERVER ERROR
        response.sendStatus(500);
      }
    });

    app.get('/pause', (request, response, next) => {
      try {
        response.send({
          pause: this.playlist.isPausing
        });
      } catch (error) {
        // INTERNAL SERVER ERROR
        response.sendStatus(500);
      }
    });

    app.put('/pause', (request, response, next) => {
      try {
        if (request.body.pause === true) {
          process.send({code: 'pause'});
          response.send();
        } else if (request.body.pause === false) {
          process.send({code: 'resume'});
          response.send();
        } else {
          // BAD REQUEST
          response.sendStatus(400);
        }
      } catch (error) {
        // INTERNAL SERVER ERROR
        response.sendStatus(500);
      }
    });
  }

  stop() {
    this.server.close();
  }

  // プロセス間メッセージ受信
  onReceive(message: any) {
    switch (message.code) {
      case 'playlist':
        this.playlist = message.playlist;
        break;
    }
  }
}
