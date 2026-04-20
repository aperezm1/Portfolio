import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import gsap from 'gsap';
import { DesktopIconComponent } from '../../components/desktop-icon/desktop-icon.component';
import { XpTaskbarComponent } from '../../components/xp-taskbar/xp-taskbar.component';
import { WindowManagerService } from '../../core/services/window-manager.service';
import { MyPcAppComponent } from '../app-my-pc/my-pc-app.component';
import { InternetExplorerAppComponent } from '../app-internet-explorer/internet-explorer-app.component';
import { PhotoViewerAppComponent } from '../app-photo-viewer/photo-viewer-app.component';
import { OpenWindowConfig } from '../../core/models/open-window-config.model';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [
    CommonModule,
    DesktopIconComponent,
    XpTaskbarComponent,
    MyPcAppComponent,
    InternetExplorerAppComponent,
    PhotoViewerAppComponent,
    TranslatePipe,
  ],
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss'],
})
export class DesktopComponent implements OnInit {
  private readonly windowManager = inject(WindowManagerService);
  private readonly portfolioDataService = inject(PortfolioDataService);
  private readonly document = inject(DOCUMENT);

  private readonly pendingOpenAnimations = new Set<string>();
  desktopApps: OpenWindowConfig[] = [];

  readonly windows = this.windowManager.windows;

  ngOnInit(): void {
    this.portfolioDataService.getDesktopApps().subscribe((apps) => {
      this.desktopApps = apps;
    });
  }

  openApp(id: string): void {
    const current = this.desktopApps.find((app) => app.id === id);
    if (!current) return;

    const existingWindow = this.windows().find((win) => win.id === id);
    const shouldAnimateIn = !existingWindow || existingWindow.state === 'minimized';

    if (shouldAnimateIn) {
      this.pendingOpenAnimations.add(id);
    }

    this.windowManager.openWindow({
      id,
      titleKey: current.titleKey,
      appType: current.appType,
      iconSrc: current.iconSrc,
      content: '',
    });

    if (shouldAnimateIn) {
      this.animateWindowInWhenReady(id, existingWindow?.state === 'minimized');
    }
  }

  focusWindow(id: string): void {
    this.windowManager.focusWindow(id);
  }

  minimizeWindow(id: string): void {
    const element = this.getWindowElement(id);

    if (!element) {
      this.windowManager.minimizeWindow(id);
      return;
    }

    gsap.killTweensOf(element);

    gsap.to(element, {
      duration: 0.22,
      ease: 'power2.in',
      scale: 0.92,
      y: 24,
      opacity: 0,
      transformOrigin: 'center center',
      onComplete: () => {
        this.windowManager.minimizeWindow(id);
      },
    });
  }

  closeWindow(id: string): void {
    const element = this.getWindowElement(id);

    if (!element) {
      this.windowManager.closeWindow(id);
      return;
    }

    gsap.killTweensOf(element);

    gsap.to(element, {
      duration: 0.24,
      ease: 'power2.in',
      scale: 0.82,
      y: 36,
      opacity: 0,
      transformOrigin: 'center center',
      onComplete: () => {
        this.windowManager.closeWindow(id);
      },
    });
  }

  onTaskbarTabClick(id: string): void {
    const win = this.windows().find((window) => window.id === id);
    if (!win) return;

    if (win.state === 'minimized') {
      this.pendingOpenAnimations.add(id);
      this.windowManager.restoreWindow(id);
      this.animateWindowInWhenReady(id, true);
      return;
    }

    if (win.active) {
      this.minimizeWindow(id);
      return;
    }

    this.windowManager.focusWindow(id);
  }

  onStart(): void {}

  isPendingOpenAnimation(id: string): boolean {
    return this.pendingOpenAnimations.has(id);
  }

  private animateWindowInWhenReady(id: string, isRestore = false, attempt = 0): void {
    const element = this.getWindowElement(id);

    if (!element) {
      if (attempt < 10) {
        requestAnimationFrame(() => this.animateWindowInWhenReady(id, isRestore, attempt + 1));
      } else {
        this.pendingOpenAnimations.delete(id);
      }
      return;
    }

    gsap.killTweensOf(element);

    gsap.fromTo(
      element,
      {
        autoAlpha: 0,
        filter: isRestore ? 'blur(1px)' : 'blur(2px)',
      },
      {
        duration: 0.24,
        ease: 'power2.out',
        autoAlpha: 1,
        filter: 'blur(0px)',
        clearProps: 'opacity,visibility,filter',
        onComplete: () => {
          this.pendingOpenAnimations.delete(id);
        },
      }
    );
  }

  private getWindowElement(id: string): HTMLElement | null {
    return this.document.querySelector<HTMLElement>(`[data-window-id="${id}"]`);
  }
}