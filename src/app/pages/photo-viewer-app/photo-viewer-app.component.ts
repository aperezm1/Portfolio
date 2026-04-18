import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MobileProject } from '../../core/models/mobile-project.model';
import { MobileShot } from '../../core/models/mobile-shot.model';

@Component({
  selector: 'app-photo-viewer-app',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './photo-viewer-app.component.html',
  styleUrls: ['./photo-viewer-app.component.scss'],
})
export class PhotoViewerAppComponent {
  readonly projects: MobileProject[] = [
    {
      id: 'app-a',
      name: 'Delivery App',
      platform: 'Android',
      shots: [
        { id: 'a1', titleKey: 'pages.photoViewer.shots.login', src: '/assets/images/project1.png', width: 1080, height: 2400, tag: 'login' },
        { id: 'a2', titleKey: 'pages.photoViewer.shots.home', src: '/assets/images/project2.png', width: 1080, height: 2400, tag: 'home' },
        { id: 'a3', titleKey: 'pages.mobileViewer.shots.detail', src: '/assets/images/project3.png', width: 1080, height: 2400, tag: 'detail' },
      ],
    },
    {
      id: 'app-b',
      name: 'Banking App',
      platform: 'iOS',
      shots: [
        { id: 'b1', titleKey: 'pages.mobileViewer.shots.login', src: '/assets/images/project2.png', width: 1170, height: 2532, tag: 'login' },
        { id: 'b2', titleKey: 'pages.mobileViewer.shots.home', src: '/assets/images/project3.png', width: 1170, height: 2532, tag: 'home' },
        { id: 'b3', titleKey: 'pages.mobileViewer.shots.checkout', src: '/assets/images/project1.png', width: 1170, height: 2532, tag: 'checkout' },
      ],
    },
  ];

  selectedProjectId = this.projects[0].id;
  selectedShotIndex = 0;
  viewMode: 'grid' | 'viewer' = 'grid';
  zoom = 1;

  get selectedProject(): MobileProject {
    return this.projects.find((p) => p.id === this.selectedProjectId) ?? this.projects[0];
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
  }

  openShot(index: number): void {
    this.selectedShotIndex = index;
    this.viewMode = 'viewer';
    this.zoom = 1;
  }

  backToGrid(): void {
    this.viewMode = 'grid';
    this.zoom = 1;
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
    this.zoom = Math.min(3, this.zoom + 0.2);
  }

  zoomOut(): void {
    this.zoom = Math.max(0.6, this.zoom - 0.2);
  }

  fit(): void {
    this.zoom = 1;
  }

  trackByProject(_: number, item: MobileProject): string {
    return item.id;
  }

  trackByShot(_: number, item: MobileShot): string {
    return item.id;
  }
}