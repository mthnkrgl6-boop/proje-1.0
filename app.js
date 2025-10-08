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
const projectSelector = document.getElementById('projectSelector');
const newProjectBtn = document.getElementById('newProjectBtn');
const editProjectBtn = document.getElementById('editProjectBtn');
const deleteProjectBtn = document.getElementById('deleteProjectBtn');
const projectForm = document.getElementById('projectForm');
const productForm = document.getElementById('productForm');
const timelineForm = document.getElementById('timelineForm');

const counts = {
  TOKİ: document.getElementById('tokiCount'),
  'Emlak Konut': document.getElementById('emlakCount'),
  Özel: document.getElementById('privateCount'),
  Kamu: document.getElementById('publicCount'),
};

const projectStore = [
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
    channelName: '',
    scope: '500 Konut + Sosyal Alan',
    responsibleInstitution: 'TOKİ',
    progress: 'Teklif değerlendirme aşamasında',
    assignedTeam: 'Proje Satış',
    products: [
      { id: 'prod-001-1', group: 'Plastik', offer: 480000, payment: 0, brand: 'Kalde' },
      { id: 'prod-001-2', group: 'Esnek Flex', offer: 185000, payment: 0, brand: 'Kalde' },
      { id: 'prod-001-3', group: 'Altyapı', offer: 325000, payment: 0, brand: 'Kalde' },
    ],
    timeline: [
      {
        id: 'time-001-1',
        title: 'Keşif ziyareti gerçekleştirildi',
        date: '2025-02-12',
        notes: 'Ada Group şantiye alanı yerinde incelendi. Mekanik ekiplerle ihtiyaç listesi çıkarıldı.',
      },
      {
        id: 'time-001-2',
        title: 'Teklif teslim edildi',
        date: '2025-02-28',
        notes: 'TOKİ ihalesi kapsamında PVC boru ve radyatör ürün grubu için teklif iletildi.',
      },
      {
        id: 'time-001-3',
        title: 'Geri bildirim bekleniyor',
        date: '2025-03-10',
        notes: 'Proje değerlendirme kurulunun dönüşü beklenecek. Takip randevusu 18 Mart olarak planlandı.',
      },
    ],
    visits: [
      {
        id: 'visit-001-1',
        date: '2025-02-12',
        company: 'ADA Group',
        contact: 'Ahmet Er',
        phone: '+90 555 123 45 67',
        notes: 'Şantiye keşfi yapıldı. Ürün listesi hazırlandı.',
      },
    ],
    offers: [
      {
        id: 'offer-001-1',
        date: '2025-02-28',
        company: 'ADA Group',
        contact: 'Ahmet Er',
        phone: 'ahmet.er@adagroup.com',
        amount: 985000,
        productGroup: 'PVC & Flex Hatları',
        notes: 'PVC boru ve flex ürünleri için 985.000₺ teklif edildi.',
      },
    ],
    payments: [],
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
    products: [
      { id: 'prod-002-1', group: 'Sessiz-TR', offer: 650000, payment: 350000, brand: 'Kalde' },
      { id: 'prod-002-2', group: 'Metal', offer: 420000, payment: 200000, brand: 'Kalde' },
      { id: 'prod-002-3', group: 'Radyatör', offer: 280000, payment: 0, brand: 'ECA' },
    ],
    timeline: [
      {
        id: 'time-002-1',
        title: 'Bayi ile koordinasyon toplantısı',
        date: '2025-01-15',
        notes: 'İstanbul Anadolu Bayi proje lojistiğini üstlenecek. Sevkiyat planı çıkarıldı.',
      },
      {
        id: 'time-002-2',
        title: 'Sipariş onayı alındı',
        date: '2025-02-28',
        notes: 'Ürün teslimatı 15 Mart için planlandı. Finans departmanına bilgi verildi.',
      },
    ],
    visits: [
      {
        id: 'visit-002-1',
        date: '2025-01-15',
        company: '123 Yapı A.Ş.',
        contact: 'Mert Şahin',
        phone: '+90 555 987 65 43',
        notes: 'Bayi ile beraber toplantı gerçekleştirildi.',
      },
    ],
    offers: [],
    payments: [
      {
        id: 'payment-002-1',
        date: '2025-02-28',
        company: '123 Yapı A.Ş.',
        productGroup: 'Sessiz-TR Hatları',
        amount: 350000,
        method: 'Havale',
        notes: 'İlk parti sevkiyat için ön ödeme alındı.',
      },
    ],
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
    channelName: '',
    scope: '250 Konut + AVM',
    responsibleInstitution: 'Özel',
    progress: 'Mimari revizyon bekleniyor',
    assignedTeam: 'Bölge Satış',
    products: [
      { id: 'prod-003-1', group: 'Plastik Kolektör', offer: 210000, payment: 0, brand: 'Kalde' },
      { id: 'prod-003-2', group: 'Ankastre Vana', offer: 98000, payment: 0, brand: 'Kalde' },
    ],
    timeline: [
      {
        id: 'time-003-1',
        title: 'Konsept sunumu yapıldı',
        date: '2025-01-20',
        notes: 'Mimarlar ve mekanik ekip ile ürün seçimi değerlendirildi.',
      },
    ],
    visits: [],
    offers: [],
    payments: [],
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
    products: [
      { id: 'prod-004-1', group: 'Metal', offer: 510000, payment: 120000, brand: 'Kalde' },
      { id: 'prod-004-2', group: 'Altyapı', offer: 380000, payment: 0, brand: 'Kalde' },
    ],
    timeline: [
      {
        id: 'time-004-1',
        title: 'Karadeniz Bölge Bayi keşif yaptı',
        date: '2025-01-08',
        notes: 'Hastane kazan dairesi ve altyapı hatları ölçüldü.',
      },
      {
        id: 'time-004-2',
        title: 'Teklif hazırlığı',
        date: '2025-01-15',
        notes: 'Sağlık Bakanlığı teknik şartnamelerine göre ürün listesi oluşturuldu.',
      },
    ],
    visits: [],
    offers: [
      {
        id: 'offer-004-1',
        date: '2025-01-20',
        company: 'Kuzey İnşaat',
        contact: 'Derya Kılıç',
        phone: '+90 312 400 22 11',
        amount: 890000,
        productGroup: 'Hastane Altyapı Hatları',
        notes: 'Hastane altyapısı için ürün kalemleri gönderildi.',
      },
    ],
    payments: [
      {
        id: 'payment-004-1',
        date: '2025-02-05',
        company: 'Karadeniz Bölge Bayi',
        productGroup: 'Metal Hatlar',
        amount: 120000,
        method: 'Dekont',
        notes: 'Bayi üzerinden tahsil edildi.',
      },
    ],
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

const firmConfig = {
  construction: {
    store: constructionFirms,
    tableBody: () => constructionTableBody,
    searchInput: () => constructionSearch,
    profileTarget: () => constructionProfile,
    relationKey: 'contractor',
    label: 'İnşaat',
    emptyMessage: 'Proje için inşaat firması belirtilmedi.',
  },
  mechanical: {
    store: mechanicalFirms,
    tableBody: () => mechanicalTableBody,
    searchInput: () => mechanicalSearch,
    profileTarget: () => mechanicalProfile,
    relationKey: 'mechanical',
    label: 'Mekanik',
    emptyMessage: 'Proje için mekanik firması belirtilmedi.',
  },
};

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

let selectedProjectId = projectStore[0]?.id ?? null;
let editingProductId = null;
let editingTimelineId = null;
const logEditState = { visit: null, offer: null, payment: null };
let projectFormMode = null;
const defaultSubmitLabels = new Map();
const logForms = {};

function getFirmContext(type) {
  return firmConfig[type] ?? null;
}

function ensureFirmRecord(type, name) {
  const context = getFirmContext(type);
  if (!context) return { firm: null, created: false };
  const trimmedName = name?.trim();
  if (!trimmedName) return { firm: null, created: false };

  const { store } = context;
  let firm = store.find((item) => item.name === trimmedName);
  let created = false;

  if (!firm) {
    firm = {
      name: trimmedName,
      city: '',
      contact: '',
      status: 'Belirtilmedi',
      owner: '',
      notes: '',
      ongoing: [],
      completed: [],
    };
    store.push(firm);
    created = true;
  } else {
    if (!Array.isArray(firm.ongoing)) firm.ongoing = [];
    if (!Array.isArray(firm.completed)) firm.completed = [];
    if (firm.notes === undefined) firm.notes = '';
  }

  return { firm, created };
}

function deleteFirmRecord(type, name) {
  const context = getFirmContext(type);
  if (!context) return false;
  const trimmedName = name?.trim();
  if (!trimmedName) return false;

  const { store, relationKey } = context;
  const index = store.findIndex((item) => (item.name ?? '').trim() === trimmedName);
  if (index === -1) return false;

  store.splice(index, 1);

  projectStore.forEach((project) => {
    if ((project[relationKey] ?? '').trim() === trimmedName) {
      project[relationKey] = '';
    }
  });

  return true;
}

function refreshFirmTable(type) {
  const context = getFirmContext(type);
  if (!context) return;
  const tableBody = context.tableBody?.();
  if (!tableBody) return;
  const searchText = context.searchInput?.()?.value ?? '';
  renderFirmTable(tableBody, context.store, searchText);
}

function getRelatedProjectsForFirm(type, firmName) {
  const context = getFirmContext(type);
  if (!context) return [];
  const key = context.relationKey;
  const trimmedName = firmName?.trim();
  if (!trimmedName) return [];
  return projectStore.filter((project) => (project[key] ?? '').trim() === trimmedName);
}

function renderFirmProfilePanel(type, firm) {
  const context = getFirmContext(type);
  if (!context) return;
  const target = context.profileTarget?.();
  if (!target) return;

  if (!firm) {
    target.innerHTML = `<p class="muted">${context.emptyMessage}</p>`;
    return;
  }

  if (!Array.isArray(firm.ongoing)) firm.ongoing = [];
  if (!Array.isArray(firm.completed)) firm.completed = [];
  if (firm.notes === undefined) firm.notes = '';
  if (firm.city === undefined || firm.city === null) firm.city = '';
  if (firm.contact === undefined || firm.contact === null) firm.contact = '';
  if (firm.status === undefined || firm.status === null) firm.status = '';
  if (firm.owner === undefined || firm.owner === null) firm.owner = '';

  const relatedProjects = getRelatedProjectsForFirm(type, firm.name);
  target.innerHTML = buildFirmProfile(firm, type, relatedProjects);
}

function renderFirmProfileByName(type, firmName) {
  const context = getFirmContext(type);
  if (!context) return;
  const target = context.profileTarget?.();
  if (!target) return;

  const trimmedName = firmName?.trim();
  if (!trimmedName) {
    target.innerHTML = `<p class="muted">${context.emptyMessage}</p>`;
    return;
  }

  const { firm, created } = ensureFirmRecord(type, trimmedName);
  if (!firm) {
    target.innerHTML = `<p class="muted">${context.emptyMessage}</p>`;
    return;
  }

  if (created) {
    refreshFirmTable(type);
  }

  renderFirmProfilePanel(type, firm);
}

function finalizeFirmDeletion(type, firmName) {
  const deleted = deleteFirmRecord(type, firmName);
  if (!deleted) return false;

  refreshFirmTable(type);
  const context = getFirmContext(type);
  const profileTarget = context?.profileTarget?.();
  if (profileTarget) {
    const activeForm = profileTarget.querySelector('form[data-firm-name]');
    if (!activeForm || activeForm.dataset.firmName === firmName) {
      profileTarget.innerHTML = `<p class="muted">${context?.emptyMessage ?? 'Firma seçiniz.'}</p>`;
    }
  }

  renderProjectTable(projectSearch?.value ?? '');
  if (selectedProjectId) {
    renderProjectDetail(selectedProjectId);
  }

  return true;
}

function formatCurrency(amount) {
  return amount.toLocaleString('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  });
}

function formatDisplayDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('tr-TR');
}

function getProject(projectId) {
  if (!projectId) return undefined;
  return projectStore.find((item) => item.id === projectId);
}

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function escapeHtml(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function registerDefaultLabel(form) {
  if (!form) return;
  const submitBtn = form.querySelector('[data-role="submit"]');
  if (submitBtn) {
    defaultSubmitLabels.set(form, submitBtn.textContent);
  }
}

function setSubmitLabel(form, label) {
  if (!form) return;
  const submitBtn = form.querySelector('[data-role="submit"]');
  if (submitBtn) {
    submitBtn.textContent = label;
  }
}

function resetSubmitLabel(form) {
  if (!form) return;
  const submitBtn = form.querySelector('[data-role="submit"]');
  if (!submitBtn) return;
  const defaultLabel = defaultSubmitLabels.get(form);
  if (defaultLabel) {
    submitBtn.textContent = defaultLabel;
  }
}

function resetProjectForm(hide = true) {
  if (!projectForm) return;
  projectForm.reset();
  projectFormMode = null;
  if (hide) {
    projectForm.classList.add('hidden');
  }
  resetSubmitLabel(projectForm);
}

function resetProductForm() {
  if (!productForm) return;
  productForm.reset();
  editingProductId = null;
  const idField = productForm.querySelector('input[name="productId"]');
  if (idField) idField.value = '';
  resetSubmitLabel(productForm);
}

function resetTimelineForm() {
  if (!timelineForm) return;
  timelineForm.reset();
  editingTimelineId = null;
  const idField = timelineForm.querySelector('input[name="timelineId"]');
  if (idField) idField.value = '';
  resetSubmitLabel(timelineForm);
}

function resetLogForm(type) {
  const config = logForms[type];
  if (!config?.form) return;
  config.form.reset();
  const idField = config.form.querySelector('input[name="entryId"]');
  if (idField) idField.value = '';
  logEditState[type] = null;
  resetSubmitLabel(config.form);
}

function setFormValue(form, name, value) {
  if (!form) return;
  const field = form.elements.namedItem(name);
  if (field) {
    field.value = value ?? '';
  }
}

function openProjectForm(mode, project) {
  if (!projectForm) return;
  projectFormMode = mode;
  projectForm.dataset.mode = mode;
  projectForm.classList.remove('hidden');

  if (mode === 'edit' && project) {
    setSubmitLabel(projectForm, 'Güncelle');
  } else {
    resetSubmitLabel(projectForm);
  }

  if (mode === 'create') {
    projectForm.reset();
    const today = new Date().toISOString().slice(0, 10);
    setFormValue(projectForm, 'projectId', '');
    setFormValue(projectForm, 'projectName', '');
    setFormValue(projectForm, 'projectCategory', '');
    setFormValue(projectForm, 'projectCity', '');
    setFormValue(projectForm, 'addedAt', today);
    setFormValue(projectForm, 'updatedAt', today);
    setFormValue(projectForm, 'contractor', '');
    setFormValue(projectForm, 'mechanical', '');
    setFormValue(projectForm, 'salesStatus', '');
    setFormValue(projectForm, 'manager', '');
    setFormValue(projectForm, 'channel', 'direct');
    setFormValue(projectForm, 'channelName', '');
    setFormValue(projectForm, 'scope', '');
    setFormValue(projectForm, 'responsibleInstitution', '');
    setFormValue(projectForm, 'assignedTeam', '');
    setFormValue(projectForm, 'progress', '');
    setFormValue(projectForm, 'originalId', '');
  } else if (project) {
    setFormValue(projectForm, 'projectId', project.id);
    setFormValue(projectForm, 'projectName', project.name);
    setFormValue(projectForm, 'projectCategory', project.category);
    setFormValue(projectForm, 'projectCity', project.city);
    setFormValue(projectForm, 'addedAt', project.addedAt);
    setFormValue(projectForm, 'updatedAt', project.updatedAt);
    setFormValue(projectForm, 'contractor', project.contractor);
    setFormValue(projectForm, 'mechanical', project.mechanical);
    setFormValue(projectForm, 'salesStatus', project.salesStatus);
    setFormValue(projectForm, 'manager', project.manager);
    setFormValue(projectForm, 'channel', project.channel ?? 'direct');
    setFormValue(projectForm, 'channelName', project.channelName);
    setFormValue(projectForm, 'scope', project.scope);
    setFormValue(projectForm, 'responsibleInstitution', project.responsibleInstitution);
    setFormValue(projectForm, 'assignedTeam', project.assignedTeam);
    setFormValue(projectForm, 'progress', project.progress);
    setFormValue(projectForm, 'originalId', project.id);
  }
}

function renderProjectTable(filterText = '') {
  const query = filterText.toLocaleLowerCase('tr-TR');
  const filteredProjects = projectStore.filter((project) => {
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
          <td>${formatDisplayDate(project.addedAt)}</td>
          <td>${formatDisplayDate(project.updatedAt)}</td>
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
  projectStore.forEach((project) => {
    if (totals[project.category] !== undefined) {
      totals[project.category] += 1;
    }
  });

  counts['TOKİ'].textContent = totals['TOKİ'];
  counts['Emlak Konut'].textContent = totals['Emlak Konut'];
  counts['Özel'].textContent = totals['Özel'];
  counts['Kamu'].textContent = totals['Kamu'];
}

function populateProjectSelector() {
  if (!projectSelector) return;
  projectSelector.innerHTML = projectStore
    .map((project) => `<option value="${project.id}">${project.id} — ${project.name}</option>`)
    .join('');

  if (selectedProjectId) {
    projectSelector.value = selectedProjectId;
  }
}

function renderProjectDetail(projectId) {
  const project = getProject(projectId);
  selectedProjectId = project?.id ?? null;

  if (!project) {
    if (projectSelector) projectSelector.value = '';
    clearProjectDetails();
    renderProjectTable(projectSearch?.value ?? '');
    return;
  }

  if (projectSelector) {
    const hasOption = Array.from(projectSelector.options).some((option) => option.value === project.id);
    if (!hasOption) populateProjectSelector();
    projectSelector.value = project.id;
  }

  projectInfo.innerHTML = `
    <dt>Proje Kodu</dt><dd>${project.id}</dd>
    <dt>Kategori</dt><dd>${project.category}</dd>
    <dt>İl</dt><dd>${project.city}</dd>
    <dt>Eklenme Tarihi</dt><dd>${formatDisplayDate(project.addedAt)}</dd>
    <dt>Son Güncelleme</dt><dd>${formatDisplayDate(project.updatedAt)}</dd>
    <dt>Yüklenici</dt><dd>${project.contractor || '-'}</dd>
    <dt>Mekanik Yüklenici</dt><dd>${project.mechanical || '-'}</dd>
    <dt>Satış Durumu</dt><dd>${project.salesStatus || '-'}</dd>
    <dt>Bağlantı Türü</dt><dd>${
      project.channel === 'direct'
        ? 'Doğrudan'
        : `Bayi${project.channelName ? ` (${project.channelName})` : ''}`
    }</dd>
    <dt>Kapsam</dt><dd>${project.scope || '-'}</dd>
    <dt>Sorumlu Kurum</dt><dd>${project.responsibleInstitution || '-'}</dd>
    <dt>Proje Sorumlusu</dt><dd>${project.manager || '-'}</dd>
    <dt>Atanan Ekip</dt><dd>${project.assignedTeam || '-'}</dd>
    <dt>İlerleme</dt><dd>${project.progress || '-'}</dd>
  `;

  resetProductForm();
  resetTimelineForm();
  resetLogForm('visit');
  resetLogForm('offer');
  resetLogForm('payment');

  renderTimeline(project);
  renderLogs(project);
  renderFirmProfileByName('construction', project.contractor);
  renderFirmProfileByName('mechanical', project.mechanical);
  renderProjectTable(projectSearch?.value ?? '');
}

function clearProjectDetails() {
  if (projectInfo) {
    projectInfo.innerHTML = '<p class="muted">Proje seçin ya da yeni proje oluşturun.</p>';
  }
  if (productTableBody) {
    productTableBody.innerHTML = '<tr><td colspan="5">Proje seçiniz.</td></tr>';
  }
  offerTotal.textContent = '-';
  paymentTotal.textContent = '-';
  if (timeline) {
    timeline.innerHTML = '<p class="muted">Proje seçiniz.</p>';
  }
  [visitLog, offerLog, paymentLog].forEach((log) => {
    if (log) {
      log.innerHTML = '<li class="muted">Proje seçiniz.</li>';
    }
  });
  const constructionTarget = firmConfig.construction.profileTarget?.();
  if (constructionTarget) {
    constructionTarget.innerHTML = `<p class="muted">${firmConfig.construction.emptyMessage}</p>`;
  }
  const mechanicalTarget = firmConfig.mechanical.profileTarget?.();
  if (mechanicalTarget) {
    mechanicalTarget.innerHTML = `<p class="muted">${firmConfig.mechanical.emptyMessage}</p>`;
  }
  resetProductForm();
  resetTimelineForm();
  resetLogForm('visit');
  resetLogForm('offer');
  resetLogForm('payment');
}

function renderProducts(project) {
  if (!productTableBody) return;
  if (!project) {
    productTableBody.innerHTML = '<tr><td colspan="5">Proje seçiniz.</td></tr>';
    offerTotal.textContent = '-';
    paymentTotal.textContent = '-';
    return;
  }

  let offerSum = 0;
  let paymentSum = 0;
  const rows = [];

  if (Array.isArray(project.products)) {
    project.products.forEach((product) => {
      const offerRaw = Number(product.offer ?? 0);
      const paymentRaw = Number(product.payment ?? 0);
      const offerValue = Number.isFinite(offerRaw) ? offerRaw : 0;
      const paymentValue = Number.isFinite(paymentRaw) ? paymentRaw : 0;
      offerSum += offerValue;
      paymentSum += paymentValue;
      rows.push(`
        <tr data-product-id="${product.id}" data-row-type="product">
          <td class="table-actions">
            <button class="ghost-btn" data-action="edit-product">Düzenle</button>
            <button class="ghost-btn danger" data-action="delete-product">Sil</button>
          </td>
          <td>${escapeHtml(product.group ?? '-')}</td>
          <td>${offerValue ? formatCurrency(offerValue) : '-'}</td>
          <td>${paymentValue ? formatCurrency(paymentValue) : '-'}</td>
          <td>${escapeHtml(product.brand ?? '-')}</td>
        </tr>
      `);
    });
  }

  if (Array.isArray(project.offers)) {
    project.offers.forEach((entry) => {
      const amountRaw = Number(entry.amount ?? 0);
      const amount = Number.isFinite(amountRaw) ? amountRaw : 0;
      offerSum += amount;
      rows.push(`
        <tr data-log-row="offer-${entry.id}" class="is-log-row">
          <td class="table-actions"><span class="table-chip table-chip--offer">Teklif</span></td>
          <td>${escapeHtml(entry.productGroup ?? '-')}</td>
          <td>${amount ? formatCurrency(amount) : '-'}</td>
          <td>-</td>
          <td>${escapeHtml(entry.company ?? '-')}</td>
        </tr>
      `);
    });
  }

  if (Array.isArray(project.payments)) {
    project.payments.forEach((entry) => {
      const amountRaw = Number(entry.amount ?? 0);
      const amount = Number.isFinite(amountRaw) ? amountRaw : 0;
      paymentSum += amount;
      rows.push(`
        <tr data-log-row="payment-${entry.id}" class="is-log-row">
          <td class="table-actions"><span class="table-chip table-chip--payment">Tahsilat</span></td>
          <td>${escapeHtml(entry.productGroup ?? '-')}</td>
          <td>-</td>
          <td>${amount ? formatCurrency(amount) : '-'}</td>
          <td>${escapeHtml(entry.method ?? entry.company ?? '-')}</td>
        </tr>
      `);
    });
  }

  if (!rows.length) {
    productTableBody.innerHTML = '<tr><td colspan="5">Henüz finans kaydı bulunmuyor.</td></tr>';
    offerTotal.textContent = '-';
    paymentTotal.textContent = '-';
    return;
  }

  productTableBody.innerHTML = rows.join('');
  offerTotal.textContent = formatCurrency(offerSum);
  paymentTotal.textContent = formatCurrency(paymentSum);
}

function renderTimeline(project) {
  if (!timeline) return;
  if (!project || !project.timeline.length) {
    timeline.innerHTML = '<p class="muted">Bu proje için henüz süreç kaydı oluşturulmadı.</p>';
    return;
  }

  const items = [...project.timeline].sort((a, b) => (a.date < b.date ? 1 : -1));
  timeline.innerHTML = items
    .map(
      (item) => `
        <article class="timeline-item" data-timeline-id="${item.id}">
          <div class="timeline-item__content">
            <strong>${item.title}</strong>
            <span>${formatDisplayDate(item.date)}</span>
            <p>${item.notes ?? ''}</p>
          </div>
          <div class="timeline-item__actions">
            <button class="ghost-btn" data-action="edit-timeline">Düzenle</button>
            <button class="ghost-btn danger" data-action="delete-timeline">Sil</button>
          </div>
        </article>
      `,
    )
    .join('');
}

function renderLogs(project = getProject(selectedProjectId)) {
  renderLogList(
    visitLog,
    project?.visits ?? [],
    'visit',
    (item) => `
      <strong>${item.company}</strong>
      <span>${formatDisplayDate(item.date)}</span>
      <p>${item.notes ?? ''}</p>
      <span>Yetkili: ${item.contact}${item.phone ? ' • ' + item.phone : ''}</span>
    `,
  );

  renderLogList(
    offerLog,
    project?.offers ?? [],
    'offer',
    (item) => {
      const amountValue = Number(item.amount ?? 0);
      const hasAmount =
        item.amount !== undefined && item.amount !== null && item.amount !== '' && Number.isFinite(amountValue);
      return `
        <strong>${item.company}</strong>
        <span>${formatDisplayDate(item.date)}${hasAmount ? ' • ' + formatCurrency(amountValue) : ''}</span>
        <span>Ürün Grubu: ${item.productGroup || '-'}</span>
        <p>${item.notes ?? ''}</p>
        <span>Yetkili: ${item.contact}${item.phone ? ' • ' + item.phone : ''}</span>
      `;
    },
  );

  renderLogList(
    paymentLog,
    project?.payments ?? [],
    'payment',
    (item) => {
      const amountValue = Number(item.amount ?? 0);
      const hasAmount =
        item.amount !== undefined && item.amount !== null && item.amount !== '' && Number.isFinite(amountValue);
      return `
        <strong>${item.company}</strong>
        <span>${formatDisplayDate(item.date)} • ${hasAmount ? formatCurrency(amountValue) : '-'}</span>
        <span>Ürün Grubu: ${item.productGroup || '-'}</span>
        <p>${item.notes ?? ''}</p>
        <span>Ödeme Yöntemi: ${item.method || '-'}</span>
      `;
    },
  );

  renderProducts(project);
}

function renderLogList(target, items, type, templateFn) {
  if (!target) return;
  if (!items.length) {
    target.innerHTML = '<li class="muted">Henüz kayıt bulunmuyor.</li>';
    return;
  }

  target.innerHTML = [...items]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(
      (item) => `
        <li class="log-item" data-log-id="${item.id}">
          <div class="log-item__content">${templateFn(item)}</div>
          <div class="log-item__actions">
            <button class="ghost-btn" data-action="edit-log" data-log-type="${type}">Düzenle</button>
            <button class="ghost-btn danger" data-action="delete-log" data-log-type="${type}">Sil</button>
          </div>
        </li>
      `,
    )
    .join('');
}

function activateView(target) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.target === target;
    link.classList.toggle('active', isActive);
  });

  dashboards.forEach((section) => {
    section.classList.toggle('hidden', section.dataset.view !== target);
  });
}

function renderFirmTable(target, items, searchText = '') {
  if (!target) return;
  const query = searchText.toLocaleLowerCase('tr-TR');
  target.innerHTML = items
    .filter((item) => (item.name ?? '').toLocaleLowerCase('tr-TR').includes(query))
    .map((firm) => {
      const name = firm.name ?? '';
      const city = firm.city?.trim() || '-';
      const contact = firm.contact?.trim() || '-';
      const status = firm.status?.trim() || '-';
      const owner = firm.owner?.trim() || '-';

      return `
        <tr data-firm="${escapeHtml(name)}">
          <td class="table-actions">
            <button class="ghost-btn" data-action="view">Detay</button>
            <button class="ghost-btn danger" data-action="delete">Sil</button>
          </td>
          <td>${escapeHtml(name)}</td>
          <td>${escapeHtml(city)}</td>
          <td>${escapeHtml(contact)}</td>
          <td>${escapeHtml(status)}</td>
          <td>${escapeHtml(owner)}</td>
        </tr>
      `;
    })
    .join('');
}

function buildFirmProfile(firm, type, relatedProjects) {
  const context = getFirmContext(type);
  const label = context?.label ?? '';
  const projectItems = relatedProjects.length
    ? relatedProjects
        .map(
          (project) => `
            <li>
              <span>${escapeHtml(project.id)}</span>
              <span>${escapeHtml(project.name)} • ${escapeHtml(project.city || '-')} (${escapeHtml(project.category || '-')}) • ${escapeHtml(project.salesStatus || '-')}</span>
            </li>
          `,
        )
        .join('')
    : '<li><span>-</span><span>Bağlı proje yok</span></li>';

  return `
    <div class="profile__header">
      <h3>${escapeHtml(firm.name)}</h3>
      <p class="muted">${escapeHtml(label)} firması bilgilerini görüntüleyin ve güncelleyin.</p>
    </div>
    <form class="profile-form" data-firm-type="${type}" data-firm-name="${escapeHtml(firm.name)}">
      <div class="profile-form__grid">
        <label>
          <span>İl</span>
          <input type="text" name="firmCity" value="${escapeHtml(firm.city ?? '')}" placeholder="İl" />
        </label>
        <label>
          <span>Yetkili</span>
          <input type="text" name="firmContact" value="${escapeHtml(firm.contact ?? '')}" placeholder="Yetkili kişi" />
        </label>
        <label>
          <span>Çalışma Durumu</span>
          <input type="text" name="firmStatus" value="${escapeHtml(firm.status ?? '')}" placeholder="Durum" />
        </label>
        <label>
          <span>Sorumlu Personel</span>
          <input type="text" name="firmOwner" value="${escapeHtml(firm.owner ?? '')}" placeholder="Sorumlu" />
        </label>
        <label class="full-width">
          <span>Notlar</span>
          <textarea name="firmNotes" rows="2" placeholder="Ek notlar">${escapeHtml(firm.notes ?? '')}</textarea>
        </label>
      </div>
      <div class="form-actions">
        <span class="form-feedback" data-role="feedback"></span>
        <div class="form-actions__controls">
          <button type="button" class="ghost-btn danger" data-action="delete-firm">Firmayı Sil</button>
          <button type="submit" class="primary-btn">Bilgileri Güncelle</button>
        </div>
      </div>
    </form>
    <div class="profile__group">
      <h4>Bağlı Projeler</h4>
      <ul class="profile__list">${projectItems}</ul>
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

function setupForms() {
  const visitForm = document.getElementById('visitForm');
  const offerForm = document.getElementById('offerForm');
  const paymentForm = document.getElementById('paymentForm');

  registerDefaultLabel(projectForm);
  registerDefaultLabel(productForm);
  registerDefaultLabel(timelineForm);
  [visitForm, offerForm, paymentForm].forEach((form) => registerDefaultLabel(form));

  logForms.visit = { form: visitForm, collection: 'visits' };
  logForms.offer = { form: offerForm, collection: 'offers' };
  logForms.payment = { form: paymentForm, collection: 'payments' };

  newProjectBtn?.addEventListener('click', () => {
    openProjectForm('create');
  });

  editProjectBtn?.addEventListener('click', () => {
    const project = getProject(selectedProjectId);
    if (!project) return;
    openProjectForm('edit', project);
  });

  deleteProjectBtn?.addEventListener('click', () => {
    const project = getProject(selectedProjectId);
    if (!project) return;
    if (!window.confirm(`${project.name} kaydını silmek istediğinize emin misiniz?`)) return;
    const index = projectStore.findIndex((item) => item.id === project.id);
    if (index >= 0) {
      projectStore.splice(index, 1);
    }
    selectedProjectId = projectStore[0]?.id ?? null;
    populateProjectSelector();
    renderProjectTable(projectSearch?.value ?? '');
    if (selectedProjectId) {
      renderProjectDetail(selectedProjectId);
    } else {
      clearProjectDetails();
    }
  });

  projectSelector?.addEventListener('change', (event) => {
    const value = event.target.value;
    renderProjectDetail(value);
  });

  projectForm?.querySelector('[data-action="cancel-project"]')?.addEventListener('click', () => {
    resetProjectForm();
  });

  projectForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(projectForm);
    const projectId = formData.get('projectId')?.trim();
    if (!projectId) return;

    const payload = {
      id: projectId,
      name: formData.get('projectName')?.trim() ?? '',
      category: formData.get('projectCategory') ?? '',
      city: formData.get('projectCity')?.trim() ?? '',
      addedAt: formData.get('addedAt') || '',
      updatedAt: formData.get('updatedAt') || '',
      contractor: formData.get('contractor')?.trim() ?? '',
      mechanical: formData.get('mechanical')?.trim() ?? '',
      salesStatus: formData.get('salesStatus')?.trim() ?? '',
      manager: formData.get('manager')?.trim() ?? '',
      channel: formData.get('channel') ?? 'direct',
      channelName: formData.get('channelName')?.trim() ?? '',
      scope: formData.get('scope')?.trim() ?? '',
      responsibleInstitution: formData.get('responsibleInstitution')?.trim() ?? '',
      assignedTeam: formData.get('assignedTeam')?.trim() ?? '',
      progress: formData.get('progress')?.trim() ?? '',
    };

    const today = new Date().toISOString().slice(0, 10);
    if (!payload.addedAt) payload.addedAt = today;
    if (!payload.updatedAt) payload.updatedAt = payload.addedAt;

    if (projectFormMode === 'edit') {
      const originalId = formData.get('originalId') || selectedProjectId;
      const project = getProject(originalId);
      if (!project) return;
      if (originalId !== projectId && getProject(projectId)) {
        window.alert('Bu proje kodu zaten kullanılıyor.');
        return;
      }
      project.id = projectId;
      project.name = payload.name;
      project.category = payload.category;
      project.city = payload.city;
      project.addedAt = payload.addedAt;
      project.updatedAt = payload.updatedAt;
      project.contractor = payload.contractor;
      project.mechanical = payload.mechanical;
      project.salesStatus = payload.salesStatus;
      project.manager = payload.manager;
      project.channel = payload.channel;
      project.channelName = payload.channelName;
      project.scope = payload.scope;
      project.responsibleInstitution = payload.responsibleInstitution;
      project.assignedTeam = payload.assignedTeam;
      project.progress = payload.progress;
      selectedProjectId = project.id;
    } else {
      if (getProject(projectId)) {
        window.alert('Bu proje kodu zaten kullanılıyor.');
        return;
      }

      const newProject = {
        id: payload.id,
        addedAt: payload.addedAt,
        updatedAt: payload.updatedAt,
        category: payload.category,
        city: payload.city,
        name: payload.name,
        contractor: payload.contractor,
        mechanical: payload.mechanical,
        salesStatus: payload.salesStatus,
        manager: payload.manager,
        channel: payload.channel,
        channelName: payload.channelName,
        scope: payload.scope,
        responsibleInstitution: payload.responsibleInstitution,
        progress: payload.progress,
        assignedTeam: payload.assignedTeam,
        products: [],
        timeline: [],
        visits: [],
        offers: [],
        payments: [],
      };
      projectStore.push(newProject);
      selectedProjectId = newProject.id;
    }

    resetProjectForm();
    populateProjectSelector();
    renderProjectTable(projectSearch?.value ?? '');
    renderProjectDetail(selectedProjectId);
  });

  productForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const project = getProject(selectedProjectId);
    if (!project) return;
    const formData = new FormData(productForm);
    const productId = editingProductId || formData.get('productId') || createId('prod');
    const payload = {
      id: productId,
      group: formData.get('group')?.trim() ?? '',
      offer: Number(formData.get('offer') || 0),
      payment: Number(formData.get('payment') || 0),
      brand: formData.get('brand')?.trim() ?? '',
    };

    if (editingProductId) {
      const product = project.products.find((item) => item.id === editingProductId);
      if (product) {
        Object.assign(product, payload);
      }
    } else {
      project.products.push(payload);
    }

    resetProductForm();
    renderProducts(project);
  });

  productForm?.querySelector('[data-action="cancel-product"]')?.addEventListener('click', () => {
    resetProductForm();
  });

  timelineForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const project = getProject(selectedProjectId);
    if (!project) return;
    const formData = new FormData(timelineForm);
    const timelineId = editingTimelineId || formData.get('timelineId') || createId('time');
    const payload = {
      id: timelineId,
      title: formData.get('title')?.trim() ?? '',
      date: formData.get('date') || '',
      notes: formData.get('notes')?.trim() ?? '',
    };

    if (editingTimelineId) {
      const item = project.timeline.find((entry) => entry.id === editingTimelineId);
      if (item) Object.assign(item, payload);
    } else {
      project.timeline.push(payload);
    }

    resetTimelineForm();
    renderTimeline(project);
  });

  timelineForm?.querySelector('[data-action="cancel-timeline"]')?.addEventListener('click', () => {
    resetTimelineForm();
  });

  Object.entries(logForms).forEach(([type, config]) => {
    const { form, collection } = config;
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const project = getProject(selectedProjectId);
      if (!project) return;
      const formData = new FormData(form);
      const isEditing = Boolean(logEditState[type]);
      const logId = isEditing ? logEditState[type] : createId(type);
      const entry = {
        id: logId,
        date: formData.get('date') || '',
        company: formData.get('company')?.trim() ?? '',
        contact: formData.get('contact')?.trim() ?? '',
        phone: formData.get('phone')?.trim() ?? '',
        notes: formData.get('notes')?.trim() ?? '',
      };

      if (type === 'offer') {
        entry.amount = Number(formData.get('amount') || 0);
        entry.productGroup = formData.get('productGroup')?.trim() ?? '';
      }

      if (type === 'payment') {
        entry.amount = Number(formData.get('amount') || 0);
        entry.method = formData.get('method')?.trim() ?? '';
        entry.productGroup = formData.get('productGroup')?.trim() ?? '';
      }

      if (isEditing) {
        const target = project[collection].find((item) => item.id === logId);
        if (target) Object.assign(target, entry);
      } else {
        project[collection].push(entry);
      }

      resetLogForm(type);
      renderLogs(project);
    });

    form.querySelector('[data-action="cancel-log"]')?.addEventListener('click', () => {
      resetLogForm(type);
    });
  });

  if (productTableBody) {
    productTableBody.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const row = button.closest('tr[data-product-id]');
      const productId = row?.dataset.productId;
      const project = getProject(selectedProjectId);
      if (!project || !productId) return;

      if (button.dataset.action === 'edit-product') {
        const product = project.products.find((item) => item.id === productId);
        if (!product) return;
        editingProductId = productId;
        setSubmitLabel(productForm, 'Güncelle');
        setFormValue(productForm, 'productId', product.id);
        setFormValue(productForm, 'group', product.group);
        setFormValue(productForm, 'offer', product.offer);
        setFormValue(productForm, 'payment', product.payment);
        setFormValue(productForm, 'brand', product.brand);
      } else if (button.dataset.action === 'delete-product') {
        if (!window.confirm('Ürün kaydını silmek istediğinize emin misiniz?')) return;
        project.products = project.products.filter((item) => item.id !== productId);
        if (editingProductId === productId) {
          resetProductForm();
        }
        renderProducts(project);
      }
    });
  }

  timeline?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const item = button.closest('.timeline-item[data-timeline-id]');
    const timelineId = item?.dataset.timelineId;
    const project = getProject(selectedProjectId);
    if (!project || !timelineId) return;

    if (button.dataset.action === 'edit-timeline') {
      const entry = project.timeline.find((record) => record.id === timelineId);
      if (!entry) return;
      editingTimelineId = timelineId;
      setSubmitLabel(timelineForm, 'Güncelle');
      setFormValue(timelineForm, 'timelineId', entry.id);
      setFormValue(timelineForm, 'title', entry.title);
      setFormValue(timelineForm, 'date', entry.date);
      setFormValue(timelineForm, 'notes', entry.notes);
    } else if (button.dataset.action === 'delete-timeline') {
      if (!window.confirm('Süreç kaydını silmek istediğinize emin misiniz?')) return;
      project.timeline = project.timeline.filter((record) => record.id !== timelineId);
      if (editingTimelineId === timelineId) {
        resetTimelineForm();
      }
      renderTimeline(project);
    }
  });

  [visitLog, offerLog, paymentLog].forEach((list) => {
    list?.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const type = button.dataset.logType;
      const logId = button.closest('li[data-log-id]')?.dataset.logId;
      const project = getProject(selectedProjectId);
      const config = logForms[type];
      if (!project || !config || !logId) return;
      const { collection, form } = config;
      const index = project[collection].findIndex((entry) => entry.id === logId);
      if (index === -1) return;

      if (button.dataset.action === 'edit-log') {
        const entry = project[collection][index];
        logEditState[type] = logId;
        setSubmitLabel(form, 'Güncelle');
        setFormValue(form, 'entryId', entry.id);
        setFormValue(form, 'date', entry.date);
        setFormValue(form, 'company', entry.company);
        setFormValue(form, 'contact', entry.contact);
        setFormValue(form, 'phone', entry.phone);
        setFormValue(form, 'notes', entry.notes);
        if (type === 'offer') {
          setFormValue(form, 'amount', entry.amount);
          setFormValue(form, 'productGroup', entry.productGroup);
        }
        if (type === 'payment') {
          setFormValue(form, 'amount', entry.amount);
          setFormValue(form, 'method', entry.method);
          setFormValue(form, 'productGroup', entry.productGroup);
        }
      } else if (button.dataset.action === 'delete-log') {
        if (!window.confirm('Kaydı silmek istediğinize emin misiniz?')) return;
        project[collection].splice(index, 1);
        if (logEditState[type] === logId) {
          resetLogForm(type);
        }
        renderLogs(project);
      }
    });
  });
}

function setupNavigation() {
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      activateView(link.dataset.target);
    });
  });
}

function setupProjectSelection() {
  projectTableBody.addEventListener('click', (event) => {
    const row = event.target.closest('tr[data-project-id]');
    if (!row) return;
    const projectId = row.dataset.projectId;
    renderProjectDetail(projectId);
    activateView('project-detail');
  });
}

function setupFirmSelection() {
  constructionTableBody.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const row = button.closest('tr[data-firm]');
    if (!row) return;
    const firm = constructionFirms.find((item) => item.name === row.dataset.firm);
    if (!firm) return;
    const firmName = firm.name ?? '';
    if (!firmName) return;
    if (button.dataset.action === 'view') {
      renderFirmProfilePanel('construction', firm);
    }
    if (button.dataset.action === 'delete') {
      if (!window.confirm(`${firmName} kaydını silmek istediğinize emin misiniz?`)) return;
      finalizeFirmDeletion('construction', firmName);
    }
  });

  mechanicalTableBody.addEventListener('click', (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const row = button.closest('tr[data-firm]');
    if (!row) return;
    const firm = mechanicalFirms.find((item) => item.name === row.dataset.firm);
    if (!firm) return;
    const firmName = firm.name ?? '';
    if (!firmName) return;
    if (button.dataset.action === 'view') {
      renderFirmProfilePanel('mechanical', firm);
    }
    if (button.dataset.action === 'delete') {
      if (!window.confirm(`${firmName} kaydını silmek istediğinize emin misiniz?`)) return;
      finalizeFirmDeletion('mechanical', firmName);
    }
  });
}

function setupFirmProfileForms() {
  [constructionProfile, mechanicalProfile].forEach((profile) => {
    profile?.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!(event.target instanceof HTMLFormElement)) return;
      const form = event.target;
      const firmType = form.dataset.firmType;
      const firmName = form.dataset.firmName;
      if (!firmType || !firmName) return;
      const context = getFirmContext(firmType);
      if (!context) return;
      const firm = context.store.find((item) => item.name === firmName);
      if (!firm) return;

      const city = form.elements.namedItem('firmCity')?.value?.trim() ?? '';
      const contact = form.elements.namedItem('firmContact')?.value?.trim() ?? '';
      const status = form.elements.namedItem('firmStatus')?.value?.trim() ?? '';
      const owner = form.elements.namedItem('firmOwner')?.value?.trim() ?? '';
      const notes = form.elements.namedItem('firmNotes')?.value?.trim() ?? '';

      firm.city = city;
      firm.contact = contact;
      firm.status = status;
      firm.owner = owner;
      firm.notes = notes;

      setFormValue(form, 'firmCity', firm.city);
      setFormValue(form, 'firmContact', firm.contact);
      setFormValue(form, 'firmStatus', firm.status);
      setFormValue(form, 'firmOwner', firm.owner);
      setFormValue(form, 'firmNotes', firm.notes);

      refreshFirmTable(firmType);

      const feedback = form.querySelector('[data-role="feedback"]');
      if (feedback) {
        feedback.textContent = 'Bilgiler güncellendi';
        feedback.classList.add('is-visible');
        window.setTimeout(() => {
          if (feedback.textContent === 'Bilgiler güncellendi') {
            feedback.textContent = '';
            feedback.classList.remove('is-visible');
          }
        }, 2000);
      }
    });

    profile?.addEventListener('click', (event) => {
      const button = event.target instanceof HTMLElement ? event.target.closest('button[data-action="delete-firm"]') : null;
      if (!button) return;
      const form = button.closest('form[data-firm-type][data-firm-name]');
      if (!(form instanceof HTMLFormElement)) return;
      const firmType = form.dataset.firmType;
      const firmName = form.dataset.firmName;
      if (!firmType || !firmName) return;
      if (!window.confirm(`${firmName} kaydını silmek istediğinize emin misiniz?`)) return;

      finalizeFirmDeletion(firmType, firmName);
    });
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
  populateProjectSelector();
  if (selectedProjectId) {
    renderProjectDetail(selectedProjectId);
  } else {
    clearProjectDetails();
  }
  renderFirmTable(constructionTableBody, constructionFirms);
  renderFirmTable(mechanicalTableBody, mechanicalFirms);
  renderAssignments();
  renderRequests();
  setupNavigation();
  setupProjectSelection();
  setupFirmSelection();
  setupFirmProfileForms();
  setupForms();
  setupSearch();
  setupModal();
  activateView('project-pool');
}

init();
