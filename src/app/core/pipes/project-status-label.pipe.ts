import { Pipe, PipeTransform } from '@angular/core';
import { PROJECT_STATUS_LABEL_KEY } from '../constants/project-status.constants';
import { ProjectStatus } from '../models/project-status.model';

@Pipe({
  name: 'projectStatusLabel',
  standalone: true,
})
export class ProjectStatusLabelPipe implements PipeTransform {
  transform(status: ProjectStatus): string {
    return PROJECT_STATUS_LABEL_KEY[status];
  }
}