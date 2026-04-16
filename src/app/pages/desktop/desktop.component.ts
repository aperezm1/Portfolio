import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopIconComponent } from '../../components/desktop-icon/desktop-icon.component';
import { XpTaskbarComponent } from '../../components/xp-taskbar/xp-taskbar.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, DesktopIconComponent, XpTaskbarComponent, TranslatePipe],
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent {
  openApp(name: string) {
    console.log('Abrir app:', name);
    
  }

  onStart() {
    console.log('Start pressed');
    
  }
}