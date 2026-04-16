import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { animate, group, query, style, transition, trigger } from "@angular/animations";
import { LanguageService } from "./core/services/language.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  animations: [
    trigger("routeFade", [
      transition("* <=> *", [
        query(
          ":enter, :leave",
          [
            style({
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }),
          ],
          { optional: true }
        ),
        query(":enter", [style({ opacity: 0 })], { optional: true }),
        group([
          query(":leave", [animate("180ms ease", style({ opacity: 0 }))], { optional: true }),
          query(":enter", [animate("260ms ease", style({ opacity: 1 }))], { optional: true }),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent {
  private languageService = inject(LanguageService);
  currentRoute = "root";

  onRouteActivate(outlet: RouterOutlet): void {
    this.currentRoute = outlet.activatedRoute?.routeConfig?.path ?? "root";
  }

  ngOnInit(): void {
    this.languageService.initLang();
  }
}