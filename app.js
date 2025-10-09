const authScreen = document.getElementById('authScreen');
const loginForm = document.getElementById('loginForm');
const authError = document.getElementById('authError');
const logoutBtn = document.getElementById('logoutBtn');
const currentUserName = document.getElementById('currentUserName');
const currentUserRole = document.getElementById('currentUserRole');
const userAdminBtn = document.getElementById('userAdminBtn');
const userModal = document.getElementById('userModal');
const userModalFeedback = document.getElementById('userModalFeedback');
const userForm = document.getElementById('userForm');
const userTableBody = document.getElementById('userTableBody');
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
const requestForm = document.getElementById('requestForm');
const projectImportBtn = document.getElementById('projectImportBtn');
const projectExportBtn = document.getElementById('projectExportBtn');
const projectImportInput = document.getElementById('projectImportInput');
const projectImportFeedback = document.getElementById('projectImportFeedback');

const feedbackTimers = new WeakMap();
let userModalFeedbackTimer = null;
let projectImportFeedbackTimer = null;

const ROLE_LABELS = {
  manager: 'Yönetici',
  standard: 'Standart',
};

const DEFAULT_REQUEST_STATUS = 'Beklemede';

const userStore = [
  {
    id: 'user-met',
    fullName: 'Metehan Kargılı',
    email: 'metehankargili@kaldeboru.com',
    password: '123456',
    role: 'manager',
    status: 'active',
    createdAt: '2024-01-01',
  },
  {
    id: 'user-saf',
    fullName: 'Safili Tanık',
    email: 'safili.tanik@kaldeboru.com',
    password: '',
    role: 'standard',
    status: 'active',
    createdAt: '2024-01-02',
  },
  {
    id: 'user-cig',
    fullName: 'Çiğdem Tuna',
    email: 'cigdem.tuna@kaldeboru.com',
    password: '',
    role: 'standard',
    status: 'active',
    createdAt: '2024-01-03',
  },
  {
    id: 'user-osm',
    fullName: 'Osman Öztürk',
    email: 'osman.ozturk@kaldeboru.com',
    password: '',
    role: 'standard',
    status: 'active',
    createdAt: '2024-01-04',
  },
];

let currentUser = null;

const counts = {
  TOKİ: document.getElementById('tokiCount'),
  'Emlak Konut': document.getElementById('emlakCount'),
  Özel: document.getElementById('privateCount'),
  Kamu: document.getElementById('publicCount'),
};

const projectStore = [];
const constructionFirms = [];
const mechanicalFirms = [];

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

const requestStore = [];

let selectedProjectId = projectStore[0]?.id ?? null;
let editingProductId = null;
let editingTimelineId = null;
let editingRequestId = null;
const logEditState = { visit: null, offer: null, payment: null };
let projectFormMode = null;
const defaultSubmitLabels = new Map();
const logForms = {};

const PROJECT_FIELD_ALIASES = {
  id: ['proje kodu', 'proje id', 'id', 'kod', 'referans'],
  name: ['proje adı', 'proje adi', 'adı', 'adi', 'ad', 'project name', 'proje'],
  category: ['kategori', 'proje kategorisi'],
  city: ['il', 'şehir', 'sehir', 'city', 'lokasyon', 'lokasyon ili'],
  addedAt: [
    'eklenme tarihi',
    'eklenme',
    'kayıt tarihi',
    'kayit tarihi',
    'oluşturulma tarihi',
    'olusturulma tarihi',
    'olusturma tarihi',
    'oluşturma tarihi',
    'başlangıç tarihi',
    'baslangic tarihi',
  ],
  updatedAt: [
    'son işlem tarihi',
    'son islem tarihi',
    'son güncelleme',
    'son guncelleme',
    'güncelleme tarihi',
    'guncelleme tarihi',
    'güncel tarih',
    'guncel tarih',
    'son durum tarihi',
  ],
  contractor: ['yüklenici', 'yuklenici', 'inşaat firması', 'insaat firmasi', 'inşaat', 'insaat'],
  mechanical: ['mekanik yüklenici', 'mekanik firma', 'mekanik', 'mekanik taşeron', 'mekanik taseron'],
  manager: [
    'proje sorumlusu',
    'temsilci',
    'proje temsilcisi',
    'proje yöneticisi',
    'proje yoneticisi',
    'sorumlu kişi',
    'sorumlu kisi',
  ],
  channel: [
    'bağlantı türü',
    'baglanti turu',
    'kanal türü',
    'kanal turu',
    'kanal tipi',
    'satış kanalı',
    'satis kanali',
    'iletişim kanalı',
    'iletisim kanali',
  ],
  channelName: ['bayi / kanal', 'bayi', 'kanal adı', 'kanal adi', 'bayi adı', 'bayi adi', 'kanal'],
  scope: ['kapsam', 'proje kapsamı', 'proje kapsami'],
  responsibleInstitution: ['sorumlu kurum', 'kurum', 'kuruluş', 'kurulus', 'idare'],
  assignedTeam: ['atanan ekip', 'ekip', 'takım', 'takim'],
  progress: ['ilerleme notu', 'ilerleme', 'not', 'açıklama', 'aciklama', 'durum notu'],
  salesStatus: ['satış durumu', 'satis durumu'],
};

const PROJECT_EXPORT_HEADERS = [
  'Proje Kodu',
  'Proje Adı',
  'Kategori',
  'İl',
  'Eklenme Tarihi',
  'Son Güncelleme',
  'Bağlantı Türü',
  'Bayi / Kanal',
  'Yüklenici',
  'Mekanik Yüklenici',
  'Proje Sorumlusu',
  'Satış Durumu',
  'Sorumlu Kurum',
  'Atanan Ekip',
  'Kapsam',
  'İlerleme Notu',
  'Süreç Kayıtları',
  'Ürünler',
  'Teklif Kayıtları',
  'Tahsilat Kayıtları',
  'Ziyaret Kayıtları',
  'Toplam Teklif',
  'Toplam Tahsilat',
];

function getRoleLabel(role) {
  return ROLE_LABELS[role] ?? ROLE_LABELS.standard;
}

function isManager(user = currentUser) {
  return (user?.role ?? '') === 'manager';
}

function getActiveUsers() {
  return userStore.filter((user) => user.status !== 'inactive');
}

function findUserByEmail(value) {
  if (!value) return undefined;
  const normalized = value.trim().toLocaleLowerCase('en-US');
  return getActiveUsers().find((user) => user.email.toLocaleLowerCase('en-US') === normalized);
}

function populateStaffSelect(select, selectedValue = '') {
  if (!(select instanceof HTMLSelectElement)) return;
  const allowEmpty = select.dataset.allowEmpty !== 'false';
  const staff = getActiveUsers()
    .filter((user) => user.fullName)
    .map((user) => ({
      value: user.fullName,
      label: `${user.fullName}${user.role === 'manager' ? ' • Yönetici' : ''}`,
    }));

  const options = [];
  if (allowEmpty) {
    options.push('<option value="">Seçin</option>');
  }

  staff.forEach((person) => {
    const isSelected = person.value === selectedValue;
    options.push(
      `<option value="${escapeHtml(person.value)}"${isSelected ? ' selected' : ''}>${escapeHtml(person.label)}</option>`
    );
  });

  if (selectedValue && !staff.some((person) => person.value === selectedValue)) {
    options.push(
      `<option value="${escapeHtml(selectedValue)}" selected>${escapeHtml(selectedValue)}</option>`
    );
  }

  select.innerHTML = options.join('');
  if (!selectedValue && !allowEmpty && staff.length) {
    select.value = staff[0].value;
  } else if (selectedValue) {
    select.value = selectedValue;
  }
}

