import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { RestService } from '../../services/rest/rest-service';
import { LoadingService } from '../../services/loading/loading-service';
import { DialogService } from '../../services/dialog/dialog-service';
import { ScheduleDialogService } from '../../services/schedule-dialog/schedule-dialog-service';
import { Music } from '../../services/rest/datas/music';

@Component({
  selector: 'app-main-component',
  imports: [CommonModule, FormsModule, TimeFormatPipe],
  templateUrl: './main-component.html',
  styleUrl: './main-component.scss',
})
export class MainComponent implements OnInit {
  protected readonly restService = inject(RestService);
  protected readonly loadingService = inject(LoadingService);
  protected readonly dialogService = inject(DialogService);
  protected readonly scheduleDialogService = inject(ScheduleDialogService);

  musics = signal<Music[]>([]);
  url = signal<string>('');
  title = signal<string>('');
  artist = signal<string>('');
  isAscend = signal<boolean>(true);
  isSortedByTitle = signal<boolean>(false);
  isSortedByArtist = signal<boolean>(false);
  isSortedByPlaylist = signal<boolean>(false);
  editingMusicId = signal<string | undefined>(undefined);
  isPause = signal<boolean>(false);
  isDisplayAdd = signal<boolean>(false);

  get urlValue() { return this.url(); }
  set urlValue(val: string) { this.url.set(val); }
  get titleValue() { return this.title(); }
  set titleValue(val: string) { this.title.set(val); }
  get artistValue() { return this.artist(); }
  set artistValue(val: string) { this.artist.set(val); }

  async ngOnInit() {
    await this.refresh();

    setInterval(async () => {
      try {
        // 再生停止状態を取得
        const pause = await this.restService.getPause();
        this.isPause.set(pause);
      } catch (error) {
      }
    }, 5000);
  }

  /**
   * 画面を更新する
   */
  private async refresh() {
    this.loadingService.show();
    // Music一覧を取得
    try {
      const musics = await this.restService.getMusics();
      this.musics.set(musics);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingService.hide();
    }

    // 再生停止状態を取得
    try {
      const pause = await this.restService.getPause();
      this.isPause.set(pause);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 再生ボタンクリック
   */
  async onClickPlay() {
    this.isPause.set(!this.isPause());
    this.loadingService.show();
    try {
      // 再生停止状態を更新する
      await this.restService.putPause(this.isPause());
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingService.hide();
    }
  }

  /**
   * 追加ボタンをクリック
   * @returns null
   */
  async onClickAdd() {
    if (!this.url()) {
      this.dialogService.show('Required', 'Input url', () => {});
      return;
    }

    this.dialogService.show(
      'Add',
      'Are you sure you want to add music ?',
      async () => {
        // Select OK
        this.loadingService.show();
        try {
          await this.restService.postMusics(this.url(), this.title(), this.artist());
          this.url.set('');
          this.title.set('');
          this.artist.set('');
          await this.refresh();
        } catch (error: any) {
          console.error(error);
          this.dialogService.show(
            'Server Error',
            `A server error has occurred. (${error.status})`,
            ()=> {}
          );
        } finally {
          this.loadingService.hide();
        }
      },
      () => {
        // Select Cancel
      }
    );
  }

  /**
   * 削除ボタンをクリック
   * @param music Music
   */
  async onClickDelete(music: Music) {
    this.dialogService.show(
      'Delete',
      'Are you sure you want to delete "' + music.title + '" ?',
      async () => {
        // Select OK
        this.loadingService.show();
        try {
          await this.restService.deleteMusics(music);
          await this.refresh();
        } catch (error: any) {
          if (error.status === 409) {
            this.dialogService.show(
              'Error',
              'The song being played can not be deleted',
              () => {}
            );
          }
          console.error(error);
        } finally {
          this.loadingService.hide();
        }
      }, () => {
        // Select Cancel
      }
    );
  }

  /**
   * 編集ボタンをクリック
   * @param music Music
   */
  async onClickEdit(music: Music) {
    if (this.editingMusicId() === music._id) {
      this.loadingService.show();
      try {
        await this.restService.putMusics(music);
      } catch (error) {
        console.error(error);
      } finally {
        this.editingMusicId.set(undefined);
        this.loadingService.hide();
      }
    } else {
      this.editingMusicId.set(music._id);
    }
  }

  /**
   * 有効状態を変更
   * @param music Music
   */
  async onChangeEnable(music: Music) {
    this.loadingService.show();
    try {
      await this.restService.patchMusics(music, music.enable);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingService.hide();
    }
  }

  /**
   * タイトルでソート
   */
  onClickSortTitle() {
    if (!this.isSortedByTitle()) {
      this.isSortedByTitle.set(true);
      this.isSortedByArtist.set(false);
      this.isSortedByPlaylist.set(false);
      this.isAscend.set(true);
    } else {
      this.isAscend.set(!this.isAscend);
    }

    const sorted = [...this.musics()].sort((a: Music, b: Music) => {
      if (a.title > b.title) {
        return this.isAscend() ? 1 : -1;
      } else if (a.title < b.title) {
        return this.isAscend() ? -1 : 1;
      } else {
        return 0;
      }
    });
    this.musics.set(sorted);
  }

  /**
   * アーティスト名でソート
   */
  onClickSortArtist() {
    if (!this.isSortedByArtist()) {
      this.isSortedByTitle.set(false);
      this.isSortedByArtist.set(true);
      this.isSortedByPlaylist.set(false);
      this.isAscend.set(true);
    } else {
      this.isAscend.set(!this.isAscend());
    }
    const sorted = [...this.musics()].sort((a: Music, b: Music) => {
      if (a.artist > b.artist) {
        return this.isAscend() ? 1 : -1;
      } else if (a.artist < b.artist) {
        return this.isAscend() ? -1 : 1;
      } else {
        return 0;
      }
    });
    this.musics.set(sorted);
  }

  /**
   * プレイリストでソート
   */
  async onClickSortPlaylist() {
    this.loadingService.show();
    try {
      const playlist = await this.restService.getPlaylist();
      this.isSortedByTitle.set(false);
      this.isSortedByArtist.set(false);
      this.isSortedByPlaylist.set(true);
      this.musics.set(playlist);
    } catch (error) {
      console.error(error);
    } finally {
      this.loadingService.hide();
    }
  }

  /**
   * スケジュール設定ダイアログを開く
   */
  onClickSchedule() {
    this.scheduleDialogService.show();
  }
}
