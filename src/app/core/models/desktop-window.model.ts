export type DesktopWindowState = 'open' | 'minimized';

export interface DesktopWindow {
  id: string;
  title: string;
  iconSrc?: string;
  content?: string;
  state: DesktopWindowState;
  active: boolean;
  zIndex: number;
}