import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ExplorerProject } from '../../core/models/explorer-project.model';
import { ProjectStatusLabelPipe } from '../../core/pipes/project-status-label.pipe';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';

@Component({
  selector: 'app-internet-explorer-app',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ProjectStatusLabelPipe],
  templateUrl: './internet-explorer-app.component.html',
  styleUrls: ['./internet-explorer-app.component.scss'],
})
export class InternetExplorerAppComponent implements OnInit {
  private readonly data = inject(PortfolioDataService);

  projects: ExplorerProject[] = [];
  selectedProjectId = '';
  statusMessageKey = 'internetExplorer.status.ready';

  ngOnInit(): void {
    this.data.explorerProjects$.subscribe((projects) => {
      this.projects = projects;

      if (projects.length > 0) {
        this.selectedProjectId = projects[0].id;
      }
    });
  }

  get selectedProject(): ExplorerProject {
    return (
      this.projects.find((p) => p.id === this.selectedProjectId) ?? {
        id: '',
        titleKey: '',
        summaryKey: '',
        status: 'wip',
        deployUrl: '',
        stack: [],
      }
    );
  }

  get selectedProjectPreviewPath(): string {
    if (!this.selectedProject.id) return '/assets/previews/placeholder.webp';
    return `/assets/images/webs/${this.selectedProject.id}.png`;
  }

  selectProject(projectId: string): void {
    this.selectedProjectId = projectId;
    this.statusMessageKey = 'internetExplorer.status.projectSelected';
  }

  onOpenLink(): void {
    this.statusMessageKey = 'internetExplorer.status.opening';
  }

  onHoverOpen(): void {
    this.statusMessageKey = 'internetExplorer.status.hoverOpen';
  }

  onHoverRepo(): void {
    this.statusMessageKey = 'internetExplorer.status.hoverRepo';
  }

  onLeaveAction(): void {
    this.statusMessageKey = 'internetExplorer.status.ready';
  }

  onPreviewError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/previews/placeholder.webp';
  }

  trackById(_: number, item: ExplorerProject): string {
    return item.id;
  }
}