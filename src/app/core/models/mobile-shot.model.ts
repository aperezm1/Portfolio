export interface MobileShot {
  id: string;
  titleKey: string;
  src: string;
  width: number;
  height: number;
  tag: 'login' | 'home' | 'detail' | 'checkout' | 'profile';
}