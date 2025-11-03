import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading/loading-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-component.html',
  styleUrl: './loading-component.scss',
})
export class LoadingComponent {
  protected readonly loadingService = inject(LoadingService);

  protected onClick() {
  }
}
