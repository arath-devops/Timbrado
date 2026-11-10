(() => {
  const token = sessionStorage.getItem('erp_access_token');
  const userRaw = sessionStorage.getItem('erp_user');
  if (!token || !userRaw) {
    location.replace('/login.html');
    return;
  }

  let user;
  try {
    user = JSON.parse(userRaw);
  } catch {
    location.replace('/login.html');
    return;
  }

  const companyLabel = document.getElementById('companyLabel');
  const userLabel = document.getElementById('userLabel');
  const menuNav = document.getElementById('menuNav');
  const drawer = document.getElementById('drawer');
  const scrim = document.getElementById('scrim');
  const menuBtn = document.getElementById('menuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const kpiGrid = document.getElementById('kpiGrid');
  const quickLinks = document.getElementById('quickLinks');
  const statusLine = document.getElementById('statusLine');
  const pages = {
    dashboard: document.querySelector('[data-page="dashboard"]'),
    stub: document.querySelector('[data-page="stub"]')
  };
  const stubTitle = document.getElementById('stubTitle');
  const backHomeBtn = document.getElementById('backHomeBtn');

  companyLabel.textContent = user.companyName || user.companyCode || 'Empresa';
  userLabel.textContent = user.displayName || user.username || 'Usuario';

  const setDrawer = (open) => {
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    scrim.hidden = !open;
    requestAnimationFrame(() => scrim.classList.toggle('is-open', open));
  };

  menuBtn.addEventListener('click', () => setDrawer(true));
  closeMenuBtn.addEventListener('click', () => setDrawer(false));
  scrim.addEventListener('click', () => setDrawer(false));
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('erp_access_token');
    sessionStorage.removeItem('erp_user');
    sessionStorage.removeItem('erp_menus');
    location.replace('/login.html');
  });
  backHomeBtn.addEventListener('click', () => showDashboard());

  const showDashboard = () => {
    pages.dashboard.hidden = false;
    pages.stub.hidden = true;
    document.title = 'ERP · Inicio';
    menuNav.querySelectorAll('.menu-link').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.route === '/dashboard');
    });
  };

  const showStub = (label, route) => {
    pages.dashboard.hidden = true;
    pages.stub.hidden = false;
    stubTitle.textContent = label || 'Módulo';
    document.title = 'ERP · ' + (label || 'Módulo');
    menuNav.querySelectorAll('.menu-link').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.route === route);
    });
    setDrawer(false);
  };

  const flattenItems = (sections) => {
    const items = [];
    (sections || []).forEach((section) => {
      (section.children || []).forEach((child) => items.push(child));
    });
    return items;
  };

  const renderMenu = (sections) => {
    menuNav.innerHTML = '';
    (sections || []).forEach((section) => {
      const title = document.createElement('div');
      title.className = 'menu-section';
      title.textContent = section.label || section.id;
      menuNav.appendChild(title);
      (section.children || []).forEach((item) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'menu-link';
        btn.textContent = item.label;
        btn.dataset.route = item.route || '';
        btn.dataset.id = item.id || '';
        btn.addEventListener('click', () => {
          if ((item.route || '') === '/dashboard' || item.id === 'dashboard') {
            showDashboard();
            setDrawer(false);
            return;
          }
          showStub(item.label, item.route);
        });
        menuNav.appendChild(btn);
      });
    });
  };

  const renderDashboard = (sections) => {
    const items = flattenItems(sections);
    const moduleCount = new Set(items.map((i) => i.module).filter(Boolean)).size;
    const sectionCount = (sections || []).length;
    const kpis = [
      { label: 'Módulos visibles', value: String(moduleCount), hint: 'Según tus permisos' },
      { label: 'Secciones de menú', value: String(sectionCount), hint: 'Menú hamburguesa' },
      { label: 'Pendientes', value: '—', hint: 'Stub · workflow después' },
      { label: 'Alertas', value: '0', hint: 'Sin alertas demo' }
    ];
    kpiGrid.innerHTML = kpis.map((k) => `
      <article class="kpi">
        <div class="label">${k.label}</div>
        <div class="value">${k.value}</div>
        <div class="hint">${k.hint}</div>
      </article>
    `).join('');

    const quick = items.filter((i) => i.id !== 'dashboard').slice(0, 6);
    quickLinks.innerHTML = '';
    if (!quick.length) {
      quickLinks.textContent = 'No hay accesos adicionales para este usuario.';
      return;
    }
    quick.forEach((item) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = item.label;
      chip.addEventListener('click', () => showStub(item.label, item.route));
      quickLinks.appendChild(chip);
    });
  };

  const loadMenus = async () => {
    const cached = sessionStorage.getItem('erp_menus');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch { /* fetch fresh */ }
    }
    const res = await fetch('/api/v1/me/menus', {
      headers: { Authorization: 'Bearer ' + token }
    });
    if (res.status === 401) {
      location.replace('/login.html');
      return null;
    }
    if (!res.ok) {
      throw new Error('No se pudo cargar el menú (' + res.status + ')');
    }
    const data = await res.json();
    sessionStorage.setItem('erp_menus', JSON.stringify(data.items || []));
    return data.items || [];
  };

  (async () => {
    try {
      const sections = await loadMenus();
      if (!sections) return;
      renderMenu(sections);
      renderDashboard(sections);
      statusLine.textContent =
        (user.displayName || 'Usuario') + ' · ' +
        flattenItems(sections).length + ' opciones de menú disponibles.';
      showDashboard();
    } catch (ex) {
      statusLine.textContent = ex.message || 'Error al cargar el menú';
    }
  })();
})();
