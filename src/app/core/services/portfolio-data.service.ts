import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SupabaseDataService } from './supabase-data.service';
import { ExplorerProject } from '../models/explorer-project.model';
import { MobileProject } from '../models/mobile-project.model';
import { OpenWindowConfig } from '../models/open-window-config.model';

@Injectable({ providedIn: 'root' })
export class PortfolioDataService {
  supabase = inject(SupabaseDataService);

  private desktopAppsSubject = new BehaviorSubject<OpenWindowConfig[]>([]);
  desktopApps$ = this.desktopAppsSubject.asObservable();

  private explorerProjectsSubject = new BehaviorSubject<ExplorerProject[]>([]);
  explorerProjects$ = this.explorerProjectsSubject.asObservable();

  private mobileProjectsSubject = new BehaviorSubject<MobileProject[]>([]);
  mobileProjects$ = this.mobileProjectsSubject.asObservable();

  private myPcSkillsSubject = new BehaviorSubject<{ label: string; url: string }[]>([]);
  myPcSkills$ = this.myPcSkillsSubject.asObservable();

  private loaded = false;

  init(): void {
    if (this.loaded) return;
    this.loaded = true;

    this.supabase.getDesktopApps().subscribe({
      next: v => this.desktopAppsSubject.next(v),
      error: e => { console.error('desktopApps load error', e); this.desktopAppsSubject.next([]); }
    });

    this.supabase.getExplorerProjects().subscribe({
      next: v => this.explorerProjectsSubject.next(v),
      error: e => { console.error('explorerProjects load error', e); this.explorerProjectsSubject.next([]); }
    });

    this.supabase.getMobileProjects().subscribe({
      next: v => this.mobileProjectsSubject.next(v),
      error: e => { console.error('mobileProjects load error', e); this.mobileProjectsSubject.next([]); }
    });

    this.supabase.getMyPcSkills().subscribe({
      next: v => this.myPcSkillsSubject.next(v),
      error: e => { console.error('myPcSkills load error', e); this.myPcSkillsSubject.next([]); }
    });
  }
}