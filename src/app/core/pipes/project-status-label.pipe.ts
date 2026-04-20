import { Pipe, PipeTransform } from '@angular/core';
import { ProjectStatus } from '../models/project-status.model';

@Pipe({
  name: 'projectStatusLabel',
  standalone: true,
})
export class ProjectStatusLabelPipe implements PipeTransform {
  private readonly statusLabelKey: Record<ProjectStatus, string> = {
    online: 'common.projectStatus.online',
    wip: 'common.projectStatus.wip',
  };

  transform(status: ProjectStatus): string {
    return this.statusLabelKey[status];
  }
}