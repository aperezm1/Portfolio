import { ProjectStatus } from './project-status.model';
import { MobileShot } from './mobile-shot.model';

export interface MobileProject {
  id: string;
  name: string;
  platform: 'Android' | 'iOS';
  status: ProjectStatus;
  description: string;
  shots: MobileShot[];
}