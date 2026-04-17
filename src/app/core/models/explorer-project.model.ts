export interface ExplorerProject {
  id: string;
  titleKey: string;
  summaryKey: string;
  status: 'online' | 'wip';
  deployUrl: string;
  repoUrl?: string;
  stack: string[];
}