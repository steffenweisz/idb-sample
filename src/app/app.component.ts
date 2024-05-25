import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ItemsComponent } from "./items/items.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ItemsComponent],
  template: `
    <h1>IndexDB Test</h1>
    <app-items></app-items>
  `,
  styles: [],
})
export class AppComponent {
  title = "idb-sample";
}
