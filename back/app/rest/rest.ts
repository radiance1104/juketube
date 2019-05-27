import * as core from "express-serve-static-core";
import * as http from "http";
import express = require('express');
import bodyParser = require('body-parser');
import { environment } from '../environment';
import { Youtube } from '../youtube/youtube';
import { YoutubeInfo} from '../youtube/youtube-info'
import { Mongo } from '../mongo/mongo';
import { Music } from "../mongo/music";
import { Jukebox } from "../jukebox/jukebox";

export class Rest {
  app: core.Express;
  server: http.Server;
  mongo: Mongo;
  jukebox: Jukebox;
  constructor(jukebox: Jukebox) {
    this.jukebox = jukebox;
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
        await this.mongo.start();
        const musics = await this.mongo.musics();
        await this.mongo.stop();
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
            await this.mongo.start();
            const inserted = await this.mongo.insertMusic(music);
            await this.mongo.stop();
            music._id = inserted.insertedId;
            this.jukebox.appendMusicToPlaylist(music);
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
          await this.mongo.start();
          const updated = await this.mongo.updateMusic(request.params.id, newMusic);
          const music = await this.mongo.music(request.params.id);
          await this.mongo.stop();
          this.jukebox.updateMusicInPlaylist(music);
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
          if (this.jukebox.removeMusicFromPlaylist(request.params.id)) {
            await this.mongo.start();
            // DBから削除する
            const found = await this.mongo.music(request.params.id);
            if (found) {
              const deleted = await this.mongo.deleteMusic(request.params.id);
              // ファイルを削除する
              Youtube.remove(found.fileName);
              response.send();
            } else {
              // NOT FOUND
              response.sendStatus(404);
            }
            await this.mongo.stop();
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
        response.send(this.jukebox.playlist);
      } catch (error) {
        // INTERNAL SERVER ERROR
        response.sendStatus(500);
      }
    });

    app.put('/jukebox/:status', (request, response, next) => {
      try {
        if (request.params.status === 'pause') {
          this.jukebox.pause();
          response.send();
        } else if (request.params.status === 'resume') {
          this.jukebox.resume();
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
}
