const navLinks = document.querySelectorAll('.nav-link');
const dashboards = document.querySelectorAll('.dashboard');
const projectTableBody = document.getElementById('projectTableBody');
const constructionTableBody = document.getElementById('constructionTableBody');
const mechanicalTableBody = document.getElementById('mechanicalTableBody');
const assignmentTableBody = document.getElementById('assignmentTableBody');
const requestGrid = document.getElementById('requestGrid');
const projectInfo = document.getElementById('projectInfo');
const productTableBody = document.getElementById('productTableBody');
const offerTotal = document.getElementById('offerTotal');
const paymentTotal = document.getElementById('paymentTotal');
const timeline = document.getElementById('timeline');
const visitLog = document.getElementById('visitLog');
const offerLog = document.getElementById('offerLog');
const paymentLog = document.getElementById('paymentLog');
const constructionProfile = document.getElementById('constructionProfile');
const mechanicalProfile = document.getElementById('mechanicalProfile');
const projectSearch = document.getElementById('projectSearch');
const constructionSearch = document.getElementById('constructionSearch');
const mechanicalSearch = document.getElementById('mechanicalSearch');
const newRecordBtn = document.getElementById('newRecordBtn');
const newRecordModal = document.getElementById('newRecordModal');
const closeModal = document.getElementById('closeModal');

const counts = {
  TOKİ: document.getElementById('tokiCount'),
  'Emlak Konut': document.getElementById('emlakCount'),
  Özel: document.getElementById('privateCount'),
  Kamu: document.getElementById('publicCount'),
};

const projects = [
  {
    id: 'PRJ-001',
    addedAt: '2025-02-12',
    updatedAt: '2025-03-10',
    category: 'TOKİ',
    city: 'Adana',
    name: 'Adana Sarıçam 500 Konut Projesi',
    contractor: 'ADA Group',
    mechanical: 'Ada Mekanik',
    salesStatus: 'Teklif Verildi',
    manager: 'Çiğdem Tuna',
    channel: 'direct',
    scope: '500 Konut + Sosyal Alan',
    responsibleInstitution: 'TOKİ',
    progress: 'Teklif değerlendirme aşamasında',
    assignedTeam: 'Proje Satış',
  },
  {
    id: 'PRJ-002',
    addedAt: '2025-01-25',
    updatedAt: '2025-02-28',
    category: 'Emlak Konut',
    city: 'İstanbul',
    name: 'İstanbul Finans Şehri Kuleleri',
    contractor: '123 Yapı A.Ş.',
    mechanical: 'Breeze Mekanik',
    salesStatus: 'Sipariş Alındı',
    manager: 'Metehan Kargılı',
    channel: 'dealer',
    channelName: 'İstanbul Anadolu Bayi',
    scope: 'Ofis + Rezidans',
    responsibleInstitution: 'Emlak Konut GYO',
    progress: 'Malzeme sevkiyatı planlanıyor',
    assignedTeam: 'Mega Projeler',
  },
  {
    id: 'PRJ-003',
    addedAt: '2024-12-14',
    updatedAt: '2025-02-10',
    category: 'Özel',
    city: 'Ankara',
    name: 'Ankara Karma Yaşam Alanı',
    contractor: 'Mira İnşaat',
    mechanical: 'Mira Tesisat',
    salesStatus: 'Görüşme',
    manager: 'Çiğdem Tuna',
    channel: 'direct',
    scope: '250 Konut + AVM',
    responsibleInstitution: 'Özel',
    progress: 'Mimari revizyon bekleniyor',
    assignedTeam: 'Bölge Satış',
  },
  {
    id: 'PRJ-004',
    addedAt: '2024-11-02',
    updatedAt: '2025-01-15',
    category: 'Kamu',
    city: 'Trabzon',
    name: 'Trabzon Şehir Hastanesi Isıtma Projesi',
    contractor: 'Kuzey İnşaat',
    mechanical: 'Kuzey Teknik',
    salesStatus: 'Teklif Hazırlanıyor',
    manager: 'Metehan Kargılı',
    channel: 'dealer',
    channelName: 'Karadeniz Bölge Bayi',
    scope: 'Hastane Mekanik Tesisatı',
    responsibleInstitution: 'Sağlık Bakanlığı',
    progress: 'Keşif tamamlandı',
    assignedTeam: 'Kamu Projeleri',
  },
];

