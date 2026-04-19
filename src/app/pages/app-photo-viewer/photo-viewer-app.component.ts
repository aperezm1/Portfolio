import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MobileProject } from '../../core/models/mobile-project.model';
import { MobileShot } from '../../core/models/mobile-shot.model';
import { ProjectStatusLabelPipe } from '../../core/pipes/project-status-label.pipe';

@Component({
  selector: 'app-photo-viewer-app',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ProjectStatusLabelPipe],
  templateUrl: './photo-viewer-app.component.html',
  styleUrls: ['./photo-viewer-app.component.scss'],
})
export class PhotoViewerAppComponent {
  readonly projects: MobileProject[] = [
    {
      id: 'app-1',
      name: 'Spotify2',
      platform: 'Android',
      status: 'online',
      description: 'photoViewer.projects.spotify',
      shots: [
        { id: 'a1', titleKey: 'photoViewer.shots.home', src: '/assets/images/mobile/Spotify1.jpg', width: 1080, height: 2340 },
        { id: 'a2', titleKey: 'photoViewer.shots.songs', src: '/assets/images/mobile/Spotify2.jpg', width: 1080, height: 2340 },
        { id: 'a3', titleKey: 'photoViewer.shots.player', src: '/assets/images/mobile/Spotify3.jpg', width: 1080, height: 2340 },
        { id: 'a4', titleKey: 'photoViewer.shots.account', src: '/assets/images/mobile/Spotify4.jpg', width: 1080, height: 2340 },
        { id: 'a5', titleKey: 'photoViewer.shots.splash', src: '/assets/images/mobile/Spotify5.jpg', width: 1080, height: 2340 },
        { id: 'a6', titleKey: 'photoViewer.shots.register', src: '/assets/images/mobile/Spotify6.jpg', width: 1080, height: 2340 },
        { id: 'a7', titleKey: 'photoViewer.shots.login', src: '/assets/images/mobile/Spotify7.jpg', width: 1080, height: 2340 },
      ],
    },
    {
      id: 'app-2',
      name: 'Eventvs Merida',
      platform: 'Android',
      status: 'wip',
      description: 'photoViewer.projects.eventvs',
      shots: [
        { id: 'b1', titleKey: 'photoViewer.shots.splash', src: '/assets/images/mobile/Eventvs1.jpg', width: 1080, height: 2340 },
        { id: 'b2', titleKey: 'photoViewer.shots.home', src: '/assets/images/mobile/Eventvs2.jpg', width: 1080, height: 2340 },
        { id: 'b3', titleKey: 'photoViewer.shots.details', src: '/assets/images/mobile/Eventvs3.jpg', width: 1080, height: 2340 },
        { id: 'b4', titleKey: 'photoViewer.shots.map', src: '/assets/images/mobile/Eventvs4.jpg', width: 1080, height: 2340 },
        { id: 'b5', titleKey: 'photoViewer.shots.calendar', src: '/assets/images/mobile/Eventvs5.jpg', width: 1080, height: 2340 },
        { id: 'b6', titleKey: 'photoViewer.shots.profile', src: '/assets/images/mobile/Eventvs6.jpg', width: 1080, height: 2340 },
        { id: 'b7', titleKey: 'photoViewer.shots.account', src: '/assets/images/mobile/Eventvs7.jpg', width: 1080, height: 2340 },
        { id: 'b8', titleKey: 'photoViewer.shots.events', src: '/assets/images/mobile/Eventvs8.jpg', width: 1080, height: 2340 },
        { id: 'b9', titleKey: 'photoViewer.shots.login', src: '/assets/images/mobile/Eventvs9.jpg', width: 1080, height: 2340 },
        { id: 'b10', titleKey: 'photoViewer.shots.register', src: '/assets/images/mobile/Eventvs10.jpg', width: 1080, height: 2340 },
      ],
    },
  ];

  selectedProjectId = this.projects[0].id;
  selectedShotIndex = 0;
  zoom = 1;

  get selectedProject(): MobileProject {
    return this.projects.find((project) => project.id === this.selectedProjectId) ?? this.projects[0];
  }

  get selectedShot(): MobileShot {
    return this.selectedProject.shots[this.selectedShotIndex] ?? this.selectedProject.shots[0];
  }

  get statusText(): string {
    const total = this.selectedProject.shots.length;
    const current = this.selectedShotIndex + 1;
    return `${this.selectedProject.name} - ${current}/${total} - ${this.selectedShot.width}x${this.selectedShot.height} - ${Math.round(this.zoom * 100)}%`;
  }

  selectProject(projectId: string): void {
    if (this.selectedProjectId === projectId) return;
    this.selectedProjectId = projectId;
    this.selectedShotIndex = 0;
    this.zoom = 1;
  }

  selectShot(index: number): void {
    this.selectedShotIndex = index;
    this.zoom = 1;
  }

  prev(): void {
    const total = this.selectedProject.shots.length;
    this.selectedShotIndex = (this.selectedShotIndex - 1 + total) % total;
    this.zoom = 1;
  }

  next(): void {
    const total = this.selectedProject.shots.length;
    this.selectedShotIndex = (this.selectedShotIndex + 1) % total;
    this.zoom = 1;
  }

  zoomIn(): void {
    this.zoom = Math.min(2.5, this.zoom + 0.2);
  }

  zoomOut(): void {
    this.zoom = Math.max(0.8, this.zoom - 0.2);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') this.prev();
    if (event.key === 'ArrowRight') this.next();
    if (event.key === '+' || event.key === '=') this.zoomIn();
    if (event.key === '-' || event.key === '_') this.zoomOut();
  }

  trackByProject(_: number, item: MobileProject): string {
    return item.id;
  }

  trackByShot(_: number, item: MobileShot): string {
    return item.id;
  }
}