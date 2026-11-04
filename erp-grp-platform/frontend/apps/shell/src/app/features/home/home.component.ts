import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <p class="eyebrow">Plataforma Enterprise</p>
      <h1>Suite integrada ERP + GRP</h1>
      <p class="lead">
        Multitenant, multiempresa, multimoneda y multiidioma para gobierno y sector privado.
      </p>
      <div class="cta">
        <a class="primary" routerLink="/erp">Entrar a ERP</a>
        <a class="secondary" routerLink="/grp">Entrar a GRP</a>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      max-width: 780px;
      padding: 4rem 0 2rem;
      animation: rise .7s ease both;
    }
    .eyebrow { color: var(--brand-2); text-transform: uppercase; letter-spacing: .14em; font-size: .75rem; }
    h1 {
      font-family: var(--font-display);
      font-size: clamp(2.4rem, 5vw, 4rem);
      line-height: 1.05;
      margin: .4rem 0 1rem;
    }
    .lead { color: var(--muted); font-size: 1.15rem; max-width: 42rem; }
    .cta { display: flex; gap: .8rem; margin-top: 1.8rem; flex-wrap: wrap; }
    .primary { background: var(--brand); color: white; padding: .85rem 1.2rem; border-radius: 8px; }
    .secondary { background: transparent; color: var(--ink); border: 1px solid rgba(255,255,255,.25); padding: .85rem 1.2rem; border-radius: 8px; }
    @keyframes rise {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class HomeComponent {}
