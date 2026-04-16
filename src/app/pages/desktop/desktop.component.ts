import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DesktopIconComponent } from '../../components/desktop-icon/desktop-icon.component';
import { XpTaskbarComponent } from '../../components/xp-taskbar/xp-taskbar.component';
import { WindowManagerService } from '../../core/services/window-manager.service';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, DesktopIconComponent, XpTaskbarComponent, TranslatePipe],
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss'],
})
export class DesktopComponent {
  private readonly windowManager = inject(WindowManagerService);
  private readonly translate = inject(TranslateService);

  readonly windows = this.windowManager.windows;

  openApp(id: string): void {
    const contentById: Record<string, string> = {
      app1: 'Placeholder de la primera app. Aqui ira tu primera pantalla real.',
      app2: 'Placeholder de la segunda app. Sirve para probar pestanas y estados.',
    };

    const titleKeyById: Record<string, string> = {
      app1: 'pages.desktop.app1',
      app2: 'pages.desktop.app2',
    };

    const titleKey = titleKeyById[id] ?? 'pages.desktop.app1';
    const title = this.translate.instant(titleKey);

    this.windowManager.openWindow({
      id,
      title,
      content: contentById[id] ?? 'Ventana de prueba',
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