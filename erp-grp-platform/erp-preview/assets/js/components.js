/* Componentes UI preview — líneas, tabs, match 3-way, crédito */
(function () {
  window.linesTable = function (opts) {
    const cols = opts.cols; // [{key,label,type,width}]
    const rows = opts.rows || [];
    const editable = !!opts.editable;
    const id = opts.id || 'lines';
    const head = cols.map((c) => `<th>${c.label || L(c.key)}</th>`).join('') + (editable ? '<th></th>' : '');
    const body = rows.map((r, i) => `<tr data-i="${i}">${cols.map((c) => {
      const v = r[c.key] ?? '';
      if (!editable) return `<td>${c.money ? ERPDemo.money(v) : v}</td>`;
      if (c.type === 'select' && c.options) {
        return `<td><select class="control line-input" data-k="${c.key}">${c.options.map((o) =>
          `<option value="${o}" ${String(o) === String(v) ? 'selected' : ''}>${o}</option>`).join('')}</select></td>`;
      }
      return `<td><input class="control line-input" data-k="${c.key}" type="${c.type || 'text'}" value="${v}"/></td>`;
    }).join('')}${editable ? `<td><button type="button" class="btn btn-ghost btn-sm" data-rm="${i}">✕</button></td>` : ''}</tr>`).join('');

    return `<div class="lines-wrap" id="${id}">
      <div class="toolbar"><strong>Líneas</strong>
        ${editable ? `<button type="button" class="btn btn-secondary btn-sm" data-add="${id}">+ Línea</button>` : ''}
        <span class="spacer"></span>
        <span class="chip" id="${id}-total">Total: ${ERPDemo.money(opts.total || sumLines(rows, opts.qtyKey || 'qty', opts.priceKey || 'price'))}</span>
      </div>
      <div class="table-wrap"><table class="data" id="${id}-table"><thead><tr>${head}</tr></thead><tbody>${body || '<tr><td colspan="99" class="empty">Sin líneas</td></tr>'}</tbody></table></div>
    </div>`;
  };

  function sumLines(rows, qk, pk) {
    return (rows || []).reduce((s, r) => s + (Number(r[qk]) || 0) * (Number(r[pk]) || 0), 0);
  }

  window.bindLinesTable = function (id, state) {
    const root = document.getElementById(id);
    if (!root) return;
    root.addEventListener('click', (e) => {
      if (e.target.dataset.add === id) {
        state.rows.push(Object.assign({}, state.blank || {}));
        rerender();
      }
      if (e.target.dataset.rm != null) {
        state.rows.splice(Number(e.target.dataset.rm), 1);
        rerender();
      }
    });
    root.addEventListener('input', (e) => {
      if (!e.target.classList.contains('line-input')) return;
      const tr = e.target.closest('tr');
      const i = Number(tr.dataset.i);
      state.rows[i][e.target.dataset.k] = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
      const tot = sumLines(state.rows, state.qtyKey || 'qty', state.priceKey || 'price');
      const el = document.getElementById(id + '-total');
      if (el) el.textContent = 'Total: ' + ERPDemo.money(tot);
      if (state.onChange) state.onChange(tot, state.rows);
    });
    function rerender() {
      const parent = root.parentNode;
      const html = linesTable({
        id, cols: state.cols, rows: state.rows, editable: true,
        qtyKey: state.qtyKey, priceKey: state.priceKey,
        total: sumLines(state.rows, state.qtyKey || 'qty', state.priceKey || 'price')
      });
      root.outerHTML = html;
      bindLinesTable(id, state);
    }
  };

  window.objectTabs = function (tabs, active) {
    // tabs: [{id,label,html}]
    const act = active || tabs[0].id;
    return `<div class="tabs" role="tablist">${tabs.map((t) =>
      `<button type="button" class="tab ${t.id === act ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>`
    ).join('')}</div>
    <div class="tab-panels">${tabs.map((t) =>
      `<div class="tab-panel ${t.id === act ? 'active' : ''}" data-panel="${t.id}">${t.html}</div>`
    ).join('')}</div>`;
  };

  window.bindObjectTabs = function (root) {
    const el = typeof root === 'string' ? document.querySelector(root) : root;
    if (!el) return;
    el.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-tab]');
      if (!btn) return;
      const id = btn.dataset.tab;
      el.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === id));
      el.querySelectorAll('.tab-panel').forEach((p) => p.classList.toggle('active', p.dataset.panel === id));
    });
  };

  window.matchPanel = function (inv) {
    if (!inv || !inv.match) {
      return `<div class="alert">Match 3-way no aplica (factura sin OC) · status ${inv ? inv.match_status : '—'}</div>`;
    }
    const m = inv.match;
    const ok = m.qty_ok && m.amt_ok;
    return `<div class="match-panel ${ok ? 'ok' : 'bad'}">
      <div class="match-hd"><strong>Match 3-way</strong> ${ok ? statusChip('MATCHED') : '<span class="badge b-danger">Descuadre</span>'}
        <span class="hint">tolerancia ±${m.tolerance_pct}%</span></div>
      <div class="match-grid">
        <div><div class="l">OC (${inv.po_id || '—'})</div><div class="v">${ERPDemo.money(m.po_amount)}</div></div>
        <div><div class="l">Recepción (${inv.gr_id || '—'})</div><div class="v">${ERPDemo.money(m.gr_amount)}</div></div>
        <div><div class="l">Factura (${inv.id})</div><div class="v">${ERPDemo.money(m.inv_amount)}</div></div>
      </div>
      <div class="match-flags">Cantidad: ${m.qty_ok ? '✓' : '✗'} · Importe: ${m.amt_ok ? '✓' : '✗'}</div>
    </div>`;
  };

  window.creditBanner = function (customer, orderAmount) {
    if (!customer) return '';
    const headroom = (customer.credit_limit || 0) - (customer.credit_exposure || 0);
    const wouldBlock = customer.credit_block || (orderAmount != null && orderAmount > headroom);
    if (customer.credit_block) {
      return `<div class="alert danger"><strong>Crédito bloqueado</strong> · ${customer.code} ${customer.name}
        · Límite ${ERPDemo.money(customer.credit_limit)} · Exposición ${ERPDemo.money(customer.credit_exposure)}
        · No confirmar pedido / facturar.</div>`;
    }
    if (wouldBlock) {
      return `<div class="alert danger"><strong>Excede crédito disponible</strong>
        · Disponible ${ERPDemo.money(headroom)} · Pedido ${ERPDemo.money(orderAmount)}
        · Requiere aprobación crédito (simulado).</div>`;
    }
    return `<div class="alert">Crédito OK · Límite ${ERPDemo.money(customer.credit_limit)}
      · Exposición ${ERPDemo.money(customer.credit_exposure)}
      · Disponible ${ERPDemo.money(headroom)}</div>`;
  };

  window.fieldL = function (key, controlHtml, req, full, hint) {
    return `<div class="field${full ? ' full' : ''}">
      <label${req ? ' class="req"' : ''}>${L(key)} <span class="tech" title="${key}">${key}</span></label>
      ${controlHtml}${hint ? `<span class="hint">${hint}</span>` : ''}
    </div>`;
  };

  window.auditStub = function (ref) {
    return `<div class="table-wrap"><table class="data"><thead><tr><th>Cuándo</th><th>Usuario</th><th>Acción</th><th>Detalle</th></tr></thead>
      <tbody>
        <tr><td>2026-11-06 16:02</td><td>clopez</td><td>UPDATE</td><td class="mono">${ref} → PENDING_APPROVAL</td></tr>
        <tr><td>2026-11-06 15:40</td><td>clopez</td><td>CREATE</td><td class="mono">${ref}</td></tr>
      </tbody></table></div>`;
  };

  window.docsStub = function (ref) {
    return `<div class="table-wrap"><table class="data"><thead><tr><th>Documento</th><th>Tipo</th><th>Versión</th><th>Estado</th></tr></thead>
      <tbody>
        <tr><td>DOC-${ref}-1</td><td>PDF</td><td>1</td><td>${statusChip('AVAILABLE')}</td></tr>
      </tbody></table></div>
      <a class="btn btn-secondary btn-sm" href="../administracion/subir.html" style="margin-top:8px">Subir evidencia</a>`;
  };

  window.wfStub = function (steps) {
    return `<div class="timeline">${(steps || []).map((s) =>
      `<div class="tl ${s.done ? 'done' : ''}"><h4>${s.title}</h4><p>${s.desc || ''}</p><time>${s.when || ''}</time></div>`
    ).join('')}</div>`;
  };
})();
