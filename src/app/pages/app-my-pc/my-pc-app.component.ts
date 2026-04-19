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
  private readonly portfolioDataService = inject(PortfolioDataService);

  skills: { label: string; url: string }[] = [];
  githubUrl = '';
  linkedinUrl = '';
  cvUrl = '';

  ngOnInit(): void {
    this.portfolioDataService.getMyPcSkills().subscribe((skills) => {
      this.skills = skills;
    });

    this.portfolioDataService.getMyPcLinks().subscribe((links) => {
      this.githubUrl = links.githubUrl;
      this.linkedinUrl = links.linkedinUrl;
      this.cvUrl = links.cvUrl;
    });
  }
}