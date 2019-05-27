import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Music } from './datas/music';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }

  getMusics(): Promise<Array<Music>> {
    return new Promise((resolve, reject) => {
      const url = environment.back.url + '/musics';
      this.http.get(url).toPromise().then((musics: Array<Music>) => {
        resolve(musics);
      }).catch(error => {
        reject(error);
      });
    });
  }

  postMusics(urlOfYoutube: string, title?: string, artist?: string): Promise<Music> {
    return new Promise((resolve, reject) => {
      const url = environment.back.url + '/musics';
      const body = {
        url: urlOfYoutube,
        title: title,
        artist: artist
      };
      this.http.post(url, body).toPromise().then((music: Music) => {
        resolve(music);
      }).catch(error => {
        reject(error);
      });
    });
  }

  putMusics(music: Music): Promise<null> {
    return new Promise((resolve, reject) => {
      const url = environment.back.url + '/musics/' + music._id;
      const body = {
        title: music.title,
        artist: music.artist
      };
      this.http.put(url, body).toPromise().then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  }

  deleteMusics(music: Music): Promise<null> {
    return new Promise((resolve, reject) => {
      const url = environment.back.url + '/musics/' + music._id;
      this.http.delete(url).toPromise().then(() => {
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  }

  getPlaylist(): Promise<Array<Music>> {
    return new Promise((resolve, reject) => {
      const url = environment.back.url + '/playlist';
      this.http.get(url).toPromise().then((musics: Array<Music>) => {
        resolve(musics);
      }).catch(error => {
        reject(error);
      });
    });
  }
}
