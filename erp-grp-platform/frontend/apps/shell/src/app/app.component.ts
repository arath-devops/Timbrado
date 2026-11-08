import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="shell">
      <header class="top">
        <a routerLink="/" class="brand">ERP+GRP</a>
        <nav>
          <a routerLink="/erp">ERP</a>
          <a routerLink="/grp">GRP</a>
        </nav>
      </header>
      <main>
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .shell { min-height: 100vh; display: grid; grid-template-rows: auto 1fr; }
    .top {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1rem 2rem; border-bottom: 1px solid rgba(255,255,255,.08);
      backdrop-filter: blur(8px);
    }
    .brand {
      font-family: var(--font-display);
      font-size: 1.4rem;
      letter-spacing: .04em;
      font-weight: 700;
    }
    nav { display: flex; gap: 1.25rem; color: var(--muted); }
    main { padding: 2rem; }
  `],
})
export class AppComponent {}
