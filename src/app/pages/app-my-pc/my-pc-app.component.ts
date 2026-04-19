import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-my-pc-app',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './my-pc-app.component.html',
  styleUrls: ['./my-pc-app.component.scss'],
})
export class MyPcAppComponent {
  readonly skills = [
    { label: 'Spring Boot', url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/' },
    { label: 'Java', url: 'https://docs.oracle.com/en/java/' },
    { label: 'SQL', url: 'https://www.postgresql.org/docs/current/sql.html' },
    { label: 'Android', url: 'https://developer.android.com/docs' },
    { label: 'Git', url: 'https://git-scm.com/doc' },
    { label: 'Docker', url: 'https://docs.docker.com/' },
    { label: 'Flutter', url: 'https://docs.flutter.dev' },
    { label: 'Angular', url: 'https://angular.io/docs' },
    { label: 'Supabase', url: 'https://supabase.com/docs' },
  ];

  readonly githubUrl = 'https://github.com/aperezm1';
  readonly linkedinUrl = 'https://www.linkedin.com/';
  readonly cvUrl = '/assets/docs/cv-adrian.pdf';
}