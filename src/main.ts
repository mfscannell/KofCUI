// import { platformBrowser } from '@angular/platform-browser';
// import { AppModule } from './app/app.module';

// platformBrowser().bootstrapModule(AppModule)
//   .catch(err => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
//import { App } from '@app/app';
import { AppComponent } from '@app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));