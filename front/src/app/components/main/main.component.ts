import { Component, OnInit, Input } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';
import { Music } from 'src/app/services/rest/datas/music';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { ScheduleDialogService } from 'src/app/services/schedule-dialog/schedule-dialog.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  musics: Array<Music> = [];
  url: string;
  title: string;
  artist: string;
  isAscend = true;
  isSortedByTitle = false;
  isSortedByArtist = false;
  isSortedByPlaylist = false;
  editingMusicId: string;
  isPause = false;
  isDisplayAdd = false;

  constructor(
    private restService: RestService,
    private loadingService: LoadingService,
    private dialogService: DialogService,
    private scheduleDialogService: ScheduleDialogService
  ) { }

  ngOnInit() {
    this.refresh();
    setInterval(() => {
      this.restService.getPause().then(pause => {
        this.isPause = pause;
      }).catch();  
    }, 5000);
  }

  refresh() {
    this.loadingService.show();
    this.restService.getMusics().then(musics => {
      this.musics = musics;
      this.loadingService.hide();
    }).catch(error => {
      this.loadingService.hide();
    });
    this.restService.getPause().then(pause => {
      this.isPause = pause;
    }).catch();  
  }

  onClickPlay() {
    this.isPause = !this.isPause;
    this.loadingService.show();
    this.restService.putPause(this.isPause).then(response => {
      this.loadingService.hide();
    }).catch(error => {
      this.loadingService.hide();
    });
  }

  onClickAdd() {
    if (this.url && this.url.length > 0) {
      // Select OK
      this.dialogService.show('Add', 'Are you sure you want to add music ?', () => {
        this.loadingService.show();
        this.restService.postMusics(this.url, this.title, this.artist).then(response => {
          this.url = '';
          this.title = '';
          this.artist = '';
          this.refresh();
          this.loadingService.hide();
        }).catch(error => {
          this.loadingService.hide();
          console.log(error);
          this.dialogService.show('Server Error', `A server error has occurred. (${error.status})`, ()=> {});
        });
      }, () => {
        // Select cancel
      });
    } else {
      this.dialogService.show('Required', 'Input url', () => {});
    }
  }

  onClickDelete(music: Music) {
    this.dialogService.show('Delete', 'Are you sure you want to delete "' + music.title + '" ?', () => {
      // Select OK
      this.loadingService.show();
      this.restService.deleteMusics(music).then(response => {
        this.refresh();
        this.loadingService.hide();
      }).catch(error => {
        if (error.status === 409) {
          this.dialogService.show('Error', 'The song being played can not be deleted', () => {});
        }
        this.loadingService.hide();
      });
    }, () => {
      // Select cancel
    });
  }

  onClickEdit(music: Music) {
    if (this.editingMusicId === music._id) {
      this.loadingService.show();
      this.restService.putMusics(music).then(response => {
        this.editingMusicId = undefined;
        this.loadingService.hide();
      }).catch(error => {
        this.editingMusicId = undefined;
        this.loadingService.hide();
      });
    } else {
      this.editingMusicId = music._id;
    }
  }

  onClickSortTitle() {
    if (!this.isSortedByTitle) {
      this.isSortedByTitle = true;
      this.isSortedByArtist = false;
      this.isSortedByPlaylist = false;
      this.isAscend = true;
    } else {
      this.isAscend = !this.isAscend;
    }
    this.musics = this.musics.sort((a: Music, b: Music) => {
      if (a.title > b.title) {
        return this.isAscend ? 1 : -1;
      } else if (a.title < b.title) {
        return this.isAscend ? -1 : 1;
      } else {
        return 0;
      }
    });
  }

  onClickSortArtist() {
    if (!this.isSortedByArtist) {
      this.isSortedByTitle = false;
      this.isSortedByArtist = true;
      this.isSortedByPlaylist = false;
      this.isAscend = true;
    } else {
      this.isAscend = !this.isAscend;
    }
    this.musics = this.musics.sort((a: Music, b: Music) => {
      if (a.artist > b.artist) {
        return this.isAscend ? 1 : -1;
      } else if (a.artist < b.artist) {
        return this.isAscend ? -1 : 1;
      } else {
        return 0;
      }
    });
  }

  onClickSortPlaylist() {
    this.loadingService.show();
    this.restService.getPlaylist().then(playlist => {
      this.isSortedByTitle = false;
      this.isSortedByArtist = false;
      this.isSortedByPlaylist = true;
      this.musics = playlist;
      this.loadingService.hide();
    }).catch(error => {
      this.loadingService.hide();
    });
  }

  onClickSchedule() {
    this.scheduleDialogService.show();
  }
}
