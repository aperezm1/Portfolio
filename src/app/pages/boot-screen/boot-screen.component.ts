import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { gsap } from 'gsap';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-boot-screen-component',
  standalone: true,
  imports: [CommonModule, MatRippleModule, MatProgressBarModule, TranslatePipe],
  templateUrl: './boot-screen.component.html',
  styleUrl: './boot-screen.component.scss',
})
export class BootScreenComponent implements OnInit {
  @ViewChild('screen', { static: true }) screenRef!: ElementRef<HTMLElement>;
  private router = inject(Router);

  booting = false;

  ngOnInit(): void {
    const tl = gsap.timeline();
    tl.from('.boot-logo', {
      y: 26,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
    })
      .from(
        '.boot-title',
        {
          y: 18,
          opacity: 0,
          duration: 0.55,
          ease: 'power2.out',
        },
        '-=0.35'
      )
      .from(
        '.boot-hint',
        {
          opacity: 0,
          duration: 0.5,
          ease: 'sine.out',
        },
        '-=0.25'
      );
  }

  enterLogin(): void {
    if (this.booting) return;
    this.booting = true;

    const tl = gsap.timeline({
      onComplete: () => this.router.navigateByUrl('/login'),
    });

    tl.to('.boot-hint', {
      opacity: 0,
      duration: 0.2,
    })
      .to(
        '.boot-content',
        {
          scale: 0.985,
          opacity: 0,
          filter: 'blur(2px)',
          duration: 0.45,
          ease: 'power2.inOut',
        },
        0
      )
      .to(
        this.screenRef.nativeElement,
        {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.inOut',
        },
        '>-0.08'
      );
  }
}