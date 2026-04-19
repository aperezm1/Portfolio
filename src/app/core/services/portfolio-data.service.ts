import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExplorerProject } from '../models/explorer-project.model';
import { MobileProject } from '../models/mobile-project.model';
import { OpenWindowConfig } from '../models/open-window-config.model';

@Injectable({
  providedIn: 'root',
})
export class PortfolioDataService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  getDesktopApps(): Observable<OpenWindowConfig[]> {
    return this.http.get<OpenWindowConfig[]>(`${this.baseUrl}/desktopApps`);
  }

  getExplorerProjects(): Observable<ExplorerProject[]> {
    return this.http.get<ExplorerProject[]>(`${this.baseUrl}/explorerProjects`);
  }

  getMobileProjects(): Observable<MobileProject[]> {
    return this.http.get<MobileProject[]>(`${this.baseUrl}/mobileProjects`);
  }

  getMyPcSkills(): Observable<{ label: string; url: string }[]> {
    return this.http.get<{ label: string; url: string }[]>(`${this.baseUrl}/myPcSkills`);
  }

  getMyPcLinks(): Observable<{ githubUrl: string; linkedinUrl: string; cvUrl: string }> {
    return this.http.get<{ githubUrl: string; linkedinUrl: string; cvUrl: string }>(`${this.baseUrl}/myPcLinks`);
  }
}