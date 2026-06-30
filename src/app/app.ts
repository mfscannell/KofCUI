import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { NavFooterComponent } from './components/nav-footer/nav-footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavMenuComponent, NavFooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('TestAngularUI');
}
