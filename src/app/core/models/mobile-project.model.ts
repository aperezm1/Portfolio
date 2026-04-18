import { MobileShot } from "./mobile-shot.model";

export interface MobileProject {
  id: string;
  name: string;
  platform: 'Android' | 'iOS';
  shots: MobileShot[];
}