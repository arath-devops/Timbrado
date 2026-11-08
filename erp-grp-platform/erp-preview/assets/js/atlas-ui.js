/* Render helpers for module atlas preview */
(function () {
  function reqBadge(req) {
    if (req === true || req === 'Sí') return '<span class="req-pill req-yes">Obligatorio</span>';
    if (req === 'cond' || req === 'Condicional') return '<span class="req-pill req-cond">Condicional</span>';
    return '<span class="req-pill req-no">Opcional</span>';
  }

  function mockWire(screen) {
    const fields = (screen.fields || []).filter((f) => f.req === true || f.req === 'cond').slice(0, 10);
    if (screen.mock === 'stub') {
      return `<div class="wire stub-wire"><p>Módulo fuera del Freeze — stub visual únicamente.</p></div>`;
    }
    if (screen.mock === 'dashboard') {
      return `<div class="wire">
        <div class="wire-kpis"><span></span><span></span><span></span><span></span></div>
        <div class="wire-panels"><div></div><div></div></div>
      </div>`;
    }
    if (screen.mock === 'table' || screen.mock === 'inbox') {
      return `<div class="wire">
        <div class="wire-toolbar"><span class="wbar"></span><span class="wbtn"></span></div>
        <div class="wire-table">${[1,2,3,4].map(() => '<div class="wrow"></div>').join('')}</div>
      </div>`;
    }
    if (screen.mock === 'doc-lines') {
      return `<div class="wire">
        <div class="wire-form">${fields.slice(0, 6).map((f) =>
          `<div class="wfield ${f.req === true ? 'req' : ''}"><em>${f.label}</em><i></i></div>`).join('')}</div>
        <div class="wire-lines"><strong>Líneas</strong>${[1,2,3].map(() => '<div class="wrow"></div>').join('')}</div>
      </div>`;
    }
    /* form default */
    return `<div class="wire">
      <div class="wire-form">${fields.map((f) =>
        `<div class="wfield ${f.req === true ? 'req' : ''}"><em>${f.label}</em><i></i></div>`).join('')}</div>
    </div>`;
  }

  window.renderModuleCards = function (filter) {
    const mods = ERPModules.modules.filter((m) => {
      if (filter === 'in') return m.freeze === 'IN';
      if (filter === 'out') return m.freeze === 'OUT';
      return true;
    });
    return `<div class="mod-grid">${mods.map((m) => {
      const nReq = m.screens.reduce((s, sc) => s + sc.fields.filter((f) => f.req === true).length, 0);
      return `<a class="mod-card ${m.freeze === 'OUT' ? 'out' : ''}" href="detalle.html?m=${m.id}" style="--mod:${m.color}">
        <div class="mod-card-top">
          <span class="mod-freeze">${m.freeze === 'IN' ? 'DENTRO Freeze' : 'FUERA release-1'}</span>
          <strong>${m.name}</strong>
          <p>${m.tagline}</p>
        </div>
        <div class="mod-card-meta">
          <span>${m.screens.length} pantallas</span>
          <span>${nReq} campos obligatorios</span>
        </div>
      </a>`;
    }).join('')}</div>`;
  };

  window.renderModuleDetail = function (mod) {
    if (!mod) {
      return `<div class="alert danger">Módulo no encontrado. <a href="index.html">Volver al atlas</a></div>`;
    }
    const totalReq = mod.screens.reduce((s, sc) => s + sc.fields.filter((f) => f.req === true).length, 0);
    const totalCond = mod.screens.reduce((s, sc) => s + sc.fields.filter((f) => f.req === 'cond').length, 0);

    return crumbs([{ label: 'Atlas módulos', href: 'index.html' }, { label: mod.name }]) +
      pageHead(mod.name, mod.tagline + ' · ' + ERPModules.meta.scope,
        `${mod.freeze === 'IN'
          ? '<span class="badge b-ok">DENTRO Freeze</span>'
          : '<span class="badge b-warn">FUERA release-1</span>'}
         <a class="btn btn-secondary btn-sm" href="${mod.hub}">Abrir hub del módulo</a>
         <a class="btn btn-ghost btn-sm" href="index.html">Todos los módulos</a>`) +
      `<div class="kpi-row">
        <div class="kpi"><div class="l">Pantallas</div><div class="v">${mod.screens.length}</div></div>
        <div class="kpi"><div class="l">Campos obligatorios</div><div class="v">${totalReq}</div></div>
        <div class="kpi"><div class="l">Condicionales</div><div class="v">${totalCond}</div></div>
        <div class="kpi"><div class="l">Fuente</div><div class="v" style="font-size:14px">FM-001</div><div class="d">+ Control Pack</div></div>
      </div>` +
      mod.screens.map((sc) => `
        <section class="screen-block" id="${sc.id}">
          <div class="screen-block-hd">
            <div>
              <h3>${sc.name}</h3>
              <p>${sc.purpose}</p>
            </div>
            <a class="btn btn-primary btn-sm" href="${sc.href}">Ver UI preview</a>
          </div>
          <div class="screen-block-bd">
            <div class="screen-preview">
              <div class="preview-label">Boceto de pantalla</div>
              ${mockWire(sc)}
            </div>
            <div class="screen-fields">
              <div class="preview-label">Campos necesarios</div>
              <div class="table-wrap"><table class="data fields-table">
                <thead><tr><th>Campo UI</th><th>API key</th><th>Tipo</th><th>Requerido</th><th>Nota</th></tr></thead>
                <tbody>${sc.fields.map((f) => `<tr>
                  <td><strong>${f.label}</strong></td>
                  <td><code class="mono">${f.key}</code></td>
                  <td>${f.type}</td>
                  <td>${reqBadge(f.req)}</td>
                  <td class="muted">${f.note || '—'}</td>
                </tr>`).join('')}</tbody>
              </table></div>
            </div>
          </div>
        </section>`).join('');
  };

  window.renderFieldsSummary = function () {
    const rows = [];
    ERPModules.modules.filter((m) => m.freeze === 'IN').forEach((m) => {
      m.screens.forEach((sc) => {
        sc.fields.filter((f) => f.req === true).forEach((f) => {
          rows.push({ mod: m.name, screen: sc.name, ...f });
        });
      });
    });
    return rows;
  };
})();
