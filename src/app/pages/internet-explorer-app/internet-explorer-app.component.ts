import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ExplorerProject } from '../../core/models/explorer-project.model';

@Component({
  selector: 'app-internet-explorer-app',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './internet-explorer-app.component.html',
  styleUrls: ['./internet-explorer-app.component.scss'],
})
export class InternetExplorerAppComponent {
  readonly projects: ExplorerProject[] = [
    {
      id: 'project1',
      titleKey: 'pages.internetExplorer.projects.project1.title',
      summaryKey: 'pages.internetExplorer.projects.project1.summary',
      status: 'online',
      deployUrl: 'https://the-witcher-web.vercel.app/',
      repoUrl: 'https://github.com/dmunozc04-albarregas/videojuego',
      stack: ['HTML', 'CSS', 'JS'],
    },
    {
      id: 'project2',
      titleKey: 'pages.internetExplorer.projects.project2.title',
      summaryKey: 'pages.internetExplorer.projects.project2.summary',
      status: 'online',
      deployUrl: 'https://primer-proyecto-angular-apm.vercel.app/',
      repoUrl: 'https://github.com/aperezm1/Primer-Proyecto-Angular',
      stack: ['Angular', 'TypeScript', 'SCSS'],
    },
    {
      id: 'project3',
      titleKey: 'pages.internetExplorer.projects.project3.title',
      summaryKey: 'pages.internetExplorer.projects.project3.summary',
      status: 'wip',
      deployUrl: 'https://portfolio-xp-apm.vercel.app/',
      repoUrl: 'https://github.com/aperezm1/Portfolio',
      stack: ['Angular', 'TypeScript', 'SCSS'],
    },
  ];

  selectedProjectId = this.projects[0].id;
  statusMessageKey = 'pages.internetExplorer.status.ready';

  get selectedProject(): ExplorerProject {
    return this.projects.find((p) => p.id === this.selectedProjectId) ?? this.projects[0];
  }

  get selectedProjectPreviewPath(): string {
    return `/assets/images/webs/${this.selectedProject.id}.png`;
  }

  selectProject(projectId: string): void {
    this.selectedProjectId = projectId;
    this.statusMessageKey = 'pages.internetExplorer.status.projectSelected';
  }

  onOpenLink(): void {
    this.statusMessageKey = 'pages.internetExplorer.status.opening';
  }

  onHoverOpen(): void {
    this.statusMessageKey = 'pages.internetExplorer.status.hoverOpen';
  }

  onHoverRepo(): void {
    this.statusMessageKey = 'pages.internetExplorer.status.hoverRepo';
  }

  onLeaveAction(): void {
    this.statusMessageKey = 'pages.internetExplorer.status.ready';
  }

  onPreviewError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/previews/placeholder.webp';
  }

  trackById(_: number, item: ExplorerProject): string {
    return item.id;
  }
}