function refreshStaffSelectors() {
  document
    .querySelectorAll('select[data-staff-select]')
    .forEach((select) => populateStaffSelect(select, select.value || ''));
}

function normalizeHeaderValue(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .toLocaleLowerCase('tr-TR')
    .replace(/[()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function resolveProjectField(header) {
  const normalized = normalizeHeaderValue(header);
  if (!normalized) return null;
  return (
    Object.entries(PROJECT_FIELD_ALIASES).find(([, aliases]) => aliases.includes(normalized))?.[0] ?? null
  );
}

function sanitizeText(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function normalizeChannelValue(value) {
  const text = sanitizeText(value).toLocaleLowerCase('tr-TR');
  if (!text) return 'direct';
  if (text.includes('bayi') || text.includes('dealer') || text.includes('aracı') || text.includes('araci')) {
    return 'dealer';
  }
  if (text.includes('direct') || text.includes('doğrudan') || text.includes('dogrudan')) {
    return 'direct';
  }
  return text === 'dealer' ? 'dealer' : 'direct';
}

function normalizeDateCell(value) {
  if (value === undefined || value === null || value === '') return '';

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    if (typeof XLSX !== 'undefined' && XLSX?.SSF?.format) {
      try {
        const formatted = XLSX.SSF.format('yyyy-mm-dd', value);
        if (formatted) {
          const match = formatted.match(/\d{4}-\d{2}-\d{2}/);
          if (match) return match[0];
        }
      } catch (error) {
        // Ignore and fall back to manual conversion.
      }
    }

    const epoch = new Date(Math.round((value - 25569) * 86400 * 1000));
    if (!Number.isNaN(epoch.getTime())) {
      return epoch.toISOString().slice(0, 10);
    }
  }

  const text = sanitizeText(value);
  if (!text) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  const parts = text.split(/[./]/).map((part) => part.trim());
  if (parts.length === 3) {
    const [part1, part2, part3] = parts;
    if (part1.length && part2.length && part3.length) {
      let day = part1;
      let month = part2;
      let year = part3;
      if (day.length <= 2 && month.length <= 2) {
        if (year.length === 2) {
          year = `20${year}`;
        }
        if (year.length === 4) {
          return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }
    }
  }

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return text;
}

function ensureProjectCollections(project) {
  if (!project) return;
  if (!Array.isArray(project.products)) project.products = [];
  if (!Array.isArray(project.timeline)) project.timeline = [];
  if (!Array.isArray(project.visits)) project.visits = [];
  if (!Array.isArray(project.offers)) project.offers = [];
  if (!Array.isArray(project.payments)) project.payments = [];
}

function clearProjectImportFeedback() {
  if (!projectImportFeedback) return;
  if (projectImportFeedbackTimer) {
    window.clearTimeout(projectImportFeedbackTimer);
    projectImportFeedbackTimer = null;
  }
  projectImportFeedback.textContent = '';
  projectImportFeedback.classList.remove('is-visible');
  if (projectImportFeedback.dataset) {
    delete projectImportFeedback.dataset.tone;
  }
}

function showProjectImportFeedback(message, tone = 'success', timeout = 4000) {
  if (!projectImportFeedback) return;
  clearProjectImportFeedback();
  projectImportFeedback.textContent = message;
  projectImportFeedback.dataset.tone = tone;
  projectImportFeedback.classList.add('is-visible');
  if (timeout > 0) {
    projectImportFeedbackTimer = window.setTimeout(() => {
      clearProjectImportFeedback();
    }, timeout);
  }
}

function updateRequestFormAccess() {
  const statusField = requestForm?.elements.namedItem('status');
  if (statusField instanceof HTMLSelectElement) {
    const disabled = !isManager();
    statusField.disabled = disabled;
    statusField.classList.toggle('is-readonly', disabled);
  }
}

function clearUserModalFeedback() {
  if (!userModalFeedback) return;
  if (userModalFeedbackTimer) {
    window.clearTimeout(userModalFeedbackTimer);
    userModalFeedbackTimer = null;
  }
  userModalFeedback.textContent = '';
  userModalFeedback.classList.remove('is-visible');
}

function showUserModalFeedback(message, timeout = 2500) {
  if (!userModalFeedback) return;
  clearUserModalFeedback();
  userModalFeedback.textContent = message;
  userModalFeedback.classList.add('is-visible');
  userModalFeedbackTimer = window.setTimeout(() => {
    clearUserModalFeedback();
  }, timeout);
}

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
      ownerAssignedAt: '',
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
    if (firm.ownerAssignedAt === undefined) firm.ownerAssignedAt = '';
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
  const ownerSelect = target.querySelector('select[name="firmOwner"]');
  populateStaffSelect(ownerSelect, firm.owner ?? '');
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

  renderAssignments();
  return true;
}

function formatCurrency(amount) {
  return amount.toLocaleString('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  });
}

function formatFileSize(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = value;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(size < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
}

function deriveSalesStatus(project) {
  if (!project) return 'Takipte';
  const hasPayments = Array.isArray(project.payments) && project.payments.length > 0;
  if (hasPayments) return 'Ödeme Alındı';
  const hasOffers = Array.isArray(project.offers) && project.offers.length > 0;
  if (hasOffers) return 'Teklif Verildi';
  const hasVisits = Array.isArray(project.visits) && project.visits.length > 0;
  if (hasVisits) return 'Temas Edildi';
  return project.salesStatus?.trim() || 'Takipte';
}

function refreshProjectStatus(project) {
  if (!project) return;
  const status = deriveSalesStatus(project);
  project.salesStatus = status;

  const statusField = projectInfo?.querySelector('dd[data-field="salesStatus"]');
  if (statusField) {
    statusField.textContent = status || '-';
  }

  if (projectFormMode === 'edit' && projectForm) {
    const originalId = projectForm.elements.namedItem('originalId')?.value || '';
    const currentId = projectForm.elements.namedItem('projectId')?.value || '';
    if (originalId === project.id || (!originalId && currentId === project.id)) {
      setFormValue(projectForm, 'salesStatus', status);
    }
  }

  renderProjectTable(projectSearch?.value ?? '');
  renderAssignments();
}

function getStatusTone(status) {
  const value = status?.toLocaleLowerCase('tr-TR') ?? '';
  if (!value) return 'info';
  if (value.includes('bekle') || value.includes('takip') || value.includes('teklif')) return 'pending';
  if (value.includes('onay') || value.includes('plan') || value.includes('koordin')) return 'review';
  if (value.includes('ödeme') || value.includes('tahsil') || value.includes('gecik')) return 'warning';
  if (value.includes('tamam') || value.includes('teslim') || value.includes('bit')) return 'success';
  return 'info';
}

function computeAssignments() {
  const results = [];

  projectStore.forEach((project) => {
    const manager = project.manager?.trim();
    if (!manager) return;
    const status = project.progress?.trim() || project.salesStatus?.trim() || 'Takipte';
    const date = project.updatedAt || project.addedAt || '';
    results.push({
      id: `project-${project.id}`,
      date,
      person: manager,
      category: 'Proje',
      name: project.name || project.id,
      status,
    });
  });

  const pushFirmAssignments = (store, category) => {
    store.forEach((firm) => {
      const owner = firm.owner?.trim();
      if (!owner) return;
      const status = firm.status?.trim() || 'Takipte';
      const date = firm.ownerAssignedAt || '';
      results.push({
        id: `${category}-${firm.name}`,
        date,
        person: owner,
        category,
        name: firm.name || '-',
        status,
      });
    });
  };

  pushFirmAssignments(constructionFirms, 'İnşaat Firması');
  pushFirmAssignments(mechanicalFirms, 'Mekanik Firması');

  return results
    .map((item) => {
      const timestamp = Date.parse(item.date || '');
      return { ...item, sortValue: Number.isNaN(timestamp) ? 0 : timestamp };
    })
    .sort((a, b) => {
      if (b.sortValue !== a.sortValue) return b.sortValue - a.sortValue;
      return (a.name || '').localeCompare(b.name || '', 'tr');
    })
    .map(({ sortValue, ...item }) => item);
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

function buildAttachmentRecords(fileList) {
  if (!fileList?.length) return [];
  const uploader = currentUser?.fullName || currentUser?.email || '';
  const uploadedAt = new Date().toISOString();

  return Array.from(fileList).map((file) => ({
    id: createId('att'),
    name: file.name,
    size: file.size,
    type: file.type,
    uploadedBy: uploader,
    uploadedAt,
    url: URL.createObjectURL(file),
    file,
  }));
}

function releaseAttachment(attachment) {
  if (!attachment) return;
  if (attachment.url) {
    try {
      URL.revokeObjectURL(attachment.url);
    } catch (error) {
      console.error('URL revoke failed', error);
    }
  }
}

function releaseAttachments(attachments) {
  if (!Array.isArray(attachments)) return;
  attachments.forEach(releaseAttachment);
}

function triggerAttachmentPicker(requestId) {
  if (!currentUser) return;
  const request = requestStore.find((item) => item.id === requestId);
  if (!request) return;

  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.className = 'visually-hidden-input';
  document.body.appendChild(input);
  input.addEventListener('change', () => {
    const files = input.files;
    if (files?.length) {
      const newAttachments = buildAttachmentRecords(files);
      if (newAttachments.length) {
        if (!Array.isArray(request.attachments)) request.attachments = [];
        request.attachments.push(...newAttachments);
        renderRequests();
      }
    }
    input.remove();
  });
  input.click();
}

function removeAttachmentFromRequest(requestId, attachmentId) {
  const request = requestStore.find((item) => item.id === requestId);
  if (!request || !Array.isArray(request.attachments)) return;
  const index = request.attachments.findIndex((attachment) => attachment.id === attachmentId);
  if (index === -1) return;
  const [removed] = request.attachments.splice(index, 1);
  releaseAttachment(removed);
  renderRequests();
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
  const managerSelect = projectForm.elements.namedItem('manager');
  populateStaffSelect(managerSelect, currentUser?.fullName ?? '');
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

function resetRequestForm() {
  if (!requestForm) return;
  requestForm.reset();
  editingRequestId = null;
  setFormValue(requestForm, 'requestId', '');
  populateStaffSelect(requestForm.elements.namedItem('owner'), currentUser?.fullName ?? '');
  updateRequestFormAccess();
  const attachmentInput = requestForm.elements.namedItem('attachments');
  if (attachmentInput instanceof HTMLInputElement) {
    attachmentInput.value = '';
  }
  resetSubmitLabel(requestForm);
}

function setFormValue(form, name, value) {
  if (!form) return;
  const field = form.elements.namedItem(name);
  if (field) {
    field.value = value ?? '';
  }
}

function clearFormFeedback(form) {
  if (!form) return;
  const feedback = form.querySelector('[data-role="feedback"]');
  if (!feedback) return;
  const timer = feedbackTimers.get(feedback);
  if (timer) {
    window.clearTimeout(timer);
    feedbackTimers.delete(feedback);
  }
  feedback.textContent = '';
  feedback.classList.remove('is-visible');
}

function showFormFeedback(form, message) {
  if (!form) return;
  const feedback = form.querySelector('[data-role="feedback"]');
  if (!feedback) return;
  const timer = feedbackTimers.get(feedback);
  if (timer) {
    window.clearTimeout(timer);
    feedbackTimers.delete(feedback);
  }
  feedback.textContent = message;
  feedback.classList.add('is-visible');
  const timeout = window.setTimeout(() => {
    if (feedback.textContent === message) {
      feedback.textContent = '';
      feedback.classList.remove('is-visible');
    }
    feedbackTimers.delete(feedback);
  }, 2000);
  feedbackTimers.set(feedback, timeout);
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
    const managerSelect = projectForm.elements.namedItem('manager');
    const defaultManager = currentUser?.fullName ?? '';
    populateStaffSelect(managerSelect, defaultManager);
    setFormValue(projectForm, 'projectId', '');
    setFormValue(projectForm, 'projectName', '');
    setFormValue(projectForm, 'projectCategory', '');
    setFormValue(projectForm, 'projectCity', '');
    setFormValue(projectForm, 'addedAt', today);
    setFormValue(projectForm, 'updatedAt', today);
    setFormValue(projectForm, 'contractor', '');
    setFormValue(projectForm, 'mechanical', '');
    setFormValue(projectForm, 'salesStatus', '');
    setFormValue(projectForm, 'channel', 'direct');
    setFormValue(projectForm, 'channelName', '');
    setFormValue(projectForm, 'scope', '');
    setFormValue(projectForm, 'responsibleInstitution', '');
    setFormValue(projectForm, 'assignedTeam', '');
    setFormValue(projectForm, 'progress', '');
    setFormValue(projectForm, 'originalId', '');
  } else if (project) {
    const managerSelect = projectForm.elements.namedItem('manager');
    populateStaffSelect(managerSelect, project.manager ?? '');
    setFormValue(projectForm, 'projectId', project.id);
    setFormValue(projectForm, 'projectName', project.name);
    setFormValue(projectForm, 'projectCategory', project.category);
    setFormValue(projectForm, 'projectCity', project.city);
    setFormValue(projectForm, 'addedAt', project.addedAt);
    setFormValue(projectForm, 'updatedAt', project.updatedAt);
    setFormValue(projectForm, 'contractor', project.contractor);
    setFormValue(projectForm, 'mechanical', project.mechanical);
    setFormValue(projectForm, 'salesStatus', project.salesStatus);
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
      const salesStatus = deriveSalesStatus(project);
      project.salesStatus = salesStatus;

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
          <td>${salesStatus}</td>
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

  const salesStatus = deriveSalesStatus(project);
  project.salesStatus = salesStatus;

  projectInfo.innerHTML = `
    <dt>Proje Kodu</dt><dd>${project.id}</dd>
    <dt>Kategori</dt><dd>${project.category}</dd>
    <dt>İl</dt><dd>${project.city}</dd>
    <dt>Eklenme Tarihi</dt><dd>${formatDisplayDate(project.addedAt)}</dd>
    <dt>Son Güncelleme</dt><dd>${formatDisplayDate(project.updatedAt)}</dd>
    <dt>Yüklenici</dt><dd>${project.contractor || '-'}</dd>
    <dt>Mekanik Yüklenici</dt><dd>${project.mechanical || '-'}</dd>
    <dt>Satış Durumu</dt><dd data-field="salesStatus">${salesStatus || '-'}</dd>
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

async function importProjectsFromFile(file) {
  if (!file) {
    throw new Error('İçe aktarılacak dosya bulunamadı.');
  }
  if (typeof XLSX === 'undefined') {
    throw new Error('Excel modülü yüklenemedi.');
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames?.[0];
  if (!sheetName) {
    throw new Error('Excel dosyasında sayfa bulunamadı.');
  }

  const sheet = workbook.Sheets?.[sheetName];
  if (!sheet) {
    throw new Error('Excel sayfası okunamadı.');
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  return applyImportedProjectRows(rows);
}

function applyImportedProjectRows(rows) {
  if (!Array.isArray(rows) || !rows.length) {
    throw new Error('Excel dosyası boş görünüyor.');
  }

  const headerRow = Array.isArray(rows[0]) ? rows[0] : Object.values(rows[0] ?? {});
  const headerFields = headerRow.map((cell) => resolveProjectField(cell));

  if (!headerFields.some(Boolean)) {
    throw new Error('Excel başlıkları tanınmadı. Lütfen şablonu güncelleyin.');
  }

  const today = new Date().toISOString().slice(0, 10);
  let created = 0;
  let updated = 0;
  const processedIds = [];
  const processedSet = new Set();
  let refreshConstruction = false;
  let refreshMechanical = false;

  const trackProcessedId = (id) => {
    if (!id || processedSet.has(id)) return;
    processedSet.add(id);
    processedIds.push(id);
  };

  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const rawRow = rows[rowIndex];
    const cells = Array.isArray(rawRow) ? rawRow : Object.values(rawRow ?? {});
    if (!cells.length) continue;
    if (!cells.some((cell) => sanitizeText(cell))) continue;

    const record = {};
    headerFields.forEach((field, columnIndex) => {
      if (!field) return;
      const cell = cells[columnIndex];
      if (field === 'addedAt' || field === 'updatedAt') {
        record[field] = normalizeDateCell(cell);
      } else if (field === 'channel') {
        record[field] = normalizeChannelValue(cell);
      } else {
        record[field] = sanitizeText(cell);
      }
    });

    let id = sanitizeText(record.id);
    const name = sanitizeText(record.name);

    if (!id && name) {
      id = createId('proj');
      while (getProject(id)) {
        id = createId('proj');
      }
    }

    if (!id && !name) {
      continue;
    }

    const payload = {
      id,
      name: name || id,
      category: sanitizeText(record.category) || 'Özel',
      city: sanitizeText(record.city),
      addedAt: record.addedAt || today,
      updatedAt: record.updatedAt || record.addedAt || today,
      contractor: sanitizeText(record.contractor),
      mechanical: sanitizeText(record.mechanical),
      manager: sanitizeText(record.manager),
      channel: record.channel || 'direct',
      channelName: sanitizeText(record.channelName),
      scope: sanitizeText(record.scope),
      responsibleInstitution: sanitizeText(record.responsibleInstitution),
      assignedTeam: sanitizeText(record.assignedTeam),
      progress: sanitizeText(record.progress),
      salesStatus: sanitizeText(record.salesStatus),
    };

    if (payload.channel !== 'dealer') {
      payload.channelName = '';
    }

    const existing = getProject(payload.id);
    if (existing) {
      existing.name = payload.name;
      existing.category = payload.category;
      existing.city = payload.city;
      existing.addedAt = payload.addedAt;
      existing.updatedAt = payload.updatedAt;
      existing.contractor = payload.contractor;
      existing.mechanical = payload.mechanical;
      existing.manager = payload.manager;
      existing.channel = payload.channel;
      existing.channelName = payload.channelName;
      existing.scope = payload.scope;
      existing.responsibleInstitution = payload.responsibleInstitution;
      existing.assignedTeam = payload.assignedTeam;
      existing.progress = payload.progress;
      if (payload.salesStatus) {
        existing.salesStatus = payload.salesStatus;
      }
      ensureProjectCollections(existing);
      existing.salesStatus = deriveSalesStatus(existing);
      updated += 1;
      trackProcessedId(existing.id);
    } else {
      const newProject = {
        id: payload.id,
        name: payload.name,
        category: payload.category,
        city: payload.city,
        addedAt: payload.addedAt,
        updatedAt: payload.updatedAt,
        contractor: payload.contractor,
        mechanical: payload.mechanical,
        manager: payload.manager,
        channel: payload.channel,
        channelName: payload.channelName,
        scope: payload.scope,
        responsibleInstitution: payload.responsibleInstitution,
        assignedTeam: payload.assignedTeam,
        progress: payload.progress,
        salesStatus: payload.salesStatus,
        products: [],
        timeline: [],
        visits: [],
        offers: [],
        payments: [],
      };
      newProject.salesStatus = deriveSalesStatus(newProject);
      projectStore.push(newProject);
      created += 1;
      trackProcessedId(newProject.id);
    }

    if (payload.contractor) {
      const { created: firmCreated } = ensureFirmRecord('construction', payload.contractor);
      if (firmCreated) refreshConstruction = true;
    }

    if (payload.mechanical) {
      const { created: firmCreated } = ensureFirmRecord('mechanical', payload.mechanical);
      if (firmCreated) refreshMechanical = true;
    }
  }

  if (created === 0 && updated === 0) {
    throw new Error('Excel dosyasında aktarılacak uygun proje kaydı bulunamadı.');
  }

  populateProjectSelector();
  const searchValue = projectSearch?.value ?? '';
  renderProjectTable(searchValue);

  if (!selectedProjectId || !getProject(selectedProjectId)) {
    selectedProjectId = processedIds[0] ?? projectStore[0]?.id ?? null;
  }

  if (selectedProjectId) {
    renderProjectDetail(selectedProjectId);
  } else {
    clearProjectDetails();
  }

  if (refreshConstruction) {
    renderFirmTable(constructionTableBody, constructionFirms, constructionSearch?.value ?? '');
  }
  if (refreshMechanical) {
    renderFirmTable(mechanicalTableBody, mechanicalFirms, mechanicalSearch?.value ?? '');
  }

  renderAssignments();
  return { created, updated };
}

function exportProjectsToExcel() {
  if (typeof XLSX === 'undefined') {
    throw new Error('Excel modülü yüklenemedi.');
  }

  const rows = projectStore.map((project) => {
    ensureProjectCollections(project);
    const status = deriveSalesStatus(project);
    project.salesStatus = status;
    const { offerTotal, paymentTotal } = computeFinancialSummary(project);

    return {
      'Proje Kodu': project.id,
      'Proje Adı': project.name,
      Kategori: project.category,
      'İl': project.city,
      'Eklenme Tarihi': project.addedAt,
      'Son Güncelleme': project.updatedAt,
      'Bağlantı Türü': project.channel === 'dealer' ? 'Bayi' : 'Doğrudan',
      'Bayi / Kanal': project.channel === 'dealer' ? project.channelName : '',
      'Yüklenici': project.contractor,
      'Mekanik Yüklenici': project.mechanical,
      'Proje Sorumlusu': project.manager,
      'Satış Durumu': status,
      'Sorumlu Kurum': project.responsibleInstitution,
      'Atanan Ekip': project.assignedTeam,
      Kapsam: project.scope,
      'İlerleme Notu': project.progress,
      'Süreç Kayıtları': formatTimelineForExport(project.timeline),
      Ürünler: formatProjectProductsForExport(project),
      'Teklif Kayıtları': formatLogEntriesForExport(project.offers, 'offer'),
      'Tahsilat Kayıtları': formatLogEntriesForExport(project.payments, 'payment'),
      'Ziyaret Kayıtları': formatLogEntriesForExport(project.visits, 'visit'),
      'Toplam Teklif': offerTotal,
      'Toplam Tahsilat': paymentTotal,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows, { header: PROJECT_EXPORT_HEADERS });
  worksheet['!cols'] = PROJECT_EXPORT_HEADERS.map((header) => {
    switch (header) {
      case 'Proje Kodu':
        return { wch: 16 };
      case 'Proje Adı':
        return { wch: 32 };
      case 'Kategori':
      case 'İl':
        return { wch: 18 };
      case 'Eklenme Tarihi':
      case 'Son Güncelleme':
        return { wch: 18 };
      case 'Bağlantı Türü':
        return { wch: 20 };
      case 'Bayi / Kanal':
        return { wch: 24 };
      case 'Yüklenici':
      case 'Mekanik Yüklenici':
      case 'Proje Sorumlusu':
        return { wch: 28 };
      case 'Satış Durumu':
        return { wch: 18 };
      case 'Sorumlu Kurum':
      case 'Atanan Ekip':
        return { wch: 26 };
      case 'Kapsam':
      case 'İlerleme Notu':
        return { wch: 40 };
      case 'Süreç Kayıtları':
      case 'Ürünler':
      case 'Teklif Kayıtları':
      case 'Tahsilat Kayıtları':
      case 'Ziyaret Kayıtları':
        return { wch: 52 };
      case 'Toplam Teklif':
      case 'Toplam Tahsilat':
        return { wch: 22 };
      default:
        return { wch: 20 };
    }
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Projeler');

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `proje-veri-havuzu-${timestamp}.xlsx`;
  XLSX.writeFile(workbook, filename, { compression: true });

  return rows.length;
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

function computeFinancialSummary(project) {
  const result = { offerTotal: 0, paymentTotal: 0 };
  if (!project) return result;

  if (Array.isArray(project.products)) {
    project.products.forEach((product) => {
      const offerAmount = Number(product.offer ?? 0);
      const paymentAmount = Number(product.payment ?? 0);
      if (Number.isFinite(offerAmount)) {
        result.offerTotal += offerAmount;
      }
      if (Number.isFinite(paymentAmount)) {
        result.paymentTotal += paymentAmount;
      }
    });
  }

  if (Array.isArray(project.offers)) {
    project.offers.forEach((entry) => {
      const amount = Number(entry.amount ?? 0);
      if (Number.isFinite(amount)) {
        result.offerTotal += amount;
      }
    });
  }

  if (Array.isArray(project.payments)) {
    project.payments.forEach((entry) => {
      const amount = Number(entry.amount ?? 0);
      if (Number.isFinite(amount)) {
        result.paymentTotal += amount;
      }
    });
  }

  return result;
}

function formatTimelineForExport(entries) {
  if (!Array.isArray(entries) || !entries.length) return '';
  return [...entries]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((entry) => {
      const dateLabel = formatDisplayDate(entry.date);
      const title = sanitizeText(entry.title) || '-';
      const note = sanitizeText(entry.notes);
      return `${dateLabel} • ${title}${note ? ' — ' + note : ''}`;
    })
    .join('\n');
}

function formatProjectProductsForExport(project) {
  if (!Array.isArray(project?.products) || !project.products.length) return '';
  return project.products
    .map((item) => {
      const parts = [];
      const group = sanitizeText(item.group) || '-';
      parts.push(group);
      const brand = sanitizeText(item.brand);
      if (brand) parts.push(`Marka: ${brand}`);
      const offerAmount = Number(item.offer ?? 0);
      if (Number.isFinite(offerAmount) && offerAmount) {
        parts.push(`Teklif: ${formatCurrency(offerAmount)}`);
      }
      const paymentAmount = Number(item.payment ?? 0);
      if (Number.isFinite(paymentAmount) && paymentAmount) {
        parts.push(`Tahsilat: ${formatCurrency(paymentAmount)}`);
      }
      return parts.join(' • ');
    })
    .join('\n');
}

function formatLogEntriesForExport(entries, type) {
  if (!Array.isArray(entries) || !entries.length) return '';
  return [...entries]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((entry) => {
      const company = sanitizeText(entry.company) || '-';
      const dateLabel = formatDisplayDate(entry.date);
      const contactParts = [sanitizeText(entry.contact), sanitizeText(entry.phone)].filter(Boolean);
      const notes = sanitizeText(entry.notes);
      const pieces = [dateLabel];

      if (type === 'offer') {
        const amount = Number(entry.amount ?? 0);
        if (Number.isFinite(amount) && amount) {
          pieces.push(formatCurrency(amount));
        }
        const productGroup = sanitizeText(entry.productGroup);
        if (productGroup) {
          pieces.push(`Ürün: ${productGroup}`);
        }
      }

      if (type === 'payment') {
        const amount = Number(entry.amount ?? 0);
        if (Number.isFinite(amount) && amount) {
          pieces.push(formatCurrency(amount));
        }
        const method = sanitizeText(entry.method);
        if (method) {
          pieces.push(`Yöntem: ${method}`);
        }
        const productGroup = sanitizeText(entry.productGroup);
        if (productGroup) {
          pieces.push(`Ürün: ${productGroup}`);
        }
      }

      if (contactParts.length) {
        pieces.push(`Yetkili: ${contactParts.join(' • ')}`);
      }

      const meta = pieces.filter(Boolean).join(' • ');
      return `${company}${meta ? ' • ' + meta : ''}${notes ? ' — ' + notes : ''}`;
    })
    .join('\n');
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

function openFirmCreationForm(type) {
  const form = document.querySelector(`form.firm-create-form[data-firm-type="${type}"]`);
  if (!(form instanceof HTMLFormElement)) return;
  form.reset();
  clearFormFeedback(form);
  window.requestAnimationFrame(() => {
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const nameField = form.elements.namedItem('firmName');
    if (nameField instanceof HTMLElement) {
      nameField.focus();
    }
  });
}

function handleQuickAction(action) {
  switch (action) {
    case 'project':
      activateView('project-detail');
      openProjectForm('create');
      if (projectForm) {
        window.requestAnimationFrame(() => {
          projectForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const idField = projectForm.elements.namedItem('projectId');
          if (idField instanceof HTMLElement) {
            idField.focus();
          }
        });
      }
      break;
    case 'construction':
      activateView('construction-detail');
      openFirmCreationForm('construction');
      break;
    case 'mechanical':
      activateView('mechanical-detail');
      openFirmCreationForm('mechanical');
      break;
    case 'visit-offer':
      activateView('project-detail');
      {
        const visitFormElement = document.getElementById('visitForm');
        if (visitFormElement instanceof HTMLFormElement) {
          window.requestAnimationFrame(() => {
            visitFormElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const companyField = visitFormElement.elements.namedItem('company');
            if (companyField instanceof HTMLElement) {
              companyField.focus();
            }
          });
        }
      }
      break;
    default:
      break;
  }
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
          <select name="firmOwner" data-staff-select data-allow-empty="true"></select>
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
  if (!assignmentTableBody) return;
  const items = computeAssignments();
  if (!items.length) {
    assignmentTableBody.innerHTML = '<tr><td colspan="5">Atama bulunmuyor.</td></tr>';
    return;
  }

  assignmentTableBody.innerHTML = items
    .map((item) => {
      const date = formatDisplayDate(item.date);
      const tone = getStatusTone(item.status);
      return `
        <tr>
          <td>${escapeHtml(date)}</td>
          <td>${escapeHtml(item.person)}</td>
          <td>${escapeHtml(item.category)}</td>
          <td>${escapeHtml(item.name)}</td>
          <td><span class="status-pill status-pill--${tone}">${escapeHtml(item.status)}</span></td>
        </tr>
      `;
    })
    .join('');
}

function renderRequests() {
  if (!requestGrid) return;
  if (!requestStore.length) {
    requestGrid.classList.add('is-empty');
    requestGrid.innerHTML =
      '<p class="muted request-empty">Henüz talep bulunmuyor. Formu kullanarak yeni bir talep ekleyin.</p>';
    return;
  }

  const canManage = isManager();
  requestGrid.classList.remove('is-empty');
  requestGrid.innerHTML = requestStore
    .map((item) => {
      const dueLabel = formatDisplayDate(item.due);
      const tone = getStatusTone(item.status);
      const notesBlock = item.notes
        ? `<p class="request-card__notes">${escapeHtml(item.notes)}</p>`
        : '';
      const attachments = Array.isArray(item.attachments) ? item.attachments : [];
      const attachmentsBlock = attachments.length
        ? `<ul class="request-card__attachments">${attachments
            .map(
              (attachment) => `
                  <li class="request-attachment" data-attachment-id="${escapeHtml(attachment.id)}">
                    <a href="${escapeHtml(attachment.url || '#')}" download="${escapeHtml(attachment.name)}">${escapeHtml(attachment.name)}</a>
                    <span class="request-attachment__meta">${escapeHtml(
                      attachment.uploadedBy || 'Belirtilmedi'
                    )} • ${formatDisplayDate(attachment.uploadedAt)} • ${formatFileSize(attachment.size)}</span>
                    ${
                      canManage
                        ? '<button class="ghost-btn ghost-btn--link" data-action="remove-attachment">Kaldır</button>'
                        : ''
                    }
                  </li>
                `
            )
            .join('')}</ul>`
        : '<p class="request-card__no-attachment muted">Belge eklenmemiş.</p>';
      const createdBy = item.createdBy ? `<span>Oluşturan: ${escapeHtml(item.createdBy)}</span>` : '';
      const createdAtLabel = item.createdAt ? formatDisplayDate(item.createdAt) : '';
      const createdInfo = createdAtLabel ? `<span>Oluşturma: ${escapeHtml(createdAtLabel)}</span>` : '';
      const actions = [
        '<button class="ghost-btn" data-action="add-attachment">Belge Ekle</button>',
        canManage ? '<button class="ghost-btn" data-action="edit-request">Düzenle</button>' : '',
        canManage ? '<button class="ghost-btn danger" data-action="delete-request">Sil</button>' : '',
      ]
        .filter(Boolean)
        .join('');

      return `
        <article class="request-card" data-request-id="${escapeHtml(item.id)}">
          <header class="request-card__header">
            <h3>${escapeHtml(item.title)}</h3>
            <span class="request-card__due">Termin: <strong>${escapeHtml(dueLabel)}</strong></span>
          </header>
          ${notesBlock}
          <div class="request-card__meta">
            <span>Sorumlu: <strong>${escapeHtml(item.owner || '-')}</strong></span>
            <span>Durum: <span class="status-pill status-pill--${tone}">${escapeHtml(item.status || '-')}</span></span>
            ${createdBy}${createdInfo}
          </div>
          ${attachmentsBlock}
          <div class="request-card__actions">${actions}</div>
        </article>
      `;
    })
    .join('');
}

function openRequestEditor(requestId) {
  if (!requestForm || !isManager()) return;
  const request = requestStore.find((item) => item.id === requestId);
  if (!request) return;
  editingRequestId = request.id;
  setSubmitLabel(requestForm, 'Güncelle');
  populateStaffSelect(requestForm.elements.namedItem('owner'), request.owner ?? '');
  setFormValue(requestForm, 'requestId', request.id);
  setFormValue(requestForm, 'title', request.title);
  setFormValue(requestForm, 'due', request.due);
  setFormValue(requestForm, 'status', request.status);
  setFormValue(requestForm, 'notes', request.notes);
  updateRequestFormAccess();
}

function deleteRequest(requestId) {
  if (!isManager()) return false;
  const index = requestStore.findIndex((item) => item.id === requestId);
  if (index === -1) return false;
  const [removed] = requestStore.splice(index, 1);
  releaseAttachments(removed?.attachments);
  if (editingRequestId === requestId) {
    resetRequestForm();
  }
  renderRequests();
  return true;
}

function setupForms() {
  const visitForm = document.getElementById('visitForm');
  const offerForm = document.getElementById('offerForm');
  const paymentForm = document.getElementById('paymentForm');

  registerDefaultLabel(projectForm);
  registerDefaultLabel(productForm);
  registerDefaultLabel(timelineForm);
  registerDefaultLabel(requestForm);
  [visitForm, offerForm, paymentForm].forEach((form) => registerDefaultLabel(form));
  refreshStaffSelectors();
  updateRequestFormAccess();

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
    renderAssignments();
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
    renderAssignments();
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

  requestForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!requestForm || !currentUser) return;
    const formData = new FormData(requestForm);
    const title = formData.get('title')?.trim();
    if (!title) {
      window.alert('Talep başlığı zorunludur.');
      return;
    }

    let requestId = editingRequestId || formData.get('requestId')?.trim() || '';
    if (!requestId) {
      requestId = createId('req');
    } else if (!editingRequestId && requestStore.some((item) => item.id === requestId)) {
      window.alert('Bu talep kodu zaten kullanılıyor.');
      return;
    }

    const canManage = isManager();
    const ownerValue = formData.get('owner')?.trim() || currentUser.fullName || '';
    const statusValue = canManage
      ? formData.get('status')?.trim() || DEFAULT_REQUEST_STATUS
      : DEFAULT_REQUEST_STATUS;
    const notesValue = formData.get('notes')?.trim() ?? '';
    const attachmentsInput = requestForm.elements.namedItem('attachments');
    const newAttachments = attachmentsInput instanceof HTMLInputElement ? buildAttachmentRecords(attachmentsInput.files) : [];

    const payload = {
      id: requestId,
      title,
      owner: ownerValue,
      due: formData.get('due') || '',
      status: statusValue,
      notes: notesValue,
    };

    if (editingRequestId) {
      if (!canManage) {
        window.alert('Talepleri yalnızca yönetici güncelleyebilir.');
        return;
      }
      const target = requestStore.find((item) => item.id === editingRequestId);
      if (target) {
        Object.assign(target, payload);
        if (newAttachments.length) {
          if (!Array.isArray(target.attachments)) target.attachments = [];
          target.attachments.push(...newAttachments);
        }
      }
    } else {
      requestStore.push({
        ...payload,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.fullName || currentUser.email || '',
        attachments: newAttachments,
      });
    }

    resetRequestForm();
    renderRequests();
  });

  requestForm?.querySelector('[data-action="cancel-request"]')?.addEventListener('click', () => {
    resetRequestForm();
  });

  requestGrid?.addEventListener('click', (event) => {
    const button = event.target instanceof HTMLElement ? event.target.closest('button[data-action]') : null;
    if (!button) return;
    const card = button.closest('[data-request-id]');
    const requestId = card?.dataset.requestId;
    if (!requestId) return;

    if (button.dataset.action === 'edit-request') {
      openRequestEditor(requestId);
      return;
    }

    if (button.dataset.action === 'delete-request') {
      if (!isManager()) return;
      if (!window.confirm('Bu talebi silmek istediğinize emin misiniz?')) return;
      deleteRequest(requestId);
      return;
    }

    if (button.dataset.action === 'add-attachment') {
      triggerAttachmentPicker(requestId);
      return;
    }

    if (button.dataset.action === 'remove-attachment') {
      if (!isManager()) return;
      const attachmentId = button.closest('[data-attachment-id]')?.dataset.attachmentId;
      if (!attachmentId) return;
      removeAttachmentFromRequest(requestId, attachmentId);
    }
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
      refreshProjectStatus(project);
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
        refreshProjectStatus(project);
      }
    });
  });

  resetRequestForm();
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

      const previousOwner = firm.owner?.trim() ?? '';
      const city = form.elements.namedItem('firmCity')?.value?.trim() ?? '';
      const contact = form.elements.namedItem('firmContact')?.value?.trim() ?? '';
      const status = form.elements.namedItem('firmStatus')?.value?.trim() ?? '';
      const owner = form.elements.namedItem('firmOwner')?.value?.trim() ?? '';
      const notes = form.elements.namedItem('firmNotes')?.value?.trim() ?? '';

      firm.city = city;
      firm.contact = contact;
      firm.status = status;
      firm.owner = owner;
      if (owner && owner !== previousOwner) {
        firm.ownerAssignedAt = new Date().toISOString().slice(0, 10);
      }
      if (!owner) {
        firm.ownerAssignedAt = '';
      }
      firm.notes = notes;

      setFormValue(form, 'firmCity', firm.city);
      setFormValue(form, 'firmContact', firm.contact);
      setFormValue(form, 'firmStatus', firm.status);
      setFormValue(form, 'firmOwner', firm.owner);
      setFormValue(form, 'firmNotes', firm.notes);

      refreshFirmTable(firmType);
      renderAssignments();
      showFormFeedback(form, 'Bilgiler güncellendi');
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

  document.querySelectorAll('.firm-create-form').forEach((formElement) => {
    if (!(formElement instanceof HTMLFormElement)) return;
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      const firmType = formElement.dataset.firmType;
      if (!firmType) return;

      const nameField = formElement.elements.namedItem('firmName');
      const firmName = nameField?.value?.trim() ?? '';
      if (!firmName) {
        showFormFeedback(formElement, 'Firma adı zorunludur');
        if (nameField instanceof HTMLElement) {
          nameField.focus();
        }
        return;
      }

      const { firm, created } = ensureFirmRecord(firmType, firmName);
      if (!firm) return;

      const previousOwner = firm.owner?.trim() ?? '';
      const city = formElement.elements.namedItem('firmCity')?.value?.trim() ?? '';
      const contact = formElement.elements.namedItem('firmContact')?.value?.trim() ?? '';
      const status = formElement.elements.namedItem('firmStatus')?.value?.trim() ?? '';
      const owner = formElement.elements.namedItem('firmOwner')?.value?.trim() ?? '';
      const notes = formElement.elements.namedItem('firmNotes')?.value?.trim() ?? '';

      firm.city = city;
      firm.contact = contact;
      firm.status = status;
      firm.owner = owner;
      if (owner && owner !== previousOwner) {
        firm.ownerAssignedAt = new Date().toISOString().slice(0, 10);
      }
      if (!owner) {
        firm.ownerAssignedAt = '';
      }
      firm.notes = notes;
      if (!Array.isArray(firm.ongoing)) firm.ongoing = [];
      if (!Array.isArray(firm.completed)) firm.completed = [];

      refreshFirmTable(firmType);
      renderAssignments();
      renderFirmProfilePanel(firmType, firm);
      showFormFeedback(formElement, created ? 'Firma kaydı oluşturuldu' : 'Firma bilgileri güncellendi');

      if (created) {
        formElement.reset();
      }

      const focusField = formElement.elements.namedItem('firmName');
      if (focusField instanceof HTMLElement) {
        focusField.focus();
      }
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

function setupProjectImportExport() {
  projectImportBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    if (!isManager()) {
      showProjectImportFeedback('Excel içe aktarma yalnızca yöneticiler tarafından yapılabilir.', 'error', 6000);
      return;
    }
    projectImportInput?.click();
  });

  projectImportInput?.addEventListener('change', async (event) => {
    const input = event.target;
    const [file] = input?.files ?? [];
    if (input) {
      input.value = '';
    }
    if (!file) return;

    if (!isManager()) {
      showProjectImportFeedback('Excel içe aktarma için yetkiniz bulunmuyor.', 'error', 6000);
      return;
    }
    if (typeof XLSX === 'undefined') {
      showProjectImportFeedback('Excel modülü yüklenemedi.', 'error', 6000);
      return;
    }

    showProjectImportFeedback('Excel dosyası içe aktarılıyor...', 'warning', 0);

    try {
      const result = await importProjectsFromFile(file);
      const created = result?.created ?? 0;
      const updated = result?.updated ?? 0;
      const parts = [];
      if (created) parts.push(`${created} yeni`);
      if (updated) parts.push(`${updated} güncel`);
      const summary = parts.length ? parts.join(', ') : 'kayıt bulunamadı';
      const tone = created || updated ? 'success' : 'warning';
      const message = created || updated
        ? `Excel aktarımı tamamlandı: ${summary}.`
        : 'Excel dosyasında aktarılacak kayıt bulunamadı.';
      showProjectImportFeedback(message, tone, 7000);
    } catch (error) {
      console.error('Excel import error', error);
      const message = error?.message ?? 'Excel aktarımı sırasında bir hata oluştu.';
      showProjectImportFeedback(message, 'error', 7000);
    }
  });

  projectExportBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    if (!projectStore.length) {
      showProjectImportFeedback('Aktarılacak proje bulunmuyor.', 'warning', 5000);
      return;
    }
    if (typeof XLSX === 'undefined') {
      showProjectImportFeedback('Excel modülü yüklenemedi.', 'error', 6000);
      return;
    }

    try {
      const count = exportProjectsToExcel();
      showProjectImportFeedback(`${count} proje Excel'e aktarıldı.`, 'success', 6000);
    } catch (error) {
      console.error('Excel export error', error);
      showProjectImportFeedback('Excel dışa aktarımı sırasında bir hata oluştu.', 'error', 7000);
    }
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

  newRecordModal
    ?.querySelectorAll('[data-quick-action]')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.quickAction;
        close();
        if (action) {
          handleQuickAction(action);
        }
      });
    });
}

function renderUserTable() {
  if (!userTableBody) return;
  if (!userStore.length) {
    userTableBody.innerHTML = '<tr><td colspan="3">Kullanıcı bulunmuyor.</td></tr>';
    return;
  }

  userTableBody.innerHTML = userStore
    .map((user) => {
      const roleSelect = `
        <select data-action="change-role" ${user.id === currentUser?.id ? 'data-self="true"' : ''}>
          <option value="standard" ${user.role === 'standard' ? 'selected' : ''}>Standart</option>
          <option value="manager" ${user.role === 'manager' ? 'selected' : ''}>Yönetici</option>
        </select>
      `;
      return `
        <tr data-user-id="${escapeHtml(user.id)}">
          <td>
            <span class="user-table__name">${escapeHtml(user.fullName)}</span>
            <span class="user-table__email">${escapeHtml(user.email)}</span>
          </td>
          <td>
            <span class="role-badge role-badge--${user.role}">${escapeHtml(getRoleLabel(user.role))}</span>
          </td>
          <td class="user-table__actions">
            ${roleSelect}
            <button class="ghost-btn" data-action="reset-password">Şifre Belirle</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

function openUserModal() {
  if (!userModal || !isManager()) return;
  clearUserModalFeedback();
  renderUserTable();
  refreshStaffSelectors();
  userModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeUserModal() {
  if (!userModal) return;
  userModal.classList.add('hidden');
  document.body.style.overflow = '';
  clearUserModalFeedback();
}

function shouldUppercaseInput(element) {
  if (element instanceof HTMLTextAreaElement) {
    return true;
  }
  if (element instanceof HTMLInputElement) {
    const type = element.type?.toLowerCase?.() ?? '';
    return ['text', 'search', 'email', 'url', 'tel'].includes(type);
  }
  return false;
}

function getUppercasedValue(element, value) {
  if (element instanceof HTMLInputElement) {
    const type = element.type?.toLowerCase?.() ?? '';
    if (type === 'email' || type === 'url') {
      return value.toUpperCase();
    }
  }
  return value.toLocaleUpperCase('tr-TR');
}

function transformInputToUppercase(element) {
  const currentValue = element.value ?? '';
  const uppercased = getUppercasedValue(element, currentValue);
  if (currentValue === uppercased) return;

  let selectionStart = null;
  let selectionEnd = null;
  try {
    selectionStart = element.selectionStart;
    selectionEnd = element.selectionEnd;
  } catch (error) {
    selectionStart = null;
    selectionEnd = null;
  }
  element.value = uppercased;
  if (typeof element.setSelectionRange === 'function' && selectionStart !== null && selectionEnd !== null) {
    const lengthDelta = uppercased.length - currentValue.length;
    const nextStart = selectionStart + lengthDelta;
    const nextEnd = selectionEnd + lengthDelta;
    window.requestAnimationFrame(() => {
      element.setSelectionRange(nextStart, nextEnd);
    });
  }
}

function setupUppercaseInputs() {
  const handleEvent = (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      if (shouldUppercaseInput(target)) {
        transformInputToUppercase(target);
      }
    }
  };

  document.addEventListener('input', handleEvent);
  document.addEventListener('change', handleEvent);

  document
    .querySelectorAll('input[type="text"], input[type="search"], input[type="email"], input[type="url"], input[type="tel"], textarea')
    .forEach((element) => {
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
        if (shouldUppercaseInput(element)) {
          transformInputToUppercase(element);
        }
      }
    });
}

function updateAuthUI() {
  const authenticated = Boolean(currentUser);
  document.body.classList.toggle('is-authenticated', authenticated);
  if (authScreen) {
    authScreen.classList.toggle('hidden', authenticated);
  }
  if (currentUserName) {
    currentUserName.textContent = currentUser?.fullName ?? '';
  }
  if (currentUserRole) {
    currentUserRole.textContent = currentUser ? getRoleLabel(currentUser.role) : '';
  }
  if (userAdminBtn) {
    userAdminBtn.classList.toggle('hidden', !isManager());
  }
  if (!authenticated || !isManager()) {
    closeUserModal();
  }
  refreshStaffSelectors();
  updateRequestFormAccess();
  renderRequests();
}

function setupAuth() {
  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!loginForm) return;
    const formData = new FormData(loginForm);
    const username = formData.get('username')?.toString().trim();
    const password = formData.get('password')?.toString() ?? '';
    const user = findUserByEmail(username ?? '');
    if (!user || !user.password || user.password !== password) {
      if (authError) {
        authError.textContent = 'Kullanıcı adı veya şifre hatalı.';
      }
      return;
    }
    currentUser = user;
    loginForm.reset();
    if (authError) authError.textContent = '';
    updateAuthUI();
    resetProjectForm();
    resetRequestForm();
  });

  logoutBtn?.addEventListener('click', () => {
    currentUser = null;
    updateAuthUI();
    resetProjectForm();
    resetRequestForm();
  });

  userAdminBtn?.addEventListener('click', () => {
    openUserModal();
  });

  userModal?.addEventListener('click', (event) => {
    if (event.target === userModal) {
      closeUserModal();
    }
  });

  userModal?.querySelector('[data-action="close-user-modal"]')?.addEventListener('click', () => {
    closeUserModal();
  });

  if (userForm) {
    registerDefaultLabel(userForm);
    userForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(userForm);
      const fullName = formData.get('fullName')?.toString().trim() ?? '';
      const email = formData.get('email')?.toString().trim() ?? '';
      const password = formData.get('password')?.toString() ?? '';
      const role = formData.get('role') === 'manager' ? 'manager' : 'standard';

      if (!fullName || !email || !password) {
        showFormFeedback(userForm, 'Tüm alanlar zorunludur.');
        return;
      }

      const normalizedEmail = email.toLocaleLowerCase('en-US');
      const existing = findUserByEmail(normalizedEmail);
      if (existing) {
        showFormFeedback(userForm, 'Bu kullanıcı adı zaten tanımlı.');
        return;
      }

      userStore.push({
        id: createId('user'),
        fullName,
        email: normalizedEmail,
        password,
        role,
        status: 'active',
        createdAt: new Date().toISOString(),
      });

      showFormFeedback(userForm, 'Kullanıcı oluşturuldu');
      userForm.reset();
      renderUserTable();
      refreshStaffSelectors();
      updateAuthUI();
    });
  }

  userTableBody?.addEventListener('change', (event) => {
    const select = event.target instanceof HTMLSelectElement ? event.target : null;
    if (!select || select.dataset.action !== 'change-role') return;
    const row = select.closest('tr[data-user-id]');
    const userId = row?.dataset.userId;
    if (!userId) return;
    const user = userStore.find((item) => item.id === userId);
    if (!user) return;
    const newRole = select.value === 'manager' ? 'manager' : 'standard';
    if (user.role === newRole) return;

    if (user.role === 'manager' && newRole !== 'manager') {
      const hasAnother = userStore.some((item) => item.role === 'manager' && item.id !== userId);
      if (!hasAnother) {
        select.value = user.role;
        showUserModalFeedback('En az bir yönetici bulunmalıdır.');
        return;
      }
    }

    user.role = newRole;
    renderUserTable();
    refreshStaffSelectors();
    updateAuthUI();
    showUserModalFeedback('Rol güncellendi.');
  });

  userTableBody?.addEventListener('click', (event) => {
    const button = event.target instanceof HTMLElement ? event.target.closest('button[data-action]') : null;
    if (!button) return;
    const row = button.closest('tr[data-user-id]');
    const userId = row?.dataset.userId;
    if (!userId) return;
    const user = userStore.find((item) => item.id === userId);
    if (!user) return;

    if (button.dataset.action === 'reset-password') {
      const newPassword = window.prompt('Yeni şifreyi girin:');
      if (!newPassword) return;
      user.password = newPassword;
      showUserModalFeedback('Şifre güncellendi.');
    }
  });

  updateAuthUI();
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
  setupProjectImportExport();
  setupModal();
  setupUppercaseInputs();
  activateView('project-pool');
}

setupAuth();
init();
