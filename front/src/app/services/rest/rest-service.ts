import { Injectable } from '@angular/core';
import { Music } from './datas/music';
import { Schedule } from './datas/schedule';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private baseUrl = environment.back.url;
  // constructor(private http: HttpClient) {}

  /**
   * GET /musics
   * @returns Music[]
   */
  async getMusics(): Promise<Music[]> {
    const response = await fetch(`${this.baseUrl}/musics`);
    if (!response.ok) throw new Error('Failed to fetch musics');
    return response.json();
  }

  /**
   * POST /musics
   * @param urlOfYoutube YouTubeのURL
   * @param title 関連付けるタイトル
   * @param artist 関連付けるアーティスト名
   * @returns Music
   */
  async postMusics(urlOfYoutube: string, title?: string, artist?: string): Promise<Music> {
    const response = await fetch(`${this.baseUrl}/musics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlOfYoutube, title, artist }),
    });
    if (!response.ok) throw new Error('Failed to post music');
    return response.json();
  }

  /**
   * PUT /musics/{id}
   * @param music Music
   * @returns null
   */
  async putMusics(music: Music): Promise<null> {
    const response = await fetch(`${this.baseUrl}/musics/${music._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: music.title, artist: music.artist }),
    });
    if (!response.ok) throw new Error('Failed to update music');
    return null;
  }

  /**
   * PATCH /musics/{id}/enable
   * @param music Music
   * @param enable 有効／無効
   * @returns null
   */
  async patchMusics(music: Music, enable: boolean): Promise<null> {
    const response = await fetch(`${this.baseUrl}/musics/${music._id}/enable`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enable }),
    });
    if (!response.ok) {
      music.enable = !enable;
      throw new Error('Failed to update music');
    }
    return null;
  }

  /**
   * DELETE /musics/{id}
   * @param music Music
   * @returns null
   */
  async deleteMusics(music: Music): Promise<null> {
    const response = await fetch(`${this.baseUrl}/musics/${music._id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete music');
    return null;
  }

  /**
   * GET /playlist
   * @returns Music[]
   */
  async getPlaylist(): Promise<Music[]> {
    const response = await fetch(`${this.baseUrl}/playlist`);
    if (!response.ok) throw new Error('Failed to fetch playlist');
    return response.json();
  }

  /**
   * GET /schedule
   * @returns Schedule
   */
  async getSchedule(): Promise<Schedule> {
    const response = await fetch(`${this.baseUrl}/schedule`);
    if (!response.ok) throw new Error('Failed to fetch schedule');
    return response.json();
  }

  /**
   * PUT /schedule
   * @param schedule Schedule
   * @returns Schedule
   */
  async putSchedule(schedule: Schedule): Promise<Schedule> {
    const response = await fetch(`${this.baseUrl}/schedule`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schedule),
    });
    if (!response.ok) throw new Error('Failed to update schedule');
    return response.json();
  }

  /**
   * GET /pause
   * @returns 再生停止状態
   */
  async getPause(): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/pause`);
    if (!response.ok) throw new Error('Failed to fetch pause status');
    const data = await response.json();
    return data.pause;
  }

  /**
   * PUT /pause
   * @param pause 再生停止状態
   * @returns null
   */
  async putPause(pause: boolean): Promise<null> {
    const response = await fetch(`${this.baseUrl}/pause`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pause }),
    });
    if (!response.ok) throw new Error('Failed to update pause status');
    return null;
  }
}