const projectProducts = {
  'PRJ-001': [
    { group: 'Plastik', offer: 480000, payment: 0, brand: 'Kalde' },
    { group: 'Esnek Flex', offer: 185000, payment: 0, brand: 'Kalde' },
    { group: 'Altyapı', offer: 325000, payment: 0, brand: 'Kalde' },
  ],
  'PRJ-002': [
    { group: 'Sessiz-TR', offer: 650000, payment: 350000, brand: 'Kalde' },
    { group: 'Metal', offer: 420000, payment: 200000, brand: 'Kalde' },
    { group: 'Radyatör', offer: 280000, payment: 0, brand: 'ECA' },
  ],
  'PRJ-003': [
    { group: 'Plastik Kolektör', offer: 210000, payment: 0, brand: 'Kalde' },
    { group: 'Ankastre Vana', offer: 98000, payment: 0, brand: 'Kalde' },
  ],
  'PRJ-004': [
    { group: 'Metal', offer: 510000, payment: 120000, brand: 'Kalde' },
    { group: 'Altyapı', offer: 380000, payment: 0, brand: 'Kalde' },
  ],
};

const projectTimeline = {
  'PRJ-001': [
    {
      title: 'Keşif ziyareti gerçekleştirildi',
      date: '12 Şubat 2025',
      notes: 'Ada Group şantiye alanı yerinde incelendi. Mekanik ekiplerle ihtiyaç listesi çıkarıldı.',
    },
    {
      title: 'Teklif teslim edildi',
      date: '28 Şubat 2025',
      notes: 'TOKİ ihalesi kapsamında PVC boru ve radyatör ürün grubu için teklif iletildi.',
    },
    {
      title: 'Geri bildirim bekleniyor',
      date: '10 Mart 2025',
      notes: 'Proje değerlendirme kurulunun dönüşü beklenecek. Takip randevusu 18 Mart olarak planlandı.',
    },
  ],
  'PRJ-002': [
    {
      title: 'Bayi ile koordinasyon toplantısı',
      date: '15 Ocak 2025',
      notes: 'İstanbul Anadolu Bayi proje lojistiğini üstlenecek. Sevkiyat planı çıkarıldı.',
    },
    {
      title: 'Sipariş onayı alındı',
      date: '28 Şubat 2025',
      notes: 'Ürün teslimatı 15 Mart için planlandı. Finans departmanına bilgi verildi.',
    },
  ],
  'PRJ-003': [
    {
      title: 'Konsept sunumu yapıldı',
      date: '20 Ocak 2025',
      notes: 'Mimarlar ve mekanik ekip ile ürün seçimi değerlendirildi.',
    },
  ],
  'PRJ-004': [
    {
      title: 'Karadeniz Bölge Bayi keşif yaptı',
      date: '8 Ocak 2025',
      notes: 'Hastane kazan dairesi ve altyapı hatları ölçüldü.',
    },
    {
      title: 'Teklif hazırlığı',
      date: '15 Ocak 2025',
      notes: 'Sağlık Bakanlığı teknik şartnamelerine göre ürün listesi oluşturuldu.',
    },
  ],
};

const visits = [
  {
    projectId: 'PRJ-001',
    date: '2025-02-12',
    company: 'ADA Group',
    contact: 'Ahmet Er',
    phone: '+90 555 123 45 67',
    notes: 'Şantiye keşfi yapıldı. Ürün listesi hazırlandı.',
  },
  {
    projectId: 'PRJ-002',
    date: '2025-01-15',
    company: '123 Yapı A.Ş.',
    contact: 'Mert Şahin',
    phone: '+90 555 987 65 43',
    notes: 'Bayi ile beraber toplantı gerçekleştirildi.',
  },
];

