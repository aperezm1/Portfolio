import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ExplorerProject } from '../models/explorer-project.model';
import { MobileProject } from '../models/mobile-project.model';
import { OpenWindowConfig } from '../models/open-window-config.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupabaseDataService {
  private supabase: SupabaseClient;

  constructor() {
    const url = environment.supabase.url;
    const anonKey = environment.supabase.anonKey;
    this.supabase = createClient(url, anonKey);
  }

  private rowToOpenWindowConfig(row: any): OpenWindowConfig {
    return {
      id: row.id,
      titleKey: row.title_key ?? row.titleKey,
      iconSrc: row.icon_src ?? row.iconSrc,
      content: row.content,
      appType: row.app_type ?? row.appType,
    };
  }

  getDesktopApps(): Observable<OpenWindowConfig[]> {
    return from(this.supabase.from('desktop_apps').select('*')).pipe(
      map((res: any) => {
        if (res.error) throw res.error;
        return (res.data || []).map((r: any) => this.rowToOpenWindowConfig(r));
      })
    );
  }

  getExplorerProjects(): Observable<ExplorerProject[]> {
    return from(this.supabase.from('explorer_projects').select('*')).pipe(
      map((res: any) => {
        if (res.error) throw res.error;
        return (res.data || []).map((d: any) => ({
          id: d.id,
          titleKey: d.title_key ?? d.titleKey,
          summaryKey: d.summary_key ?? d.summaryKey,
          status: d.status,
          deployUrl: d.deploy_url ?? d.deployUrl,
          repoUrl: d.repo_url ?? d.repoUrl,
          stack: d.stack ?? d.stack,
        }));
      })
    );
  }

  getMobileProjects(): Observable<MobileProject[]> {
    return from(this.supabase.from('mobile_projects').select('*, mobile_shots(*)')).pipe(
      map((res: any) => {
        if (res.error) throw res.error;
        return (res.data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          platform: p.platform,
          status: p.status,
          description: p.description,
          shots: (p.mobile_shots || []).map((s: any) => ({
            id: s.id,
            titleKey: s.title_key ?? s.titleKey,
            src: s.src,
            width: s.width,
            height: s.height,
          })),
        }));
      })
    );
  }

  getMyPcSkills(): Observable<{ label: string; url: string }[]> {
    return from(this.supabase.from('my_pc_skills').select('*')).pipe(
      map((res: any) => {
        if (res.error) throw res.error;
        return (res.data || []).map((s: any) => ({ label: s.label, url: s.url }));
      })
    );
  }
}