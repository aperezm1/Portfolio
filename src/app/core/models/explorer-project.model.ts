import { ProjectStatus } from './project-status.model';

export interface ExplorerProject {
  id: string;
  titleKey: string;
  summaryKey: string;
  status: ProjectStatus;
  deployUrl: string;
  repoUrl?: string;
  stack: string[];
}