const offers = [
  {
    projectId: 'PRJ-001',
    date: '2025-02-28',
    company: 'ADA Group',
    contact: 'Ahmet Er',
    phone: 'ahmet.er@adagroup.com',
    notes: 'PVC boru ve flex ürünleri için 985.000₺ teklif edildi.',
  },
  {
    projectId: 'PRJ-004',
    date: '2025-01-20',
    company: 'Kuzey İnşaat',
    contact: 'Derya Kılıç',
    phone: '+90 312 400 22 11',
    notes: 'Hastane altyapısı için ürün kalemleri gönderildi.',
  },
];

const payments = [
  {
    projectId: 'PRJ-002',
    date: '2025-02-28',
    company: '123 Yapı A.Ş.',
    amount: 350000,
    method: 'Havale',
    notes: 'İlk parti sevkiyat için ön ödeme alındı.',
  },
  {
    projectId: 'PRJ-004',
    date: '2025-02-05',
    company: 'Karadeniz Bölge Bayi',
    amount: 120000,
    method: 'Dekont',
    notes: 'Bayi üzerinden tahsil edildi.',
  },
];

const constructionFirms = [
  {
    name: '1923 İnşaat A.Ş.',
    city: 'İstanbul',
    contact: 'Ahmet Er (Satın Alma)',
    status: 'Çalışıyor',
    owner: 'Çiğdem Tuna',
    ongoing: [
      { category: 'TOKİ', project: 'Adana Sarıçam 500 Konut Projesi', units: 500 },
      { category: 'Emlak Konut', project: 'İstanbul Finans Şehri Kuleleri', units: 420 },
    ],
    completed: [
      { category: 'Özel', project: 'Bursa Panorama Konutları', units: 180 },
    ],
  },
  {
    name: 'Kardelen Yapı',
    city: 'Ankara',
    contact: 'Elif Yurt',
    status: 'Teklif Aşaması',
    owner: 'Metehan Kargılı',
    ongoing: [
      { category: 'Kamu', project: 'Ankara Belediye Hizmet Binası', units: 1 },
    ],
    completed: [],
  },
];

const mechanicalFirms = [
  {
    name: 'ADA Group Mekanik',
    city: 'İstanbul',
    contact: 'Serkan Aydın',
    status: 'Çalışıyor',
    owner: 'Çiğdem Tuna',
    ongoing: [
      { category: 'TOKİ', project: 'Adana Sarıçam 500 Konut Projesi', units: 500 },
    ],
    completed: [],
  },
  {
    name: 'Breeze Mekanik',
    city: 'İstanbul',
    contact: 'Cemre Uğur',
    status: 'Sipariş Teslim Edildi',
    owner: 'Metehan Kargılı',
    ongoing: [
      { category: 'Emlak Konut', project: 'İstanbul Finans Şehri Kuleleri', units: 4 },
    ],
    completed: [
      { category: 'Özel', project: 'Ege Marina Rezidans', units: 120 },
    ],
  },
];

const assignments = [
  {
    date: '2025-03-10',
    person: 'Çiğdem Tuna',
    category: 'Proje',
    name: 'Adana Sarıçam 500 Konut Projesi',
    status: 'Takipte',
  },
  {
    date: '2025-03-05',
    person: 'Metehan Kargılı',
    category: 'İnşaat Firması',
    name: '1923 İnşaat A.Ş.',
    status: 'Aktif',
  },
  {
    date: '2025-02-18',
    person: 'Metehan Kargılı',
    category: 'Mekanik Firması',
    name: 'Breeze Mekanik',
    status: 'Sevkiyat',
  },
];

const requests = [
  {
    title: 'TOKİ Adana Teklif Revizyonu',
    owner: 'Çiğdem Tuna',
    due: '18 Mart 2025',
    status: 'Beklemede',
  },
  {
    title: 'Emlak Konut Finans Onayı',
    owner: 'Metehan Kargılı',
    due: '15 Mart 2025',
    status: 'Onay Sürecinde',
  },
  {
    title: 'Bayi Tahsilat Bildirimi',
    owner: 'Karadeniz Bölge Bayi',
    due: '20 Mart 2025',
    status: 'Ödeme Bekleniyor',
  },
];

