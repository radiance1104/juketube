import * as core from "express-serve-static-core";
import * as http from "http";
import express = require('express');
import bodyParser = require('body-parser');
import { environment } from '../environment';
import { Youtube } from '../youtube/youtube';

export class Rest {
  app: core.Express;
  server: http.Server;
  constructor() {
  }

  start() {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    this.server = app.listen(environment.restServer.port, () => {
      console.info('listening to PORT: ' + environment.restServer.port);
    });

    app.get('/musics', (request, response, next) => {
      response.send();
    });

    app.post('/musics', (request, response, next) => {
      // 'https://www.youtube.com/watch?v=-3UBfHCF_3s';
      if (request.body.url) {
        Youtube.download(request.body.url, request.body.title, request.body.artist)
          .then(music => {
          response.send(music);
        }).catch(error => {
          response.sendStatus(500);
        });
      } else {
        // BAD REQUEST
        response.sendStatus(400);
      }
    });

    app.put('/musics/:id', (request, response, next) => {
      response.send();
    });

    app.delete('/musics/:id', (request, response, next) => {
      response.send();
    });

    app.get('/playlist', (request, response, next) => {
      response.send();
    });
  }

  stop() {
    this.server.close();
  }
}
