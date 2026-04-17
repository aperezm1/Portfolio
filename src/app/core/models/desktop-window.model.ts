export type DesktopWindowState = 'open' | 'minimized';

export interface DesktopWindow {
  id: string;
  titleKey: string;
  iconSrc?: string;
  content?: string;
  appType?: string;
  state: DesktopWindowState;
  active: boolean;
  zIndex: number;
}