let selectedProjectId = projects[0]?.id ?? null;

function formatCurrency(amount) {
  return amount.toLocaleString('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  });
}

function renderProjectTable(filterText = '') {
  const query = filterText.toLocaleLowerCase('tr-TR');
  const filteredProjects = projects.filter((project) => {
    const text = `${project.name} ${project.city} ${project.category}`.toLocaleLowerCase('tr-TR');
    return text.includes(query);
  });

  projectTableBody.innerHTML = filteredProjects
    .map((project) => {
      const statusClass = project.channel === 'direct' ? 'status-direct' : 'status-dealer';
      const channelLabel = project.channel === 'direct' ? 'Doğrudan' : `Bayi (${project.channelName ?? 'Belirtilmedi'})`;

      return `
        <tr data-project-id="${project.id}" class="${project.id === selectedProjectId ? 'is-active' : ''}">
          <td class="status-chip ${statusClass}">${channelLabel}</td>
          <td>${project.addedAt}</td>
          <td>${project.updatedAt}</td>
          <td>${project.category}</td>
          <td>${project.city}</td>
          <td>${project.name}</td>
          <td>${project.contractor}</td>
          <td>${project.mechanical}</td>
          <td>${project.salesStatus}</td>
          <td>${project.manager}</td>
        </tr>
      `;
    })
    .join('');

  const totals = { TOKİ: 0, 'Emlak Konut': 0, Özel: 0, Kamu: 0 };
  projects.forEach((project) => {
    if (totals[project.category] !== undefined) {
      totals[project.category] += 1;
    }
  });

  counts['TOKİ'].textContent = totals['TOKİ'];
  counts['Emlak Konut'].textContent = totals['Emlak Konut'];
  counts['Özel'].textContent = totals['Özel'];
  counts['Kamu'].textContent = totals['Kamu'];
}

function renderProjectDetail(projectId) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) return;
  selectedProjectId = projectId;

  projectInfo.innerHTML = `
    <dt>Proje Kodu</dt><dd>${project.id}</dd>
    <dt>Kategori</dt><dd>${project.category}</dd>
    <dt>İl</dt><dd>${project.city}</dd>
    <dt>Yüklenici</dt><dd>${project.contractor}</dd>
    <dt>Mekanik Yüklenici</dt><dd>${project.mechanical}</dd>
    <dt>Satış Durumu</dt><dd>${project.salesStatus}</dd>
    <dt>Bağlantı Türü</dt><dd>${project.channel === 'direct' ? 'Doğrudan' : `Bayi (${project.channelName ?? 'Belirtilmedi'})`}</dd>
    <dt>Kapsam</dt><dd>${project.scope}</dd>
    <dt>Sorumlu Kurum</dt><dd>${project.responsibleInstitution}</dd>
    <dt>Proje Sorumlusu</dt><dd>${project.manager}</dd>
    <dt>Atanan Ekip</dt><dd>${project.assignedTeam}</dd>
    <dt>İlerleme</dt><dd>${project.progress}</dd>
  `;

  const productRows = projectProducts[projectId] ?? [];
  let offerSum = 0;
  let paymentSum = 0;

  productTableBody.innerHTML = productRows.length
    ? productRows
        .map((product) => {
          offerSum += product.offer;
          paymentSum += product.payment;
          return `
            <tr>
              <td>${product.group}</td>
              <td>${formatCurrency(product.offer)}</td>
              <td>${product.payment ? formatCurrency(product.payment) : '-'}</td>
              <td>${product.brand}</td>
            </tr>
          `;
        })
        .join('')
    : '<tr><td colspan="4">Henüz ürün kaydı bulunmuyor.</td></tr>';

  offerTotal.textContent = productRows.length ? formatCurrency(offerSum) : '-';
  paymentTotal.textContent = productRows.length ? formatCurrency(paymentSum) : '-';

  const timelineItems = projectTimeline[projectId] ?? [];
  timeline.innerHTML = timelineItems.length
    ? timelineItems
        .map(
          (item) => `
            <article class="timeline-item">
              <strong>${item.title}</strong>
              <span>${item.date}</span>
              <p>${item.notes}</p>
            </article>
          `,
        )
        .join('')
    : '<p class="muted">Bu proje için henüz süreç kaydı oluşturulmadı.</p>';

  renderLogs();
  renderProjectTable(projectSearch.value);
}

