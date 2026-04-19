import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MobileProject } from '../../core/models/mobile-project.model';
import { MobileShot } from '../../core/models/mobile-shot.model';

type ViewMode = 'grid' | 'viewer';

@Component({
  selector: 'app-photo-viewer-app',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './photo-viewer-app.component.html',
  styleUrls: ['./photo-viewer-app.component.scss'],
})
export class PhotoViewerAppComponent implements OnDestroy {
  readonly projects: MobileProject[] = [
    {
      id: 'app-1',
      name: 'Spotify2',
      platform: 'Android',
      shots: [
        { id: 'a1', titleKey: 'pages.photoViewer.shots.login', src: '/assets/images/mobile/Spotify1.jpg', width: 1080, height: 2340 },
        { id: 'a2', titleKey: 'pages.photoViewer.shots.home', src: '/assets/images/mobile/Spotify2.jpg', width: 1080, height: 2340 },
        { id: 'a3', titleKey: 'pages.photoViewer.shots.detail', src: '/assets/images/mobile/Spotify3.jpg', width: 1080, height: 2340 },
        { id: 'a4', titleKey: 'pages.photoViewer.shots.detail', src: '/assets/images/mobile/Spotify4.jpg', width: 1080, height: 2340 },
      ],
    },
    {
      id: 'app-2',
      name: 'Eventvs Mérida',
      platform: 'Android',
      shots: [
        { id: 'b1', titleKey: 'pages.photoViewer.shots.login', src: '/assets/images/mobile/Eventvs1.jpg', width: 1080, height: 2340 },
        { id: 'b2', titleKey: 'pages.photoViewer.shots.home', src: '/assets/images/mobile/Eventvs2.jpg', width: 1080, height: 2340 },
        { id: 'b3', titleKey: 'pages.photoViewer.shots.checkout', src: '/assets/images/mobile/Eventvs3.jpg', width: 1080, height: 2340 },
        { id: 'b4', titleKey: 'pages.photoViewer.shots.checkout', src: '/assets/images/mobile/Eventvs4.jpg', width: 1080, height: 2340 },
        { id: 'b5', titleKey: 'pages.photoViewer.shots.checkout', src: '/assets/images/mobile/Eventvs5.jpg', width: 1080, height: 2340 },
        { id: 'b6', titleKey: 'pages.photoViewer.shots.checkout', src: '/assets/images/mobile/Eventvs6.jpg', width: 1080, height: 2340 },
        { id: 'b7', titleKey: 'pages.photoViewer.shots.checkout', src: '/assets/images/mobile/Eventvs7.jpg', width: 1080, height: 2340 },
        { id: 'b8', titleKey: 'pages.photoViewer.shots.checkout', src: '/assets/images/mobile/Eventvs8.jpg', width: 1080, height: 2340 },
      ],
    },
  ];

  selectedProjectId = this.projects[0].id;
  selectedShotIndex = 0;
  viewMode: ViewMode = 'grid';
  zoom = 1;
  slideshowActive = false;

  private slideshowTimerId: number | null = null;

  get selectedProject(): MobileProject {
    return this.projects.find((project) => project.id === this.selectedProjectId) ?? this.projects[0];
  }

  get selectedShot(): MobileShot {
    return this.selectedProject.shots[this.selectedShotIndex] ?? this.selectedProject.shots[0];
  }

  get statusText(): string {
    const total = this.selectedProject.shots.length;
    const current = this.selectedShotIndex + 1;
    return `${this.selectedProject.name} - ${current} / ${total} - ${this.selectedShot.width}x${this.selectedShot.height} - ${Math.round(this.zoom * 100)}%`;
  }

  selectProject(projectId: string): void {
    this.selectedProjectId = projectId;
    this.selectedShotIndex = 0;
    this.viewMode = 'grid';
    this.zoom = 1;
    this.stopSlideshow();
  }

  openShot(index: number): void {
    this.selectedShotIndex = index;
    this.viewMode = 'viewer';
    this.zoom = 1;
    this.stopSlideshow();
  }

  backToGrid(): void {
    this.viewMode = 'grid';
    this.zoom = 1;
    this.stopSlideshow();
  }

  prev(): void {
    const total = this.selectedProject.shots.length;
    this.selectedShotIndex = (this.selectedShotIndex - 1 + total) % total;
  }

  next(): void {
    const total = this.selectedProject.shots.length;
    this.selectedShotIndex = (this.selectedShotIndex + 1) % total;
  }

  zoomIn(): void {
    this.viewMode = 'viewer';
    this.zoom = Math.min(3, this.zoom + 0.2);
  }

  zoomOut(): void {
    this.viewMode = 'viewer';
    this.zoom = Math.max(0.6, this.zoom - 0.2);
  }

  fit(): void {
    this.viewMode = 'viewer';
    this.zoom = 1;
  }

  toggleSlideshow(): void {
    if (this.slideshowActive) {
      this.stopSlideshow();
      return;
    }

    this.viewMode = 'viewer';
    this.slideshowActive = true;
    this.slideshowTimerId = window.setInterval(() => {
      this.next();
    }, 2200);
  }

  stopSlideshow(): void {
    this.slideshowActive = false;

    if (this.slideshowTimerId !== null) {
      window.clearInterval(this.slideshowTimerId);
      this.slideshowTimerId = null;
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.backToGrid();
      return;
    }

    if (event.key === 'ArrowLeft') {
      this.viewMode = 'viewer';
      this.prev();
      return;
    }

    if (event.key === 'ArrowRight') {
      this.viewMode = 'viewer';
      this.next();
      return;
    }

    if (event.key === '+'
      || event.key === '='
      || event.key === 'Add') {
      this.zoomIn();
      return;
    }

    if (event.key === '-'
      || event.key === '_'
      || event.key === 'Subtract') {
      this.zoomOut();
      return;
    }

    if (event.key.toLowerCase() === 'f') {
      this.fit();
      return;
    }

    if (event.key.toLowerCase() === 's') {
      this.toggleSlideshow();
    }
  }

  trackByProject(_: number, item: MobileProject): string {
    return item.id;
  }

  trackByShot(_: number, item: MobileShot): string {
    return item.id;
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }
}