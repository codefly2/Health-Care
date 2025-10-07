<<<<<<< HEAD
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
=======
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Import Lenis
import Lenis from '@studio-freight/lenis';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// // Initialize Lenis
// const lenis = new Lenis({
//   lerp: 0.05 // Adjust for smoothness
// });

// function raf(time: number) {
//   lenis.raf(time);
//   requestAnimationFrame(raf);
// }

// requestAnimationFrame(raf);
>>>>>>> 78a6236a2e1a53df252955f96c2d0007da8cbb90