function renderLogs() {
  renderLogList(visitLog, visits.filter((item) => item.projectId === selectedProjectId), (item) => `
    <strong>${item.company}</strong>
    <span>${new Date(item.date).toLocaleDateString('tr-TR')}</span>
    <p>${item.notes}</p>
    <span>Yetkili: ${item.contact}${item.phone ? ' • ' + item.phone : ''}</span>
  `);

  renderLogList(offerLog, offers.filter((item) => item.projectId === selectedProjectId), (item) => `
    <strong>${item.company}</strong>
    <span>${new Date(item.date).toLocaleDateString('tr-TR')}</span>
    <p>${item.notes}</p>
    <span>Yetkili: ${item.contact}${item.phone ? ' • ' + item.phone : ''}</span>
  `);

  renderLogList(paymentLog, payments.filter((item) => item.projectId === selectedProjectId), (item) => `
    <strong>${item.company}</strong>
    <span>${new Date(item.date).toLocaleDateString('tr-TR')} • ${formatCurrency(item.amount)}</span>
    <p>${item.notes}</p>
    <span>Ödeme Yöntemi: ${item.method}</span>
  `);
}

function renderLogList(target, items, templateFn) {
  if (!target) return;
  if (!items.length) {
    target.innerHTML = '<li class="muted">Henüz kayıt bulunmuyor.</li>';
    return;
  }

  target.innerHTML = items
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((item) => `<li class="log-item">${templateFn(item)}</li>`)
    .join('');
}

function renderFirmTable(target, items, searchText = '') {
  const query = searchText.toLocaleLowerCase('tr-TR');
  target.innerHTML = items
    .filter((item) => item.name.toLocaleLowerCase('tr-TR').includes(query))
    .map(
      (firm) => `
        <tr data-firm="${firm.name}">
          <td><button class="ghost-btn" data-action="view">Detay</button></td>
          <td>${firm.name}</td>
          <td>${firm.city}</td>
          <td>${firm.contact}</td>
          <td>${firm.status}</td>
          <td>${firm.owner}</td>
        </tr>
      `,
    )
    .join('');
}

function buildFirmProfile(firm) {
  const ongoing = firm.ongoing
    .map((item) => `<li><span>${item.category}</span><span>${item.project} (${item.units} konut)</span></li>`)
    .join('');
  const completed = firm.completed
    .map((item) => `<li><span>${item.category}</span><span>${item.project} (${item.units} konut)</span></li>`)
    .join('');

  return `
    <h3>${firm.name}</h3>
    <ul class="profile__list">
      <li><span>İl</span><span>${firm.city}</span></li>
      <li><span>Yetkili</span><span>${firm.contact}</span></li>
      <li><span>Çalışma Durumu</span><span>${firm.status}</span></li>
      <li><span>Sorumlu Personel</span><span>${firm.owner}</span></li>
    </ul>
    <div class="profile__group">
      <h4>Devam Eden Projeler</h4>
      <ul class="profile__list">${ongoing || '<li><span>-</span><span>Bilgi yok</span></li>'}</ul>
    </div>
    <div class="profile__group">
      <h4>Tamamlanan Projeler</h4>
      <ul class="profile__list">${completed || '<li><span>-</span><span>Bilgi yok</span></li>'}</ul>
    </div>
  `;
}

function renderAssignments() {
  assignmentTableBody.innerHTML = assignments
    .map(
      (item) => `
        <tr>
          <td>${item.date}</td>
          <td>${item.person}</td>
          <td>${item.category}</td>
          <td>${item.name}</td>
          <td>${item.status}</td>
        </tr>
      `,
    )
    .join('');
}

