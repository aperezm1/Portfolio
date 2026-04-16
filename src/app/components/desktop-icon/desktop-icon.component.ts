import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-desktop-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './desktop-icon.component.html',
  styleUrls: ['./desktop-icon.component.scss']
})
export class DesktopIconComponent {
  @Input() label = '';
  @Input() iconSrc?: string;
  @Input() route?: string;
  @Output() select = new EventEmitter<void>();

  constructor(private router: Router) {}

  onActivate() {
    this.select.emit();
    if (this.route) {
      this.router.navigate([this.route]);
    }
  }
}