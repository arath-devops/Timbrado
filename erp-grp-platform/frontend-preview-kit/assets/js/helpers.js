window.ERPUI = {
  money(n) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n || 0);
  },
  statusBadge(status) {
    const map = {
      ACTIVE: 'success', Activa: 'success', Activo: 'success', AVAILABLE: 'success', APPROVED: 'success', Aprobada: 'success',
      COMMITTED: 'info', ORDERED: 'info', RECEIVED: 'info', PAID: 'success', LIQUIDADO: 'success', COMPLETA: 'success',
      OPEN: 'warning', IN_APPROVAL: 'warning', SUBMITTED: 'warning', PENDIENTE_COMMIT: 'warning', PROGRAMADO: 'warning',
      PARTIAL_RECEIPT: 'warning', PARCIAL: 'warning', EN_TRAMITE: 'warning', ABIERTO: 'info',
      REJECTED: 'danger', Rechazada: 'danger', LOCKED: 'danger', DISABLED: 'danger', PENDIENTE_CFDI: 'danger',
      DRAFT: 'neutral', CERRADA: 'neutral', CERRADO: 'neutral', CONFIRMADA: 'success'
    };
    const tone = map[status] || 'neutral';
    return `<span class="badge badge-${tone}">${status}</span>`;
  },
  pageHeader(title, subtitle, actionsHtml = '') {
    return `<div class="page-header">
      <div><h1>${title}</h1><p>${subtitle || ''}</p></div>
      <div class="page-actions">${actionsHtml}</div>
    </div>`;
  },
  crumbs(items) {
    return `<nav class="breadcrumbs">${items.map((c, i) =>
      i < items.length - 1
        ? `<a href="${c.href || '#'}">${c.label}</a><span class="sep">/</span>`
        : `<span>${c.label}</span>`
    ).join('')}</nav>`;
  },
  toast(msg) {
    const host = document.getElementById('toast-host');
    if (!host) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    host.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  },
  table(headers, rowsHtml) {
    return `<div class="table-wrap"><table class="data"><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
  },
  empty(msg) {
    return `<div class="empty">${msg}</div>`;
  },
  orgFiltered(type) {
    return ERP.orgUnits.filter((o) => o.type === type);
  },
  historyPanel(entity) {
    return `<div class="panel"><div class="panel-hd"><h3>Historial</h3></div><div class="panel-bd">
      <div class="timeline">
        <div class="tl-item done"><div class="tl-dot"></div><h4>Registro creado</h4><p>${entity} dado de alta en el padrón municipal.</p><time>12 Ene 2025 · sistema</time></div>
        <div class="tl-item done"><div class="tl-dot"></div><h4>Actualización de titular</h4><p>Cambio de responsable registrado.</p><time>03 Mar 2026 · mrios</time></div>
        <div class="tl-item done"><div class="tl-dot"></div><h4>Revisión Contraloría</h4><p>Estructura validada para ejercicio 2026.</p><time>18 Ago 2026 · pnunez</time></div>
      </div>
    </div></div>`;
  }
};