function renderRequests() {
  requestGrid.innerHTML = requests
    .map(
      (item) => `
        <article class="request-card">
          <h3>${item.title}</h3>
          <span>Sorumlu: <strong>${item.owner}</strong></span>
          <span>Termin: ${item.due}</span>
          <span>Durum: ${item.status}</span>
        </article>
      `,
    )
    .join('');
}

function addLogEntry(list, entry) {
  list.push(entry);
  renderLogs();
}

visitLog?.addEventListener?.('click', () => {});

function setupForms() {
  const visitForm = document.getElementById('visitForm');
  const offerForm = document.getElementById('offerForm');
  const paymentForm = document.getElementById('paymentForm');

  visitForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(visitForm);
    addLogEntry(visits, {
      projectId: selectedProjectId,
      date: formData.get('date'),
      company: formData.get('company'),
      contact: formData.get('contact'),
      phone: formData.get('phone'),
      notes: formData.get('notes'),
    });
    visitForm.reset();
  });

  offerForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(offerForm);
    addLogEntry(offers, {
      projectId: selectedProjectId,
      date: formData.get('date'),
      company: formData.get('company'),
      contact: formData.get('contact'),
      phone: formData.get('phone'),
      notes: formData.get('notes'),
    });
    offerForm.reset();
  });

  paymentForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(paymentForm);
    addLogEntry(payments, {
      projectId: selectedProjectId,
      date: formData.get('date'),
      company: formData.get('company'),
      amount: Number(formData.get('amount')),
      method: formData.get('method'),
      notes: formData.get('notes'),
    });
    paymentForm.reset();
  });
}

function setupNavigation() {
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const target = link.dataset.target;
      navLinks.forEach((item) => item.classList.toggle('active', item === link));
      dashboards.forEach((section) => {
        section.classList.toggle('hidden', section.dataset.view !== target);
      });
    });
  });
}

function setupProjectSelection() {
  projectTableBody.addEventListener('click', (event) => {
    const row = event.target.closest('tr[data-project-id]');
    if (!row) return;
    const projectId = row.dataset.projectId;
    renderProjectDetail(projectId);
  });
}

function setupFirmSelection() {
  constructionTableBody.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    if (!event.target.matches('button[data-action="view"]')) return;
    const row = event.target.closest('tr[data-firm]');
    if (!row) return;
    const firm = constructionFirms.find((item) => item.name === row.dataset.firm);
    if (!firm) return;
    constructionProfile.innerHTML = buildFirmProfile(firm);
  });

  mechanicalTableBody.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    if (!event.target.matches('button[data-action="view"]')) return;
    const row = event.target.closest('tr[data-firm]');
    if (!row) return;
    const firm = mechanicalFirms.find((item) => item.name === row.dataset.firm);
    if (!firm) return;
    mechanicalProfile.innerHTML = buildFirmProfile(firm);
  });
}

function setupSearch() {
  projectSearch?.addEventListener('input', (event) => {
    renderProjectTable(event.target.value);
  });

  constructionSearch?.addEventListener('input', (event) => {
    renderFirmTable(constructionTableBody, constructionFirms, event.target.value);
  });

  mechanicalSearch?.addEventListener('input', (event) => {
    renderFirmTable(mechanicalTableBody, mechanicalFirms, event.target.value);
  });
}

function setupModal() {
  newRecordBtn?.addEventListener('click', () => {
    newRecordModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });

  const close = () => {
    newRecordModal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  closeModal?.addEventListener('click', close);
  newRecordModal?.addEventListener('click', (event) => {
    if (event.target === newRecordModal) close();
  });
}

function init() {
  renderProjectTable();
  renderProjectDetail(selectedProjectId);
  renderFirmTable(constructionTableBody, constructionFirms);
  renderFirmTable(mechanicalTableBody, mechanicalFirms);
  renderAssignments();
  renderRequests();
  setupNavigation();
  setupProjectSelection();
  setupFirmSelection();
  setupForms();
  setupSearch();
  setupModal();
}

init();
