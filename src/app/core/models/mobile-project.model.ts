import { MobileShot } from "./mobile-shot.model";

export interface MobileProject {
  id: string;
  name: string;
  platform: 'Android' | 'iOS';
  status: 'online' | 'wip';
  description: string;
  shots: MobileShot[];
}