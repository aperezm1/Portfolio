import { Component, OnInit, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';

@Component({
  selector: 'app-my-pc-app',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './my-pc-app.component.html',
  styleUrls: ['./my-pc-app.component.scss'],
})
export class MyPcAppComponent implements OnInit {
  private readonly data = inject(PortfolioDataService);

  skills: { label: string; url: string }[] = [];
  githubUrl = '';
  linkedinUrl = '';
  cvUrl = '';

  ngOnInit(): void {
    this.data.myPcSkills$.subscribe((skills) => {
      this.skills = skills;
    });
  }
}