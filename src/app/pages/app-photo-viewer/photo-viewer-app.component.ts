import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MobileProject } from '../../core/models/mobile-project.model';
import { MobileShot } from '../../core/models/mobile-shot.model';
import { ProjectStatusLabelPipe } from '../../core/pipes/project-status-label.pipe';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';

@Component({
  selector: 'app-photo-viewer-app',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ProjectStatusLabelPipe],
  templateUrl: './photo-viewer-app.component.html',
  styleUrls: ['./photo-viewer-app.component.scss'],
})
export class PhotoViewerAppComponent implements OnInit {
  private readonly data = inject(PortfolioDataService);

  projects: MobileProject[] = [];
  selectedProjectId = '';
  selectedShotIndex = 0;
  zoom = 1;

  ngOnInit(): void {
    this.data.mobileProjects$.subscribe((projects) => {
      this.projects = projects;

      if (projects.length > 0) {
        this.selectedProjectId = projects[0].id;
        this.selectedShotIndex = 0;
        this.zoom = 1;
      }
    });
  }

  get selectedProject(): MobileProject {
    return (
      this.projects.find((project) => project.id === this.selectedProjectId) ?? {
        id: '',
        name: '',
        platform: 'Android',
        status: 'wip',
        description: '',
        shots: [{ id: '', titleKey: '', src: '/assets/previews/placeholder.webp', width: 0, height: 0 }],
      }
    );
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