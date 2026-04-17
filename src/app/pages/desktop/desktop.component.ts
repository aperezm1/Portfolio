import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DesktopIconComponent } from '../../components/desktop-icon/desktop-icon.component';
import { XpTaskbarComponent } from '../../components/xp-taskbar/xp-taskbar.component';
import { WindowManagerService } from '../../core/services/window-manager.service';
import { MyPcAppComponent } from '../my-pc-app/my-pc-app.component';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [
    CommonModule,
    DesktopIconComponent,
    XpTaskbarComponent,
    MyPcAppComponent,
    TranslatePipe,
  ],
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss'],
})
export class DesktopComponent {
  private readonly windowManager = inject(WindowManagerService);
  private readonly translate = inject(TranslateService);

  readonly windows = this.windowManager.windows;

  openApp(id: string): void {
    const appConfig: Record<
      string,
      { titleKey: string; appType: string; contentKey?: string }
    > = {
      app1: {
        titleKey: 'pages.desktop.app1',
        appType: 'my-pc',
      },
      app2: {
        titleKey: 'pages.desktop.app2',
        appType: 'placeholder',
        contentKey: 'pages.desktop.placeholder',
      },
    };

    const current = appConfig[id] ?? appConfig['app1'];

    this.windowManager.openWindow({
      id,
      titleKey: current.titleKey,
      appType: current.appType,
      content: current.contentKey ? this.translate.instant(current.contentKey) : '',
    });
  }

  focusWindow(id: string): void {
    this.windowManager.focusWindow(id);
  }

  minimizeWindow(id: string): void {
    this.windowManager.minimizeWindow(id);
  }

  closeWindow(id: string): void {
    this.windowManager.closeWindow(id);
  }

  onTaskbarTabClick(id: string): void {
    this.windowManager.toggleFromTaskbar(id);
  }

  onStart(): void {
    // Placeholder para menu Start
  }
}