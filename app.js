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
const mapContainer = document.getElementById('projectMap');
const mapProjectList = document.getElementById('mapProjectList');
const reportSummaryCards = document.getElementById('reportSummaryCards');
const reportCategoryList = document.getElementById('reportCategoryList');
const reportChannelList = document.getElementById('reportChannelList');
const reportCityList = document.getElementById('reportCityList');
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

const coordinateCache = new Map();
const pendingGeocodeLookups = new Map();

function hashString(value) {
  if (value === undefined || value === null) return 0;
  const normalized = normalizeCityKey(value);
  let hash = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = (hash << 5) - hash + normalized.charCodeAt(index);
    hash |= 0; // eslint-disable-line no-bitwise
  }
  return Math.abs(hash);
}

function serializeCoordinateCache() {
  const serialized = {};
  coordinateCache.forEach((value, key) => {
    if (!key) return;
    const normalized = normalizeCoordinates(value);
    if (normalized) {
      serialized[key] = {
        lat: normalized.lat,
        lng: normalized.lng,
        source: value?.source ?? normalized.source ?? 'cache',
      };
    } else {
      serialized[key] = null;
    }
  });
  return serialized;
}

function restoreCoordinateCache(cache) {
  coordinateCache.clear();
  if (!cache || typeof cache !== 'object') return;
  Object.entries(cache).forEach(([key, value]) => {
    if (!key) return;
    const normalized = normalizeCoordinates(value);
    if (normalized) {
      coordinateCache.set(key, {
        lat: normalized.lat,
        lng: normalized.lng,
        source: value?.source ?? normalized.source ?? 'cache',
      });
    } else if (value === null) {
      coordinateCache.set(key, null);
    }
  });
}

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

const numberFormatter = new Intl.NumberFormat('tr-TR');

const MAP_DEFAULT_CENTER = { lat: 39.0, lng: 35.0 };
const MAP_DEFAULT_ZOOM = 6;

const TURKEY_CITY_COORDINATES = {
  ADANA: [37.0007, 35.3213],
  ADIYAMAN: [37.7648, 38.2786],
  AFYONKARAHİSAR: [38.7569, 30.5387],
  AĞRI: [39.7191, 43.0503],
  AKSARAY: [38.3687, 34.037],
  AMASYA: [40.65, 35.8333],
  ANKARA: [39.9208, 32.8541],
  ANTALYA: [36.8969, 30.7133],
  ARDAHAN: [41.1105, 42.7022],
  ARTVİN: [41.1828, 41.8183],
  AYDIN: [37.845, 27.845],
  BALIKESİR: [39.6484, 27.8826],
  BARTIN: [41.6358, 32.3375],
  BATMAN: [37.8812, 41.1351],
  BAYBURT: [40.2552, 40.2249],
  BİLECİK: [40.0567, 30.0665],
  BİNGÖL: [38.885, 40.4983],
  BİTLİS: [38.4015, 42.1078],
  BOLU: [40.732, 31.6116],
  BURDUR: [37.7203, 30.2903],
  BURSA: [40.195, 29.06],
  ÇANAKKALE: [40.1467, 26.4064],
  ÇANKIRI: [40.6013, 33.6134],
  ÇORUM: [40.5506, 34.9556],
  DENİZLİ: [37.7765, 29.0864],
  DİYARBAKIR: [37.9086, 40.2362],
  DÜZCE: [40.8438, 31.1565],
  EDİRNE: [41.6764, 26.555],
  ELAZIĞ: [38.6753, 39.222],
  ERZİNCAN: [39.7505, 39.4928],
  ERZURUM: [39.9043, 41.2679],
  ESKİŞEHİR: [39.7767, 30.5206],
  GAZİANTEP: [37.0662, 37.3833],
  GİRESUN: [40.9128, 38.3895],
  GÜMÜŞHANE: [40.4603, 39.4818],
  HAKKARİ: [37.5744, 43.7408],
  HATAY: [36.2028, 36.1609],
  IĞDIR: [39.9237, 44.045],
  ISPARTA: [37.7648, 30.5567],
  İSTANBUL: [41.0082, 28.9784],
  İZMİR: [38.4237, 27.1428],
  KAHRAMANMARAŞ: [37.581, 36.9371],
  KARABÜK: [41.2061, 32.6204],
  KARAMAN: [37.1759, 33.2287],
  KARS: [40.6013, 43.0949],
  KASTAMONU: [41.3887, 33.7827],
  KAYSERİ: [38.7312, 35.4787],
  KIRIKKALE: [39.8468, 33.5153],
  KIRKLARELİ: [41.7333, 27.2167],
  KIRŞEHİR: [39.1458, 34.163],
  KİLİS: [36.7184, 37.1212],
  KOCAELİ: [40.8533, 29.8815],
  KONYA: [37.8715, 32.4846],
  KÜTAHYA: [39.4242, 29.9833],
  MALATYA: [38.3552, 38.3333],
  MANİSA: [38.6191, 27.4289],
  MARDİN: [37.3129, 40.7339],
  MERSİN: [36.8121, 34.6415],
  MUĞLA: [37.2153, 28.3636],
  MUŞ: [38.7433, 41.5065],
  NEVŞEHİR: [38.6244, 34.7239],
  NİĞDE: [37.9699, 34.6766],
  ORDU: [40.9862, 37.8797],
  OSMANİYE: [37.068, 36.261],
  RİZE: [41.0201, 40.5234],
  SAKARYA: [40.7569, 30.3781],
  SAMSUN: [41.2867, 36.33],
  SİİRT: [37.9333, 41.95],
  SİNOP: [42.0264, 35.1552],
  SİVAS: [39.7477, 37.0179],
  ŞANLIURFA: [37.1674, 38.7955],
  ŞIRNAK: [37.522, 42.4543],
  TEKİRDAĞ: [40.978, 27.511],
  TOKAT: [40.3167, 36.55],
  TRABZON: [41.0015, 39.7178],
  TUNCELİ: [39.1069, 39.548],
  UŞAK: [38.6823, 29.4082],
  VAN: [38.5012, 43.4089],
  YALOVA: [40.655, 29.2769],
  YOZGAT: [39.8206, 34.804],
  ZONGULDAK: [41.4564, 31.7987],
};

const TURKISH_PROVINCES = [
  'Adana',
  'Adıyaman',
  'Afyonkarahisar',
  'Ağrı',
  'Aksaray',
  'Amasya',
  'Ankara',
  'Antalya',
  'Ardahan',
  'Artvin',
  'Aydın',
  'Balıkesir',
  'Bartın',
  'Batman',
  'Bayburt',
  'Bilecik',
  'Bingöl',
  'Bitlis',
  'Bolu',
  'Burdur',
  'Bursa',
  'Çanakkale',
  'Çankırı',
  'Çorum',
  'Denizli',
  'Diyarbakır',
  'Düzce',
  'Edirne',
  'Elazığ',
  'Erzincan',
  'Erzurum',
  'Eskişehir',
  'Gaziantep',
  'Giresun',
  'Gümüşhane',
  'Hakkâri',
  'Hatay',
  'Iğdır',
  'Isparta',
  'İstanbul',
  'İzmir',
  'Kahramanmaraş',
  'Karabük',
  'Karaman',
  'Kars',
  'Kastamonu',
  'Kayseri',
  'Kırıkkale',
  'Kırklareli',
  'Kırşehir',
  'Kilis',
  'Kocaeli',
  'Konya',
  'Kütahya',
  'Malatya',
  'Manisa',
  'Mardin',
  'Mersin',
  'Muğla',
  'Muş',
  'Nevşehir',
  'Niğde',
  'Ordu',
  'Osmaniye',
  'Rize',
  'Sakarya',
  'Samsun',
  'Siirt',
  'Sinop',
  'Sivas',
  'Şanlıurfa',
  'Şırnak',
  'Tekirdağ',
  'Tokat',
  'Trabzon',
  'Tunceli',
  'Uşak',
  'Van',
  'Yalova',
  'Yozgat',
  'Zonguldak',
];

const TURKISH_DISTRICTS = {
  ADANA: [
    'Aladağ',
    'Ceyhan',
    'Çukurova',
    'Feke',
    'İmamoğlu',
    'Karaisalı',
    'Karataş',
    'Kozan',
    'Pozantı',
    'Saimbeyli',
    'Sarıçam',
    'Seyhan',
    'Tufanbeyli',
    'Yumurtalık',
    'Yüreğir',
  ],
  ADIYAMAN: [
    'Adıyaman Merkez',
    'Besni',
    'Çelikhan',
    'Gerger',
    'Gölbaşı',
    'Kahta',
    'Samsat',
    'Sincik',
    'Tut',
  ],
  AFYONKARAHİSAR: [
    'Afyonkarahisar Merkez',
    'Başmakçı',
    'Bayat',
    'Bolvadin',
    'Çay',
    'Çobanlar',
    'Dazkırı',
    'Dinar',
    'Emirdağ',
    'Evciler',
    'Hocalar',
    'İhsaniye',
    'İscehisar',
    'Kızılören',
    'Sandıklı',
    'Sinanpaşa',
    'Sultandağı',
    'Şuhut',
  ],
  AĞRI: [
    'Ağrı Merkez',
    'Diyadin',
    'Doğubayazıt',
    'Eleşkirt',
    'Hamur',
    'Patnos',
    'Taşlıçay',
    'Tutak',
  ],
  AKSARAY: [
    'Ağaçören',
    'Aksaray Merkez',
    'Eskil',
    'Gülağaç',
    'Güzelyurt',
    'Ortaköy',
    'Sarıyahşi',
    'Sultanhanı',
  ],
  AMASYA: [
    'Amasya Merkez',
    'Göynücek',
    'Gümüşhacıköy',
    'Hamamözü',
    'Merzifon',
    'Suluova',
    'Taşova',
  ],
  ANKARA: [
    'Akyurt',
    'Altındağ',
    'Ayaş',
    'Bala',
    'Beypazarı',
    'Çamlıdere',
    'Çankaya',
    'Çubuk',
    'Elmadağ',
    'Etimesgut',
    'Evren',
    'Gölbaşı',
    'Güdül',
    'Haymana',
    'Kalecik',
    'Kahramankazan',
    'Keçiören',
    'Kızılcahamam',
    'Mamak',
    'Nallıhan',
    'Polatlı',
    'Pursaklar',
    'Sincan',
    'Şereflikoçhisar',
    'Yenimahalle',
  ],
  ANTALYA: [
    'Akseki',
    'Aksu',
    'Alanya',
    'Demre',
    'Döşemealtı',
    'Elmalı',
    'Finike',
    'Gazipaşa',
    'Gündoğmuş',
    'İbradı',
    'Kaş',
    'Kemer',
    'Kepez',
    'Konyaaltı',
    'Korkuteli',
    'Kumluca',
    'Manavgat',
    'Muratpaşa',
    'Serik',
  ],
  ARDAHAN: [
    'Ardahan Merkez',
    'Çıldır',
    'Damal',
    'Göle',
    'Hanak',
    'Posof',
  ],
  ARTVİN: [
    'Arhavi',
    'Artvin Merkez',
    'Borçka',
    'Hopa',
    'Kemalpaşa',
    'Murgul',
    'Şavşat',
    'Yusufeli',
  ],
  AYDIN: [
    'Bozdoğan',
    'Buharkent',
    'Çine',
    'Didim',
    'Efeler',
    'Germencik',
    'İncirliova',
    'Karacasu',
    'Karpuzlu',
    'Koçarlı',
    'Köşk',
    'Kuşadası',
    'Kuyucak',
    'Nazilli',
    'Söke',
    'Sultanhisar',
    'Yenipazar',
  ],
  BALIKESİR: [
    'Altıeylül',
    'Ayvalık',
    'Balya',
    'Bandırma',
    'Bigadiç',
    'Burhaniye',
    'Dursunbey',
    'Edremit',
    'Erdek',
    'Gömeç',
    'Gönen',
    'Havran',
    'İvrindi',
    'Karesi',
    'Kepsut',
    'Manyas',
    'Marmara',
    'Savaştepe',
    'Sındırgı',
    'Susurluk',
  ],
  BARTIN: [
    'Amasra',
    'Bartın Merkez',
    'Kurucaşile',
    'Ulus',
  ],
  BATMAN: [
    'Batman Merkez',
    'Beşiri',
    'Gercüş',
    'Hasankeyf',
    'Kozluk',
    'Sason',
  ],
  BAYBURT: [
    'Aydıntepe',
    'Bayburt Merkez',
    'Demirözü',
  ],
  BİLECİK: [
    'Bilecik Merkez',
    'Bozüyük',
    'Gölpazarı',
    'İnhisar',
    'Osmaneli',
    'Pazaryeri',
    'Söğüt',
    'Yenipazar',
  ],
  BİNGÖL: [
    'Adaklı',
    'Bingöl Merkez',
    'Genç',
    'Karlıova',
    'Kiğı',
    'Solhan',
    'Yayladere',
    'Yedisu',
  ],
  BİTLİS: [
    'Adilcevaz',
    'Ahlat',
    'Bitlis Merkez',
    'Güroymak',
    'Hizan',
    'Mutki',
    'Tatvan',
  ],
  BOLU: [
    'Bolu Merkez',
    'Dörtdivan',
    'Gerede',
    'Göynük',
    'Kıbrıscık',
    'Mengen',
    'Mudurnu',
    'Seben',
    'Yeniçağa',
  ],
  BURDUR: [
    'Ağlasun',
    'Altınyayla',
    'Bucak',
    'Burdur Merkez',
    'Çavdır',
    'Çeltikçi',
    'Gölhisar',
    'Karamanlı',
    'Kemer',
    'Tefenni',
    'Yeşilova',
  ],
  BURSA: [
    'Büyükorhan',
    'Gemlik',
    'Gürsu',
    'Harmancık',
    'İnegöl',
    'İznik',
    'Karacabey',
    'Keles',
    'Kestel',
    'Mudanya',
    'Mustafakemalpaşa',
    'Nilüfer',
    'Orhaneli',
    'Orhangazi',
    'Osmangazi',
    'Yenişehir',
    'Yıldırım',
  ],
  ÇANAKKALE: [
    'Ayvacık',
    'Bayramiç',
    'Biga',
    'Bozcaada',
    'Çan',
    'Çanakkale Merkez',
    'Eceabat',
    'Ezine',
    'Gelibolu',
    'Gökçeada',
    'Lapseki',
    'Yenice',
  ],
  ÇANKIRI: [
    'Atkaracalar',
    'Bayramören',
    'Çankırı Merkez',
    'Çerkeş',
    'Eldivan',
    'Ilgaz',
    'Kızılırmak',
    'Korgun',
    'Kurşunlu',
    'Orta',
    'Şabanözü',
    'Yapraklı',
  ],
  ÇORUM: [
    'Alaca',
    'Bayat',
    'Boğazkale',
    'Çorum Merkez',
    'Dodurga',
    'İskilip',
    'Kargı',
    'Laçin',
    'Mecitözü',
    'Oğuzlar',
    'Ortaköy',
    'Osmancık',
    'Sungurlu',
    'Uğurludağ',
  ],
  DENİZLİ: [
    'Acıpayam',
    'Babadağ',
    'Baklan',
    'Bekilli',
    'Beyağaç',
    'Bozkurt',
    'Buldan',
    'Çal',
    'Çameli',
    'Çardak',
    'Çivril',
    'Güney',
    'Honaz',
    'Kale',
    'Merkezefendi',
    'Pamukkale',
    'Sarayköy',
    'Serinhisar',
    'Tavas',
  ],
  DİYARBAKIR: [
    'Bağlar',
    'Bismil',
    'Çermik',
    'Çınar',
    'Çüngüş',
    'Dicle',
    'Eğil',
    'Ergani',
    'Hani',
    'Hazro',
    'Kayapınar',
    'Kocaköy',
    'Kulp',
    'Lice',
    'Silvan',
    'Sur',
    'Yenişehir',
  ],
  DÜZCE: [
    'Akçakoca',
    'Cumayeri',
    'Çilimli',
    'Düzce Merkez',
    'Gölyaka',
    'Gümüşova',
    'Kaynaşlı',
    'Yığılca',
  ],
  EDİRNE: [
    'Edirne Merkez',
    'Enez',
    'Havsa',
    'İpsala',
    'Keşan',
    'Lalapaşa',
    'Meriç',
    'Süloğlu',
    'Uzunköprü',
  ],
  ELAZIĞ: [
    'Ağın',
    'Alacakaya',
    'Arıcak',
    'Baskil',
    'Elazığ Merkez',
    'Karakoçan',
    'Keban',
    'Kovancılar',
    'Maden',
    'Palu',
    'Sivrice',
  ],
  ERZİNCAN: [
    'Çayırlı',
    'Erzincan Merkez',
    'İliç',
    'Kemah',
    'Kemaliye',
    'Otlukbeli',
    'Refahiye',
    'Tercan',
    'Üzümlü',
  ],
  ERZURUM: [
    'Aşkale',
    'Aziziye',
    'Çat',
    'Hınıs',
    'Horasan',
    'İspir',
    'Karaçoban',
    'Karayazı',
    'Köprüköy',
    'Narman',
    'Oltu',
    'Olur',
    'Palandöken',
    'Pasinler',
    'Pazaryolu',
    'Şenkaya',
    'Tekman',
    'Tortum',
    'Uzundere',
    'Yakutiye',
  ],
  ESKİŞEHİR: [
    'Alpu',
    'Beylikova',
    'Çifteler',
    'Günyüzü',
    'Han',
    'İnönü',
    'Mahmudiye',
    'Mihalgazi',
    'Mihalıççık',
    'Odunpazarı',
    'Sarıcakaya',
    'Seyitgazi',
    'Sivrihisar',
    'Tepebaşı',
  ],
  GAZİANTEP: [
    'Araban',
    'İslahiye',
    'Karkamış',
    'Nizip',
    'Nurdağı',
    'Oğuzeli',
    'Şahinbey',
    'Şehitkamil',
    'Yavuzeli',
  ],
  GİRESUN: [
    'Alucra',
    'Bulancak',
    'Çamoluk',
    'Çanakçı',
    'Dereli',
    'Doğankent',
    'Espiye',
    'Eynesil',
    'Giresun Merkez',
    'Görele',
    'Güce',
    'Keşap',
    'Piraziz',
    'Şebinkarahisar',
    'Tirebolu',
    'Yağlıdere',
  ],
  GÜMÜŞHANE: [
    'Gümüşhane Merkez',
    'Kelkit',
    'Köse',
    'Kürtün',
    'Şiran',
    'Torul',
  ],
  HAKKÂRİ: [
    'Çukurca',
    'Derecik',
    'Hakkâri Merkez',
    'Şemdinli',
    'Yüksekova',
  ],
  HATAY: [
    'Altınözü',
    'Antakya',
    'Arsuz',
    'Belen',
    'Defne',
    'Dörtyol',
    'Erzin',
    'Hassa',
    'İskenderun',
    'Kırıkhan',
    'Kumlu',
    'Payas',
    'Reyhanlı',
    'Samandağ',
    'Yayladağı',
  ],
  IĞDIR: [
    'Aralık',
    'Iğdır Merkez',
    'Karakoyunlu',
    'Tuzluca',
  ],
  ISPARTA: [
    'Aksu',
    'Atabey',
    'Eğirdir',
    'Gelendost',
    'Gönen',
    'Isparta Merkez',
    'Keçiborlu',
    'Senirkent',
    'Sütçüler',
    'Şarkikaraağaç',
    'Uluborlu',
    'Yalvaç',
    'Yenişarbademli',
  ],
  İSTANBUL: [
    'Adalar',
    'Arnavutköy',
    'Ataşehir',
    'Avcılar',
    'Bağcılar',
    'Bahçelievler',
    'Bakırköy',
    'Başakşehir',
    'Bayrampaşa',
    'Beşiktaş',
    'Beykoz',
    'Beylikdüzü',
    'Beyoğlu',
    'Büyükçekmece',
    'Çatalca',
    'Çekmeköy',
    'Esenler',
    'Esenyurt',
    'Eyüpsultan',
    'Fatih',
    'Gaziosmanpaşa',
    'Güngören',
    'Kadıköy',
    'Kağıthane',
    'Kartal',
    'Küçükçekmece',
    'Maltepe',
    'Pendik',
    'Sancaktepe',
    'Sarıyer',
    'Silivri',
    'Sultanbeyli',
    'Sultangazi',
    'Şile',
    'Şişli',
    'Tuzla',
    'Ümraniye',
    'Üsküdar',
    'Zeytinburnu',
  ],
  İZMİR: [
    'Aliağa',
    'Balçova',
    'Bayındır',
    'Bayraklı',
    'Bergama',
    'Beydağ',
    'Bornova',
    'Buca',
    'Çeşme',
    'Çiğli',
    'Dikili',
    'Foça',
    'Gaziemir',
    'Güzelbahçe',
    'Karabağlar',
    'Karaburun',
    'Karşıyaka',
    'Kemalpaşa',
    'Kınık',
    'Kiraz',
    'Konak',
    'Menderes',
    'Menemen',
    'Narlıdere',
    'Ödemiş',
    'Seferihisar',
    'Selçuk',
    'Tire',
    'Torbalı',
    'Urla',
  ],
  KAHRAMANMARAŞ: [
    'Afşin',
    'Andırın',
    'Çağlayancerit',
    'Dulkadiroğlu',
    'Ekinözü',
    'Elbistan',
    'Göksun',
    'Onikişubat',
    'Pazarcık',
    'Türkoğlu',
  ],
  KARABÜK: [
    'Eflani',
    'Eskipazar',
    'Karabük Merkez',
    'Ovacık',
    'Safranbolu',
    'Yenice',
  ],
  KARAMAN: [
    'Ayrancı',
    'Başyayla',
    'Ermenek',
    'Karaman Merkez',
    'Kazımkarabekir',
    'Sarıveliler',
  ],
  KARS: [
    'Akyaka',
    'Arpaçay',
    'Digor',
    'Kağızman',
    'Kars Merkez',
    'Sarıkamış',
    'Selim',
    'Susuz',
  ],
  KASTAMONU: [
    'Abana',
    'Ağlı',
    'Araç',
    'Azdavay',
    'Bozkurt',
    'Cide',
    'Çatalzeytin',
    'Daday',
    'Devrekani',
    'Doğanyurt',
    'Hanönü',
    'İhsangazi',
    'İnebolu',
    'Kastamonu Merkez',
    'Küre',
    'Pınarbaşı',
    'Seydiler',
    'Şenpazar',
    'Taşköprü',
    'Tosya',
  ],
  KAYSERİ: [
    'Akkışla',
    'Bünyan',
    'Develi',
    'Felahiye',
    'Hacılar',
    'İncesu',
    'Kocasinan',
    'Melikgazi',
    'Özvatan',
    'Pınarbaşı',
    'Sarız',
    'Talas',
    'Tomarza',
    'Yahyalı',
    'Yeşilhisar',
  ],
  KIRIKKALE: [
    'Bahşılı',
    'Balışeyh',
    'Çelebi',
    'Delice',
    'Karakeçili',
    'Keskin',
    'Kırıkkale Merkez',
    'Sulakyurt',
    'Yahşihan',
  ],
  KIRKLARELİ: [
    'Babaeski',
    'Demirköy',
    'Kırklareli Merkez',
    'Kofçaz',
    'Lüleburgaz',
    'Pehlivanköy',
    'Pınarhisar',
    'Vize',
  ],
  KIRŞEHİR: [
    'Akçakent',
    'Akpınar',
    'Boztepe',
    'Çiçekdağı',
    'Kaman',
    'Kırşehir Merkez',
    'Mucur',
  ],
  KİLİS: [
    'Elbeyli',
    'Kilis Merkez',
    'Musabeyli',
    'Polateli',
  ],
  KOCAELİ: [
    'Başiskele',
    'Çayırova',
    'Darıca',
    'Derince',
    'Dilovası',
    'Gebze',
    'Gölcük',
    'İzmit',
    'Kandıra',
    'Karamürsel',
    'Kartepe',
    'Körfez',
  ],
  KONYA: [
    'Ahırlı',
    'Akören',
    'Akşehir',
    'Altınekin',
    'Beyşehir',
    'Bozkır',
    'Cihanbeyli',
    'Çeltik',
    'Çumra',
    'Derbent',
    'Derebucak',
    'Doğanhisar',
    'Emirgazi',
    'Ereğli',
    'Güneysınır',
    'Hadim',
    'Halkapınar',
    'Hüyük',
    'Ilgın',
    'Kadınhanı',
    'Karapınar',
    'Karatay',
    'Kulu',
    'Meram',
    'Sarayönü',
    'Selçuklu',
    'Seydişehir',
    'Taşkent',
    'Tuzlukçu',
    'Yalıhüyük',
  ],
  KÜTAHYA: [
    'Altıntaş',
    'Aslanapa',
    'Çavdarhisar',
    'Domaniç',
    'Dumlupınar',
    'Emet',
    'Gediz',
    'Hisarcık',
    'Kütahya Merkez',
    'Pazarlar',
    'Şaphane',
    'Simav',
    'Tavşanlı',
  ],
  MALATYA: [
    'Akçadağ',
    'Arapgir',
    'Arguvan',
    'Battalgazi',
    'Darende',
    'Doğanşehir',
    'Doğanyol',
    'Hekimhan',
    'Kale',
    'Kuluncak',
    'Pütürge',
    'Yazıhan',
    'Yeşilyurt',
  ],
  MANİSA: [
    'Ahmetli',
    'Akhisar',
    'Alaşehir',
    'Demirci',
    'Gölmarmara',
    'Gördes',
    'Kırkağaç',
    'Köprübaşı',
    'Kula',
    'Salihli',
    'Sarıgöl',
    'Saruhanlı',
    'Selendi',
    'Soma',
    'Şehzadeler',
    'Turgutlu',
    'Yunusemre',
  ],
  MARDİN: [
    'Artuklu',
    'Dargeçit',
    'Derik',
    'Kızıltepe',
    'Mazıdağı',
    'Midyat',
    'Nusaybin',
    'Ömerli',
    'Savur',
    'Yeşilli',
  ],
  MERSİN: [
    'Akdeniz',
    'Anamur',
    'Aydıncık',
    'Bozyazı',
    'Çamlıyayla',
    'Erdemli',
    'Gülnar',
    'Mezitli',
    'Mut',
    'Silifke',
    'Tarsus',
    'Toroslar',
    'Yenişehir',
  ],
  MUĞLA: [
    'Bodrum',
    'Dalaman',
    'Datça',
    'Fethiye',
    'Kavaklıdere',
    'Köyceğiz',
    'Marmaris',
    'Menteşe',
    'Milas',
    'Ortaca',
    'Seydikemer',
    'Ula',
    'Yatağan',
  ],
  MUŞ: [
    'Bulanık',
    'Hasköy',
    'Korkut',
    'Malazgirt',
    'Muş Merkez',
    'Varto',
  ],
  NEVŞEHİR: [
    'Acıgöl',
    'Avanos',
    'Derinkuyu',
    'Gülşehir',
    'Hacıbektaş',
    'Kozaklı',
    'Nevşehir Merkez',
    'Ürgüp',
  ],
  NİĞDE: [
    'Altunhisar',
    'Bor',
    'Çamardı',
    'Çiftlik',
    'Niğde Merkez',
    'Ulukışla',
  ],
  ORDU: [
    'Akkuş',
    'Altınordu',
    'Aybastı',
    'Çamaş',
    'Çatalpınar',
    'Çaybaşı',
    'Fatsa',
    'Gölköy',
    'Gülyalı',
    'Gürgentepe',
    'İkizce',
    'Kabadüz',
    'Kabataş',
    'Korgan',
    'Kumru',
    'Mesudiye',
    'Perşembe',
    'Ulubey',
    'Ünye',
  ],
  OSMANİYE: [
    'Bahçe',
    'Düziçi',
    'Hasanbeyli',
    'Kadirli',
    'Osmaniye Merkez',
    'Sumbas',
    'Toprakkale',
  ],
  RİZE: [
    'Ardeşen',
    'Çamlıhemşin',
    'Çayeli',
    'Derepazarı',
    'Fındıklı',
    'Güneysu',
    'Hemşin',
    'İkizdere',
    'İyidere',
    'Kalkandere',
    'Pazar',
    'Rize Merkez',
  ],
  SAKARYA: [
    'Adapazarı',
    'Akyazı',
    'Arifiye',
    'Erenler',
    'Ferizli',
    'Geyve',
    'Hendek',
    'Karapürçek',
    'Karasu',
    'Kaynarca',
    'Kocaali',
    'Pamukova',
    'Sapanca',
    'Serdivan',
    'Söğütlü',
    'Taraklı',
  ],
  SAMSUN: [
    'Alaçam',
    'Asarcık',
    'Atakum',
    'Ayvacık',
    'Bafra',
    'Canik',
    'Çarşamba',
    'Havza',
    'İlkadım',
    'Kavak',
    'Ladik',
    'Ondokuzmayıs',
    'Salıpazarı',
    'Tekkeköy',
    'Terme',
    'Vezirköprü',
    'Yakakent',
  ],
  SİİRT: [
    'Baykan',
    'Eruh',
    'Kurtalan',
    'Pervari',
    'Siirt Merkez',
    'Şirvan',
    'Tillo',
  ],
  SİNOP: [
    'Ayancık',
    'Boyabat',
    'Dikmen',
    'Durağan',
    'Erfelek',
    'Gerze',
    'Saraydüzü',
    'Sinop Merkez',
    'Türkeli',
  ],
  SİVAS: [
    'Akıncılar',
    'Altınyayla',
    'Divriği',
    'Doğanşar',
    'Gemerek',
    'Gölova',
    'Gürün',
    'Hafik',
    'İmranlı',
    'Kangal',
    'Koyulhisar',
    'Sivas Merkez',
    'Suşehri',
    'Şarkışla',
    'Ulaş',
    'Yıldızeli',
    'Zara',
  ],
  ŞANLIURFA: [
    'Akçakale',
    'Birecik',
    'Bozova',
    'Ceylanpınar',
    'Eyyübiye',
    'Halfeti',
    'Haliliye',
    'Harran',
    'Hilvan',
    'Karaköprü',
    'Siverek',
    'Suruç',
    'Viranşehir',
  ],
  ŞIRNAK: [
    'Beytüşşebap',
    'Cizre',
    'Güçlükonak',
    'İdil',
    'Silopi',
    'Şırnak Merkez',
    'Uludere',
  ],
  TEKİRDAĞ: [
    'Çerkezköy',
    'Çorlu',
    'Ergene',
    'Hayrabolu',
    'Kapaklı',
    'Malkara',
    'Marmaraereğlisi',
    'Muratlı',
    'Saray',
    'Süleymanpaşa',
    'Şarköy',
  ],
  TOKAT: [
    'Almus',
    'Artova',
    'Başçiftlik',
    'Erbaa',
    'Niksar',
    'Pazar',
    'Reşadiye',
    'Sulusaray',
    'Tokat Merkez',
    'Turhal',
    'Yeşilyurt',
    'Zile',
  ],
  TRABZON: [
    'Akçaabat',
    'Araklı',
    'Arsin',
    'Beşikdüzü',
    'Çarşıbaşı',
    'Çaykara',
    'Dernekpazarı',
    'Düzköy',
    'Hayrat',
    'Köprübaşı',
    'Maçka',
    'Of',
    'Ortahisar',
    'Şalpazarı',
    'Sürmene',
    'Tonya',
    'Vakfıkebir',
    'Yomra',
  ],
  TUNCELİ: [
    'Çemişgezek',
    'Hozat',
    'Mazgirt',
    'Nazımiye',
    'Ovacık',
    'Pertek',
    'Pülümür',
    'Tunceli Merkez',
  ],
  UŞAK: [
    'Banaz',
    'Eşme',
    'Karahallı',
    'Sivaslı',
    'Ulubey',
    'Uşak Merkez',
  ],
  VAN: [
    'Bahçesaray',
    'Başkale',
    'Çaldıran',
    'Çatak',
    'Edremit',
    'Erciş',
    'Gevaş',
    'Gürpınar',
    'İpekyolu',
    'Muradiye',
    'Özalp',
    'Saray',
    'Tuşba',
  ],
  YALOVA: [
    'Altınova',
    'Armutlu',
    'Çınarcık',
    'Çiftlikköy',
    'Termal',
    'Yalova Merkez',
  ],
  YOZGAT: [
    'Akdağmadeni',
    'Aydıncık',
    'Boğazlıyan',
    'Çandır',
    'Çayıralan',
    'Çekerek',
    'Kadışehri',
    'Saraykent',
    'Sarıkaya',
    'Şefaatli',
    'Sorgun',
    'Yenifakılı',
    'Yerköy',
    'Yozgat Merkez',
  ],
  ZONGULDAK: [
    'Alaplı',
    'Çaycuma',
    'Devrek',
    'Ereğli',
    'Gökçebey',
    'Kilimli',
    'Kozlu',
    'Zonguldak Merkez',
  ],
};

const TURKEY_DISTRICT_COORDINATE_OVERRIDES = {
  'BEŞİKTAŞ İSTANBUL': [41.043, 29.0093],
  'BODRUM MUĞLA': [37.0344, 27.4305],
  'ÇANKAYA ANKARA': [39.9208, 32.8541],
  'ÇUKUROVA ADANA': [37.0359, 35.2833],
  'FETHİYE MUĞLA': [36.6514, 29.1236],
  'KADIKÖY İSTANBUL': [40.9919, 29.0272],
  'KARŞIYAKA İZMİR': [38.455, 27.1098],
  'KONAK İZMİR': [38.4192, 27.1287],
  'MERKEZEFENDİ DENİZLİ': [37.7833, 29.05],
  'ODUNPAZARI ESKİŞEHİR': [39.7624, 30.5315],
  'SEYHAN ADANA': [36.9914, 35.3308],
  'TEPEBAŞI ESKİŞEHİR': [39.7843, 30.5167],
  'YENİŞEHİR DİYARBAKIR': [37.9172, 40.2308],
  'YENİŞEHİR MERSİN': [36.8121, 34.6415],
  'YILDIRIM BURSA': [40.1826, 29.1252],
};

const TURKEY_DISTRICT_COORDINATES = (() => {
  const toCoordinatePair = (value) => {
    if (!value) return null;
    if (Array.isArray(value) && value.length >= 2) {
      const lat = Number(value[0]);
      const lng = Number(value[1]);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return [Number(lat.toFixed(6)), Number(lng.toFixed(6))];
      }
      return null;
    }
    if (typeof value === 'object') {
      const normalized = normalizeCoordinates(value);
      if (normalized) {
        return [Number(normalized.lat.toFixed(6)), Number(normalized.lng.toFixed(6))];
      }
    }
    return null;
  };

  const provinceNameMap = new Map();
  TURKISH_PROVINCES.forEach((province) => {
    provinceNameMap.set(normalizeCityKey(province), province);
  });

  const overrides = new Map();
  Object.entries(TURKEY_DISTRICT_COORDINATE_OVERRIDES).forEach(([rawKey, rawCoordinate]) => {
    const normalizedKey = normalizeCityKey(rawKey);
    if (!normalizedKey) return;
    const coordinate = toCoordinatePair(rawCoordinate);
    if (!coordinate) return;
    overrides.set(normalizedKey, coordinate);
  });

  const computeCoordinate = (baseCoordinate, key, index, total) => {
    const base = toCoordinatePair(baseCoordinate);
    if (!base) return null;
    const [baseLat, baseLng] = base;
    const baseLatRad = (baseLat * Math.PI) / 180;
    const hash = hashString(`${key}:${index}:${total}`);
    const angle = (((hash % 3600) / 10) * Math.PI) / 180;
    const spreadKm = 4 + total * 0.8;
    const radiusKm = 3 + ((hash >> 8) % 1000) / 1000 * spreadKm;
    const latOffset = (radiusKm / 111.32) * Math.sin(angle);
    const lngDenominator = Math.max(Math.cos(baseLatRad) * 111.32, 0.0001);
    const lngOffset = (radiusKm / lngDenominator) * Math.cos(angle);
    const lat = Number((baseLat + latOffset).toFixed(6));
    const lng = Number((baseLng + lngOffset).toFixed(6));
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return base;
    }
    return [lat, lng];
  };

  const coordinates = {};

  const setCoordinate = (key, coordinate) => {
    if (!key || !coordinate) return;
    if (coordinates[key]) return;
    coordinates[key] = coordinate;
  };

  Object.entries(TURKISH_DISTRICTS).forEach(([provinceKey, districtList]) => {
    const cityName = provinceNameMap.get(provinceKey) ?? provinceKey;
    const baseCoordinate = TURKEY_CITY_COORDINATES[provinceKey];
    if (!baseCoordinate) return;
    districtList.forEach((districtName, index) => {
      const combinedKey = normalizeCityKey(`${districtName} ${cityName}`);
      if (!combinedKey) return;
      const overrideCoordinate = overrides.get(combinedKey);
      const coordinate = overrideCoordinate ?? computeCoordinate(baseCoordinate, combinedKey, index, districtList.length);
      if (!coordinate) return;
      setCoordinate(combinedKey, coordinate);
      const bareKey = normalizeCityKey(districtName);
      if (bareKey) {
        setCoordinate(bareKey, coordinate);
      }
    });
  });

  overrides.forEach((coordinate, key) => {
    coordinates[key] = coordinate;
  });

  return Object.freeze(coordinates);
})();

let projectMap = null;
let projectMapTileLayer = null;
const projectMarkers = new Map();
let activeMapPopup = null;

let selectedProjectId = projectStore[0]?.id ?? null;
let editingProductId = null;
let editingTimelineId = null;
let editingRequestId = null;
const logEditState = { visit: null, offer: null, payment: null };
let projectFormMode = null;
const defaultSubmitLabels = new Map();
const logForms = {};

let currentView = 'project-pool';

const STORAGE_KEY = 'kalde-panel-state';
let persistStateTimer = null;
let storageSupported = null;

function isStorageSupported() {
  if (storageSupported !== null) {
    return storageSupported;
  }
  if (typeof window === 'undefined' || !window.localStorage) {
    storageSupported = false;
    return storageSupported;
  }
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    storageSupported = true;
  } catch (error) {
    console.warn('Local storage is not available', error);
    storageSupported = false;
  }
  return storageSupported;
}

function clonePlainList(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => (item && typeof item === 'object' ? { ...item } : item));
}

function cloneAttachments(attachments) {
  if (!Array.isArray(attachments)) return [];
  return attachments.map((attachment) => {
    if (!attachment || typeof attachment !== 'object') return null;
    const { file, url, ...rest } = attachment;
    return { ...rest };
  }).filter(Boolean);
}

function cloneProject(project) {
  if (!project || typeof project !== 'object') return null;
  const cloned = {
    ...project,
    products: clonePlainList(project.products),
    timeline: clonePlainList(project.timeline),
    visits: clonePlainList(project.visits),
    offers: clonePlainList(project.offers),
    payments: clonePlainList(project.payments),
  };
  ensureProjectCollections(cloned);
  return cloned;
}

function cloneFirm(firm) {
  if (!firm || typeof firm !== 'object') return null;
  return {
    ...firm,
    ongoing: clonePlainList(firm.ongoing),
    completed: clonePlainList(firm.completed),
  };
}

function cloneRequest(request) {
  if (!request || typeof request !== 'object') return null;
  return {
    ...request,
    attachments: cloneAttachments(request.attachments),
  };
}

function getAppStateSnapshot() {
  return {
    users: clonePlainList(userStore),
    projects: projectStore.map(cloneProject).filter(Boolean),
    constructionFirms: constructionFirms.map(cloneFirm).filter(Boolean),
    mechanicalFirms: mechanicalFirms.map(cloneFirm).filter(Boolean),
    requests: requestStore.map(cloneRequest).filter(Boolean),
    selectedProjectId,
    currentUserId: currentUser?.id ?? null,
    coordinateCache: serializeCoordinateCache(),
  };
}

function persistAppStateNow() {
  if (!isStorageSupported()) return;
  try {
    const snapshot = getAppStateSnapshot();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    console.error('State persistence failed', error);
  }
}

function schedulePersistState() {
  if (!isStorageSupported()) return;
  if (persistStateTimer) {
    window.clearTimeout(persistStateTimer);
  }
  persistStateTimer = window.setTimeout(() => {
    persistStateTimer = null;
    persistAppStateNow();
  }, 200);
}

function normalizeFirmRecord(record) {
  if (!record || typeof record !== 'object') return null;
  const firm = cloneFirm(record);
  if (!Array.isArray(firm.ongoing)) firm.ongoing = [];
  if (!Array.isArray(firm.completed)) firm.completed = [];
  return firm;
}

function normalizeProjectRecord(record) {
  if (!record || typeof record !== 'object') return null;
  const project = cloneProject(record);
  if (!project.id) return null;
  ensureProjectCollections(project);
  project.city = sanitizeText(project.city);
  project.district = sanitizeText(project.district);
  const coordinates = normalizeCoordinates(project.coordinates);
  if (coordinates) {
    project.coordinates = { ...coordinates, source: coordinates.source ?? 'saved' };
  } else {
    const key = getProjectLocationKey(project);
    if (key && coordinateCache.has(key)) {
      const cached = normalizeCoordinates(coordinateCache.get(key));
      if (cached) {
        project.coordinates = { ...cached, source: cached.source ?? 'cache' };
      } else {
        project.coordinates = null;
      }
    } else {
      project.coordinates = null;
    }
  }
  project.category = normalizeProjectCategory(project.category);
  project.housingUnits = normalizeHousingUnits(project.housingUnits);
  project.salesStatus = project.salesStatus || deriveSalesStatus(project);
  return project;
}

function normalizeRequestRecord(record) {
  if (!record || typeof record !== 'object') return null;
  const request = cloneRequest(record);
  request.attachments = cloneAttachments(request.attachments);
  return request;
}

function loadPersistedState() {
  if (!isStorageSupported()) return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);

    if (data.coordinateCache) {
      restoreCoordinateCache(data.coordinateCache);
    } else {
      restoreCoordinateCache(null);
    }

    if (Array.isArray(data.users) && data.users.length) {
      userStore.splice(0, userStore.length, ...data.users.map((user) => ({ ...user })));
    }

    if (Array.isArray(data.projects) && data.projects.length) {
      const projects = data.projects.map(normalizeProjectRecord).filter(Boolean);
      projectStore.splice(0, projectStore.length, ...projects);
    }

    if (Array.isArray(data.constructionFirms)) {
      const firms = data.constructionFirms.map(normalizeFirmRecord).filter(Boolean);
      constructionFirms.splice(0, constructionFirms.length, ...firms);
    }

    if (Array.isArray(data.mechanicalFirms)) {
      const firms = data.mechanicalFirms.map(normalizeFirmRecord).filter(Boolean);
      mechanicalFirms.splice(0, mechanicalFirms.length, ...firms);
    }

    if (Array.isArray(data.requests)) {
      const requests = data.requests.map(normalizeRequestRecord).filter(Boolean);
      requestStore.splice(0, requestStore.length, ...requests);
    }

    if (data.currentUserId) {
      currentUser = userStore.find((user) => user.id === data.currentUserId) ?? null;
    }

    if (data.selectedProjectId && projectStore.some((project) => project.id === data.selectedProjectId)) {
      selectedProjectId = data.selectedProjectId;
    } else {
      selectedProjectId = projectStore[0]?.id ?? null;
    }

    applyCachedCoordinatesToProjects();
  } catch (error) {
    console.error('State load failed', error);
  }
}

const PROJECT_FIELD_ALIASES = {
  id: ['proje kodu', 'proje id', 'id', 'kod', 'referans'],
  name: ['proje adı', 'proje adi', 'adı', 'adi', 'ad', 'project name', 'proje'],
  category: ['kategori', 'proje kategorisi'],
  city: ['il', 'şehir', 'sehir', 'city', 'lokasyon', 'lokasyon ili'],
  district: ['ilçe', 'ilce', 'district'],
  housingUnits: [
    'konut sayısı',
    'konut sayisi',
    'daire sayısı',
    'daire sayisi',
    'konut adedi',
    'konut adet',
    'bağımsız bölüm sayısı',
    'bagimsiz bolum sayisi',
    'bagimsiz bolum',
    'bağımsız bölüm',
    'toplam konut',
  ],
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
    'ilk işlem tarihi',
    'ilk islem tarihi',
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

const TURKISH_CITY_NAMES = new Set(
  [
    'Adana',
    'Adıyaman',
    'Afyonkarahisar',
    'Ağrı',
    'Aksaray',
    'Amasya',
    'Ankara',
    'Antalya',
    'Ardahan',
    'Artvin',
    'Aydın',
    'Balıkesir',
    'Bartın',
    'Batman',
    'Bayburt',
    'Bilecik',
    'Bingöl',
    'Bitlis',
    'Bolu',
    'Burdur',
    'Bursa',
    'Çanakkale',
    'Çankırı',
    'Çorum',
    'Denizli',
    'Diyarbakır',
    'Düzce',
    'Edirne',
    'Elazığ',
    'Erzincan',
    'Erzurum',
    'Eskişehir',
    'Gaziantep',
    'Giresun',
    'Gümüşhane',
    'Hakkari',
    'Hatay',
    'Iğdır',
    'Isparta',
    'İstanbul',
    'İzmir',
    'Kahramanmaraş',
    'Karabük',
    'Karaman',
    'Kars',
    'Kastamonu',
    'Kayseri',
    'Kilis',
    'Kırıkkale',
    'Kırklareli',
    'Kırşehir',
    'Kocaeli',
    'Konya',
    'Kütahya',
    'Malatya',
    'Manisa',
    'Mardin',
    'Mersin',
    'Muğla',
    'Muş',
    'Nevşehir',
    'Niğde',
    'Ordu',
    'Osmaniye',
    'Rize',
    'Sakarya',
    'Samsun',
    'Şanlıurfa',
    'Siirt',
    'Sinop',
    'Sivas',
    'Şırnak',
    'Tekirdağ',
    'Tokat',
    'Trabzon',
    'Tunceli',
    'Uşak',
    'Van',
    'Yalova',
    'Yozgat',
    'Zonguldak',
  ].map((city) => city.toLocaleLowerCase('tr-TR'))
);

const CATEGORY_KEYWORDS = ['toki', 'emlak', 'özel', 'ozel', 'kamu', 'ihale', 'konut', 'residence', 'ticari'];
const CHANNEL_KEYWORDS = ['bayi', 'dealer', 'doğrudan', 'dogrudan', 'direct', 'kanal', 'aracı', 'araci', 'distrib'];
const CONTRACTOR_KEYWORDS = [
  'inş',
  'ins',
  'yapı',
  'yapi',
  'müh',
  'muh',
  'taah',
  'san',
  'tic',
  'yapım',
  'yapim',
  'construction',
  'mimarlık',
  'mimarlik',
];
const MECHANICAL_KEYWORDS = [
  'mekanik',
  'tesisat',
  'hvac',
  'mek',
  'elektrik',
  'klima',
  'otomat',
  'havalandırma',
  'havalandirma',
  'ısıtma',
  'isitma',
];
const SALES_STATUS_KEYWORDS = ['kazan', 'kaybet', 'bekle', 'devam', 'onay', 'ret', 'red', 'iptal', 'teslim', 'revize'];
const INSTITUTION_KEYWORDS = ['belediye', 'idare', 'kurum', 'bakan', 'müdürlük', 'mudurluk', 'toki', 'emlak'];
const TEAM_KEYWORDS = ['ekip', 'team', 'grup', 'satış', 'satis', 'pazarlama', 'mühendis', 'muhendis'];
const SCOPE_KEYWORDS = ['adet', 'daire', 'blok', 'm²', 'm2', 'metre', 'konut', 'faz', 'tower'];
const PROGRESS_KEYWORDS = ['ilerleme', 'tamam', 'inşaat', 'insaat', 'durum', 'aşama', 'asama', 'not'];
const HOUSING_KEYWORDS = [
  'konut',
  'daire',
  'bagimsiz',
  'bağımsız',
  'adet',
  'blok',
  'toplam konut',
  'bağımsız bölüm',
  'bagimsiz bolum',
];
const DEALER_NAME_KEYWORDS = ['bayi', 'dealer', 'distrib', 'fran', 'marka'];

const PROJECT_EXPORT_HEADERS = [
  'Proje Kodu',
  'Proje Adı',
  'Kategori',
  'İl',
  'İlçe',
  'Konut Sayısı',
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

function getProjectLocationFields() {
  if (!(projectForm instanceof HTMLFormElement)) {
    return { citySelect: null, districtSelect: null };
  }
  const city = projectForm.elements.namedItem('projectCity');
  const district = projectForm.elements.namedItem('projectDistrict');
  return {
    citySelect: city instanceof HTMLSelectElement ? city : null,
    districtSelect: district instanceof HTMLSelectElement ? district : null,
  };
}

function populateCitySelect(select, selectedValue) {
  if (!(select instanceof HTMLSelectElement)) return '';
  const normalizedSelected = normalizeCityKey(selectedValue);
  const options = ['<option value="">İl Seçin</option>'];
  let matchedValue = '';

  TURKISH_PROVINCES.forEach((province) => {
    const text = sanitizeText(province);
    if (!text) return;
    const option = `<option value="${escapeHtml(text)}">${escapeHtml(text)}</option>`;
    options.push(option);
    if (normalizedSelected && normalizeCityKey(text) === normalizedSelected) {
      matchedValue = text;
    }
  });

  const extra = sanitizeText(selectedValue);
  if (extra && !matchedValue) {
    options.push(`<option value="${escapeHtml(extra)}">${escapeHtml(extra)}</option>`);
    matchedValue = extra;
  }

  select.innerHTML = options.join('');
  select.value = matchedValue || '';
  return select.value;
}

function populateDistrictSelect(select, cityValue, selectedDistrict) {
  if (!(select instanceof HTMLSelectElement)) return '';
  const normalizedCity = normalizeCityKey(cityValue);
  const normalizedSelected = normalizeCityKey(selectedDistrict);
  const districts = normalizedCity ? TURKISH_DISTRICTS[normalizedCity] ?? [] : [];
  const hasCity = Boolean(normalizedCity);
  const hasDistrictData = districts.length > 0;
  const hasCustomSelection = Boolean(sanitizeText(selectedDistrict));
  const placeholder = hasCity
    ? hasDistrictData || hasCustomSelection
      ? 'İlçe Seçin'
      : 'İlçe bulunamadı'
    : 'Önce il seçin';
  const options = [`<option value="">${escapeHtml(placeholder)}</option>`];
  let matchedValue = '';

  districts.forEach((district) => {
    const text = sanitizeText(district);
    if (!text) return;
    options.push(`<option value="${escapeHtml(text)}">${escapeHtml(text)}</option>`);
    if (normalizedSelected && normalizeCityKey(text) === normalizedSelected) {
      matchedValue = text;
    }
  });

  const extra = sanitizeText(selectedDistrict);
  if (extra && !matchedValue) {
    options.push(`<option value="${escapeHtml(extra)}">${escapeHtml(extra)}</option>`);
    matchedValue = extra;
  }

  select.innerHTML = options.join('');
  select.value = matchedValue || '';
  select.disabled = !hasCity || (!hasDistrictData && !hasCustomSelection);
  return select.value;
}

function applyProjectLocationToForm(city, district) {
  const { citySelect, districtSelect } = getProjectLocationFields();
  if (!citySelect || !districtSelect) return;
  const appliedCity = populateCitySelect(citySelect, city);
  populateDistrictSelect(districtSelect, appliedCity, district);
}

function setupProjectLocationSelectors() {
  const { citySelect, districtSelect } = getProjectLocationFields();
  if (!citySelect || !districtSelect) return;

  const initialCity = citySelect.value || '';
  const initialDistrict = districtSelect.value || '';
  const appliedCity = populateCitySelect(citySelect, initialCity);
  populateDistrictSelect(districtSelect, appliedCity, initialDistrict);

  citySelect.addEventListener('change', () => {
    populateDistrictSelect(districtSelect, citySelect.value, '');
  });
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

function normalizeSearchQuery(value) {
  if (value === undefined || value === null) return '';
  return String(value).toLocaleLowerCase('tr-TR').trim();
}

function normalizeCoordinates(value) {
  if (!value || typeof value !== 'object') return null;
  const lat = Number(value.lat ?? value.latitude ?? value.y);
  const lng = Number(value.lng ?? value.lon ?? value.longitude ?? value.x);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const normalized = { lat, lng };
  if (value.source) {
    normalized.source = value.source;
  }
  return normalized;
}

function normalizeProjectCategory(value) {
  const text = sanitizeText(value);
  if (!text) return 'Özel';
  const normalized = text.toLocaleLowerCase('tr-TR');
  if (normalized.includes('toki')) return 'TOKİ';
  if (normalized.includes('toplu konut')) return 'TOKİ';
  if (normalized.includes('emlak')) return 'Emlak Konut';
  if (
    normalized.includes('kamu') ||
    normalized.includes('beled') ||
    normalized.includes('resmi') ||
    normalized.includes('devlet') ||
    normalized.includes('idare')
  ) {
    return 'Kamu';
  }
  if (
    normalized.includes('özel') ||
    normalized.includes('ozel') ||
    normalized.includes('private') ||
    normalized.includes('residence') ||
    normalized.includes('ticari') ||
    normalized.includes('residans')
  ) {
    return 'Özel';
  }
  return 'Özel';
}

function normalizeHousingUnits(value) {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value <= 0) return '';
    return String(Math.round(value));
  }
  const text = sanitizeText(value);
  if (!text) return '';
  const cleaned = text.replace(/\s+/g, ' ');
  const match = cleaned.match(/\d[\d.,]*/u);
  if (!match) {
    return cleaned;
  }
  const digits = match[0].replace(/\D/g, '');
  if (!digits) {
    return cleaned;
  }
  const numeric = Number(digits);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return '';
  }
  const normalizedNumber = String(Math.trunc(numeric));
  if (!/[a-zçğıöşü]/i.test(cleaned)) {
    return normalizedNumber;
  }
  return cleaned.replace(match[0], normalizedNumber);
}

function gatherColumnValues(rows, columnIndex, startIndex, maxSamples = 40) {
  const values = [];
  for (let rowIndex = startIndex; rowIndex < rows.length && values.length < maxSamples; rowIndex += 1) {
    const rawRow = rows[rowIndex];
    const cells = Array.isArray(rawRow) ? rawRow : Object.values(rawRow ?? {});
    if (columnIndex >= cells.length) continue;
    const cell = cells[columnIndex];
    if (cell === undefined || cell === null) continue;
    if (typeof cell === 'number' && Number.isFinite(cell)) {
      values.push(cell);
      continue;
    }
    const text = sanitizeText(cell);
    if (text) {
      values.push(cell);
    }
  }
  return values;
}

function inferProjectFieldFromData(rows, columnIndex, startIndex, assignedFields, headerValue) {
  const availableFields = Object.keys(PROJECT_FIELD_ALIASES).filter((field) => !assignedFields.has(field));
  if (!availableFields.length) return null;

  const rawValues = gatherColumnValues(rows, columnIndex, startIndex);
  if (!rawValues.length) return null;

  const headerNormalized = normalizeHeaderValue(headerValue ?? '');
  let bestField = null;
  let bestScore = 0;

  availableFields.forEach((field) => {
    const score = scoreColumnForField(field, headerNormalized, rawValues);
    if (score > bestScore) {
      bestField = field;
      bestScore = score;
    }
  });

  if (!bestField) return null;

  const MIN_INFERENCE_SCORE = 3;
  if (bestScore < MIN_INFERENCE_SCORE) {
    return null;
  }

  return bestField;
}

function scoreColumnForField(field, headerNormalized, rawValues) {
  const sanitizedValues = [];
  const filteredRawValues = [];
  rawValues.forEach((value) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'number' && Number.isFinite(value)) {
      sanitizedValues.push(String(value));
      filteredRawValues.push(value);
      return;
    }
    const text = sanitizeText(value);
    if (!text) return;
    sanitizedValues.push(text);
    filteredRawValues.push(value);
  });

  if (!sanitizedValues.length) return 0;

  const header = headerNormalized || '';
  const lowerValues = sanitizedValues.map((value) => value.toLocaleLowerCase('tr-TR'));
  const total = sanitizedValues.length;
  const uniqueRatio = new Set(lowerValues).size / total;
  const spaceRatio = sanitizedValues.filter((value) => value.includes(' ')).length / total;
  const mediumTextRatio = sanitizedValues.filter((value) => value.length >= 12).length / total;
  const longTextRatio = sanitizedValues.filter((value) => value.length >= 35).length / total;
  const numericRatio = sanitizedValues.filter((value) => /^[0-9]+$/.test(value)).length / total;
  const codeRatio = sanitizedValues.filter((value) => /^[0-9a-zA-Z_.\-/]+$/.test(value) && !value.includes(' ')).length / total;
  const shortLengthRatio = sanitizedValues.filter((value) => value.length <= 8).length / total;
  const dateRatio = filteredRawValues.filter((value) => looksLikeDateValue(value)).length / total;
  const cityMatchRatio = lowerValues.filter((value) => isKnownCity(value)).length / total;
  const categoryMatchRatio = lowerValues.filter((value) =>
    CATEGORY_KEYWORDS.some((keyword) => value.includes(keyword))
  ).length / total;
  const contractorMatchRatio = lowerValues.filter((value) =>
    CONTRACTOR_KEYWORDS.some((keyword) => value.includes(keyword))
  ).length / total;
  const mechanicalMatchRatio = lowerValues.filter((value) =>
    MECHANICAL_KEYWORDS.some((keyword) => value.includes(keyword))
  ).length / total;
  const channelKeywordRatio = lowerValues.filter((value) =>
    CHANNEL_KEYWORDS.some((keyword) => value.includes(keyword))
  ).length / total;
  const dealerNameRatio = lowerValues.filter((value) =>
    DEALER_NAME_KEYWORDS.some((keyword) => value.includes(keyword))
  ).length / total;
  const salesKeywordRatio = lowerValues.filter((value) =>
    SALES_STATUS_KEYWORDS.some((keyword) => value.includes(keyword))
  ).length / total;
  const institutionKeywordRatio = lowerValues.filter((value) =>
    INSTITUTION_KEYWORDS.some((keyword) => value.includes(keyword))
  ).length / total;
  const teamKeywordRatio = lowerValues.filter((value) =>
    TEAM_KEYWORDS.some((keyword) => value.includes(keyword))
  ).length / total;
  const scopeKeywordRatio = lowerValues.filter((value) =>
    SCOPE_KEYWORDS.some((keyword) => value.includes(keyword))
  ).length / total;
  const progressKeywordRatio = lowerValues.filter((value) =>
    PROGRESS_KEYWORDS.some((keyword) => value.includes(keyword))
  ).length / total;
  const housingKeywordRatio = lowerValues.filter((value) =>
    HOUSING_KEYWORDS.some((keyword) => value.includes(keyword))
  ).length / total;
  const personMatchRatio = sanitizedValues.filter((value) => isLikelyPersonName(value)).length / total;
  const staffNames = new Set(userStore.map((user) => user.fullName.toLocaleLowerCase('tr-TR')));
  const knownStaffRatio = lowerValues.filter((value) => staffNames.has(value)).length / total;

  let score = 0;

  switch (field) {
    case 'id':
      score += codeRatio * 6;
      score += uniqueRatio * 4;
      score += (1 - spaceRatio) * 2;
      if (numericRatio > 0.5) score += 1.5;
      if (shortLengthRatio > 0.5) score += 1;
      if (header.includes('no') || header.includes('numar') || header.includes('kod') || header.includes('ref')) {
        score += 4;
      }
      break;
    case 'name':
      score += spaceRatio * 5;
      score += mediumTextRatio * 2;
      score += longTextRatio * 2;
      if (
        lowerValues.some((value) =>
          value.includes('proje') || value.includes('site') || value.includes('residence')
        )
      ) {
        score += 2;
      }
      if (header.includes('ad') || header.includes('isim') || header.includes('proje')) {
        score += 4;
      }
      break;
    case 'category':
      score += categoryMatchRatio * 8;
      if (header.includes('kategori')) score += 4;
      if (uniqueRatio <= 0.5) score += 1.5;
      if (shortLengthRatio > 0.4) score += 1;
      break;
    case 'city':
      score += cityMatchRatio * 10;
      if (header.includes('sehir') || header.includes('şehir') || header.includes('lokasyon') || header.includes('il')) {
        score += 4;
      }
      if (spaceRatio < 0.3) score += 0.5;
      break;
    case 'housingUnits':
      score += numericRatio * 8;
      score += housingKeywordRatio * 8;
      if (shortLengthRatio > 0.4) score += 1.5;
      if (
        header.includes('konut') ||
        header.includes('daire') ||
        header.includes('adet') ||
        header.includes('bagimsiz') ||
        header.includes('bağımsız')
      ) {
        score += 4;
      }
      break;
    case 'addedAt':
      score += dateRatio * 9;
      if (header.includes('tarih')) score += 2;
      if (
        header.includes('eklen') ||
        header.includes('oluş') ||
        header.includes('olus') ||
        header.includes('baslang') ||
        header.includes('başlang') ||
        header.includes('ilk')
      ) {
        score += 3;
      }
      break;
    case 'updatedAt':
      score += dateRatio * 9;
      if (header.includes('tarih')) score += 2;
      if (header.includes('son') || header.includes('güncel') || header.includes('guncel')) {
        score += 3;
      }
      break;
    case 'contractor':
      score += contractorMatchRatio * 10;
      if (header.includes('yüklen') || header.includes('yuklen') || header.includes('insaat') || header.includes('firma')) {
        score += 4;
      }
      break;
    case 'mechanical':
      score += mechanicalMatchRatio * 10;
      if (header.includes('mekanik') || header.includes('tesisat')) {
        score += 4;
      }
      break;
    case 'manager':
      score += personMatchRatio * 8;
      score += knownStaffRatio * 5;
      if (
        header.includes('sorum') ||
        header.includes('temsil') ||
        header.includes('yetk') ||
        header.includes('yonet') ||
        header.includes('manager') ||
        header.includes('person')
      ) {
        score += 4;
      }
      break;
    case 'channel':
      score += channelKeywordRatio * 9;
      if (
        header.includes('kanal') ||
        header.includes('baglanti') ||
        header.includes('bağlantı') ||
        header.includes('tip')
      ) {
        score += 4;
      }
      break;
    case 'channelName':
      score += dealerNameRatio * 8;
      if (channelKeywordRatio > 0) score += 2;
      if (header.includes('bayi') || header.includes('kanal')) {
        score += 3;
      }
      break;
    case 'salesStatus':
      score += salesKeywordRatio * 9;
      if (header.includes('satis') || header.includes('satış') || header.includes('durum') || header.includes('status')) {
        score += 4;
      }
      break;
    case 'scope':
      score += scopeKeywordRatio * 7;
      score += numericRatio * 2;
      if (
        header.includes('kapsam') ||
        header.includes('scope') ||
        header.includes('icerik') ||
        header.includes('içerik')
      ) {
        score += 4;
      }
      break;
    case 'responsibleInstitution':
      score += institutionKeywordRatio * 9;
      if (header.includes('kurum') || header.includes('idare') || header.includes('beled') || header.includes('paydas')) {
        score += 4;
      }
      break;
    case 'assignedTeam':
      score += teamKeywordRatio * 9;
      if (header.includes('ekip') || header.includes('team') || header.includes('grup')) {
        score += 4;
      }
      break;
    case 'progress':
      score += progressKeywordRatio * 8;
      score += longTextRatio * 4;
      if (header.includes('not') || header.includes('acik') || header.includes('açıkl') || header.includes('ilerleme') || header.includes('durum')) {
        score += 4;
      }
      break;
    default:
      break;
  }

  return score;
}

function looksLikeDateValue(value) {
  if (value === undefined || value === null || value === '') return false;
  const normalized = normalizeDateCell(value);
  if (!normalized) return false;
  const year = Number(normalized.slice(0, 4));
  if (!Number.isFinite(year)) return false;
  return year >= 1900 && year <= 2100;
}

function isKnownCity(value) {
  if (!value) return false;
  const normalized = String(value)
    .toLocaleLowerCase('tr-TR')
    .replace(/\s+/g, ' ')
    .trim();
  if (!normalized) return false;
  return TURKISH_CITY_NAMES.has(normalized);
}

function isLikelyPersonName(value) {
  if (!value) return false;
  const parts = String(value)
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length < 2 || parts.length > 4) return false;
  let score = 0;
  parts.forEach((part) => {
    if (/^[A-ZÇĞİÖŞÜ][a-zçğıöşü'’-]+$/.test(part) || /^[A-ZÇĞİÖŞÜ]+$/.test(part)) {
      score += 1;
    }
  });
  return score >= parts.length - 1;
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
    schedulePersistState();
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
    schedulePersistState();
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
  schedulePersistState();
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

function formatHousingUnits(value) {
  const normalized = normalizeHousingUnits(value);
  if (!normalized) return '-';
  const digits = normalized.replace(/\D/g, '');
  if (digits) {
    const numeric = Number(digits);
    if (Number.isFinite(numeric) && numeric > 0) {
      const formatted = new Intl.NumberFormat('tr-TR').format(Math.trunc(numeric));
      if (/^[0-9]+$/.test(normalized)) {
        return formatted;
      }
      return normalized.replace(digits, formatted);
    }
  }
  return normalized;
}

function getHousingUnitTotal(value) {
  const normalized = normalizeHousingUnits(value);
  if (!normalized) return 0;
  const digits = normalized.match(/\d+/g);
  if (!digits) return 0;
  const numeric = Number(digits.join(''));
  return Number.isFinite(numeric) ? numeric : 0;
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
        schedulePersistState();
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
  schedulePersistState();
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
  applyProjectLocationToForm('', '');
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
    applyProjectLocationToForm('', '');
    const today = new Date().toISOString().slice(0, 10);
    const managerSelect = projectForm.elements.namedItem('manager');
    const defaultManager = currentUser?.fullName ?? '';
    populateStaffSelect(managerSelect, defaultManager);
    setFormValue(projectForm, 'projectId', '');
    setFormValue(projectForm, 'projectName', '');
    setFormValue(projectForm, 'projectCategory', '');
    setFormValue(projectForm, 'housingUnits', '');
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
    applyProjectLocationToForm(project.city, project.district);
    setFormValue(projectForm, 'housingUnits', normalizeHousingUnits(project.housingUnits));
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

function getActiveProjectFilters() {
  return {
    project: projectSearch?.value ?? '',
    construction: constructionSearch?.value ?? '',
    mechanical: mechanicalSearch?.value ?? '',
  };
}

function renderProjectTable(filterInput) {
  const activeFilters = getActiveProjectFilters();
  let requestedFilters;

  if (typeof filterInput === 'string') {
    requestedFilters = { ...activeFilters, project: filterInput };
  } else if (filterInput && typeof filterInput === 'object') {
    requestedFilters = { ...activeFilters, ...filterInput };
  } else {
    requestedFilters = activeFilters;
  }

  const queries = {
    project: normalizeSearchQuery(requestedFilters.project),
    construction: normalizeSearchQuery(requestedFilters.construction),
    mechanical: normalizeSearchQuery(requestedFilters.mechanical),
  };

  const filteredProjects = projectStore.filter((project) => {
    const housingText = normalizeHousingUnits(project.housingUnits);
    const generalText = [
      project.id,
      project.name,
      project.city,
      project.district,
      project.category,
      project.contractor,
      project.mechanical,
      project.manager,
      project.scope,
      project.responsibleInstitution,
      housingText,
      project.channelName,
    ]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('tr-TR');

    if (queries.project && !generalText.includes(queries.project)) {
      return false;
    }

    if (queries.construction) {
      const contractorText = normalizeSearchQuery(project.contractor);
      if (!contractorText || !contractorText.includes(queries.construction)) {
        return false;
      }
    }

    if (queries.mechanical) {
      const mechanicalText = normalizeSearchQuery(project.mechanical);
      if (!mechanicalText || !mechanicalText.includes(queries.mechanical)) {
        return false;
      }
    }

    return true;
  });

  let normalizedDuringRender = false;
  projectTableBody.innerHTML = filteredProjects
    .map((project) => {
      const statusClass = project.channel === 'direct' ? 'status-direct' : 'status-dealer';
      const channelLabel = project.channel === 'direct' ? 'Doğrudan' : `Bayi (${project.channelName ?? 'Belirtilmedi'})`;
      const salesStatus = deriveSalesStatus(project);
      project.salesStatus = salesStatus;
      const normalizedHousing = normalizeHousingUnits(project.housingUnits);
      if (project.housingUnits !== normalizedHousing) {
        project.housingUnits = normalizedHousing;
        normalizedDuringRender = true;
      }
      const housingLabel = formatHousingUnits(project.housingUnits);

      return `
        <tr data-project-id="${project.id}" class="${project.id === selectedProjectId ? 'is-active' : ''}">
          <td class="status-chip ${statusClass}">${channelLabel}</td>
          <td>${formatDisplayDate(project.addedAt)}</td>
          <td>${formatDisplayDate(project.updatedAt)}</td>
          <td>${project.category}</td>
          <td>${escapeHtml(project.city || '')}</td>
          <td>${escapeHtml(project.district || '')}</td>
          <td>${escapeHtml(housingLabel)}</td>
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
    const category = normalizeProjectCategory(project.category);
    if (category !== project.category) {
      project.category = category;
      normalizedDuringRender = true;
    }
    if (totals[category] !== undefined) {
      totals[category] += 1;
    }
  });

  counts['TOKİ'].textContent = totals['TOKİ'];
  counts['Emlak Konut'].textContent = totals['Emlak Konut'];
  counts['Özel'].textContent = totals['Özel'];
  counts['Kamu'].textContent = totals['Kamu'];

  renderProjectReports();
  renderProjectMap();

  if (normalizedDuringRender) {
    schedulePersistState();
  }
}

function normalizeCityKey(city) {
  if (city === undefined || city === null) return '';
  const text = String(city).replace(/[()]/g, ' ');
  const upper = text.toLocaleUpperCase('tr-TR');
  return upper.replace(/\s+/g, ' ').trim().replace(/\s+(İLİ|MERKEZ)$/u, '');
}

function getProjectLocationKey(project) {
  if (!project || typeof project !== 'object') return '';
  const city = sanitizeText(project.city);
  const district = sanitizeText(project.district);
  const parts = [];
  if (district) parts.push(district);
  if (city) parts.push(city);
  if (!parts.length) return '';
  return normalizeCityKey(parts.join(' '));
}

function applyCoordinatesToProjects(locationKey, coordinates, source = 'geocode') {
  if (!locationKey) return false;
  const normalized = normalizeCoordinates(coordinates);
  if (!normalized) return false;
  const entry = { lat: normalized.lat, lng: normalized.lng, source };
  coordinateCache.set(locationKey, entry);
  let updated = false;
  projectStore.forEach((project) => {
    if (getProjectLocationKey(project) === locationKey) {
      project.coordinates = { ...entry };
      updated = true;
    }
  });
  return updated;
}

function queueProjectGeocode(project) {
  if (!project || typeof window === 'undefined' || typeof window.fetch !== 'function') return;
  const locationKey = getProjectLocationKey(project);
  if (!locationKey) return;
  if (pendingGeocodeLookups.has(locationKey)) return;
  if (coordinateCache.has(locationKey)) return;

  const district = sanitizeText(project.district);
  const city = sanitizeText(project.city);
  const queryParts = [];
  if (district) queryParts.push(district);
  if (city && !district.toLocaleUpperCase('tr-TR').includes(city.toLocaleUpperCase('tr-TR'))) {
    queryParts.push(city);
  }
  queryParts.push('Türkiye');
  const query = encodeURIComponent(queryParts.join(' '));
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=tr&countrycodes=tr&q=${query}`;

  const lookup = window
    .fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    })
    .then((response) => {
      if (!response.ok) return null;
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data) || !data.length) {
        coordinateCache.set(locationKey, null);
        return;
      }
      const [result] = data;
      const lat = Number(result?.lat);
      const lng = Number(result?.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        coordinateCache.set(locationKey, null);
        return;
      }
      const updated = applyCoordinatesToProjects(locationKey, { lat, lng }, 'geocode');
      if (updated) {
        schedulePersistState();
        renderProjectMap();
      }
    })
    .catch((error) => {
      console.error('District geocode failed', error);
      coordinateCache.set(locationKey, null);
    })
    .finally(() => {
      pendingGeocodeLookups.delete(locationKey);
    });

  pendingGeocodeLookups.set(locationKey, lookup);
}

function applyCachedCoordinatesToProjects() {
  projectStore.forEach((project) => {
    if (!project) return;
    const existing = normalizeCoordinates(project.coordinates);
    if (existing) {
      project.coordinates = { ...existing, source: existing.source ?? 'saved' };
      return;
    }
    const key = getProjectLocationKey(project);
    if (!key) return;
    if (!coordinateCache.has(key)) return;
    const cached = normalizeCoordinates(coordinateCache.get(key));
    if (!cached) return;
    project.coordinates = { ...cached, source: cached.source ?? 'cache' };
  });
}

function findCityCoordinates(city) {
  const key = normalizeCityKey(city);
  if (!key) return null;
  if (TURKEY_DISTRICT_COORDINATES[key]) {
    return TURKEY_DISTRICT_COORDINATES[key];
  }
  if (TURKEY_CITY_COORDINATES[key]) {
    return TURKEY_CITY_COORDINATES[key];
  }
  const pieces = key
    .split(/[\\/,-]/u)
    .map((part) => part.trim())
    .filter(Boolean);
  for (const part of pieces) {
    if (TURKEY_DISTRICT_COORDINATES[part]) {
      return TURKEY_DISTRICT_COORDINATES[part];
    }
    if (TURKEY_CITY_COORDINATES[part]) {
      return TURKEY_CITY_COORDINATES[part];
    }
  }
  for (const [name, coords] of Object.entries(TURKEY_DISTRICT_COORDINATES)) {
    if (key.includes(name)) {
      return coords;
    }
  }
  for (const [name, coords] of Object.entries(TURKEY_CITY_COORDINATES)) {
    if (key.includes(name)) {
      return coords;
    }
  }
  return null;
}

function findProjectCoordinates(project) {
  if (!project) return null;
  const stored = normalizeCoordinates(project.coordinates);
  if (stored) {
    return stored;
  }
  const cacheKey = getProjectLocationKey(project);
  if (cacheKey && coordinateCache.has(cacheKey)) {
    const cached = normalizeCoordinates(coordinateCache.get(cacheKey));
    if (cached) {
      return cached;
    }
  }
  const city = sanitizeText(project.city);
  const district = sanitizeText(project.district);
  if (district) {
    const districtWithCity = [district, city].filter(Boolean).join(' ');
    const districtCoords = findCityCoordinates(districtWithCity);
    if (districtCoords) return districtCoords;
    const directDistrict = findCityCoordinates(district);
    if (directDistrict) return directDistrict;
  }
  if (city) {
    return findCityCoordinates(city);
  }
  return null;
}

function formatProjectLocation(project) {
  if (!project) return '';
  const city = sanitizeText(project.city);
  const district = sanitizeText(project.district);
  if (city && district) {
    return `${district} / ${city}`;
  }
  return city || district || '';
}

function toLatLng(coordinates) {
  if (!coordinates) return null;
  if (Array.isArray(coordinates)) {
    const [lat, lng] = coordinates;
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
    return null;
  }
  if (typeof coordinates === 'object' && coordinates !== null) {
    const { lat, lng } = coordinates;
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
  }
  return null;
}

function showMapError(message) {
  if (!mapContainer) return;
  const fallback = 'Harita bileşeni yüklenemedi.';
  const composed = message ? `${fallback} (${message})` : fallback;
  mapContainer.innerHTML = `<p class="muted">${escapeHtml(composed)}</p>`;
  mapContainer.dataset.error = 'true';
  if (mapProjectList) {
    mapProjectList.innerHTML = `<li class="muted">${escapeHtml(composed)}</li>`;
  }
}

function clearMapError() {
  if (mapContainer?.dataset?.error) {
    mapContainer.innerHTML = '';
    delete mapContainer.dataset.error;
  }
}

function destroyProjectMap() {
  if (activeMapPopup?.remove) {
    activeMapPopup.remove();
  }
  activeMapPopup = null;
  projectMarkers.forEach(({ marker }) => {
    if (marker?.remove) {
      marker.remove();
    }
  });
  projectMarkers.clear();
  if (projectMap) {
    projectMap.off();
    projectMap.remove();
    projectMap = null;
    projectMapTileLayer = null;
  }
  if (mapContainer) {
    mapContainer.innerHTML = '';
    delete mapContainer.dataset.error;
  }
  if (mapProjectList) {
    mapProjectList.innerHTML = '';
  }
}

function renderProjectMap() {
  if (!mapContainer) return;

  if (typeof window === 'undefined' || !window.L) {
    showMapError('Harita kütüphanesi yüklenemedi.');
    return;
  }

  clearMapError();

  if (!projectMap) {
    mapContainer.innerHTML = '';
    projectMap = window.L.map(mapContainer, {
      zoomControl: true,
    });
    projectMap.setView([MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng], MAP_DEFAULT_ZOOM);
    projectMap.on('popupclose', () => {
      activeMapPopup = null;
    });
  }

  if (!projectMapTileLayer) {
    projectMapTileLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap katkıda bulunanlar',
    });
    projectMapTileLayer.addTo(projectMap);
  }

  if (activeMapPopup?.remove) {
    activeMapPopup.remove();
    activeMapPopup = null;
  }

  projectMarkers.forEach(({ marker }) => {
    if (marker?.remove) {
      marker.remove();
    }
  });
  projectMarkers.clear();

  const entries = projectStore
    .map((project, index) => {
      const coordinates = findProjectCoordinates(project);
      const position = toLatLng(coordinates);
      if (!position) {
        queueProjectGeocode(project);
        return null;
      }
      const key = project.id?.trim() || `map-${index}`;
      return { project, position, markerKey: key };
    })
    .filter(Boolean);

  const bounds = [];
  let hasBounds = false;

  entries.forEach(({ project, position, markerKey }) => {
    const marker = window.L.marker([position.lat, position.lng], {
      title: project.name || project.id || 'Proje',
    }).addTo(projectMap);

    const housingLabel = formatHousingUnits(project.housingUnits);
    const locationLabel = formatProjectLocation(project);
    const metaParts = [locationLabel, project.category]
      .filter(Boolean)
      .map((value) => escapeHtml(value));
    const details = [
      `<strong>${escapeHtml(project.name || project.id || 'PROJE')}</strong>`,
      metaParts.length ? `<span>${metaParts.join(' • ')}</span>` : '',
      project.id ? `<span>Kod: ${escapeHtml(project.id)}</span>` : '',
      `<span>Konut: ${escapeHtml(housingLabel)}</span>`,
      project.contractor ? `<span>Yüklenici: ${escapeHtml(project.contractor)}</span>` : '',
      project.mechanical ? `<span>Mekanik: ${escapeHtml(project.mechanical)}</span>` : '',
    ].filter(Boolean);

    marker.bindPopup(`<div class="map-popup">${details.join('<br />')}</div>`);
    marker.on('popupopen', (event) => {
      activeMapPopup = event.popup;
    });

    bounds.push([position.lat, position.lng]);
    hasBounds = true;
    projectMarkers.set(markerKey, { marker });
  });

  if (hasBounds) {
    const leafletBounds = window.L.latLngBounds(bounds);
    projectMap.fitBounds(leafletBounds, { padding: [48, 48] });
    const zoom = projectMap.getZoom();
    if (zoom && zoom > 11) {
      projectMap.setZoom(11);
    }
  } else {
    projectMap.setView([MAP_DEFAULT_CENTER.lat, MAP_DEFAULT_CENTER.lng], MAP_DEFAULT_ZOOM);
  }

  if (mapProjectList) {
    if (!entries.length) {
      mapProjectList.innerHTML = '<li class="muted">Konumu belirlenen proje bulunmuyor.</li>';
    } else {
      const items = [...entries]
        .sort((a, b) => (a.project.name || '').localeCompare(b.project.name || '', 'tr'))
        .map(({ project, markerKey }) => {
          const locationLabel = formatProjectLocation(project);
          const meta = [locationLabel, project.category]
            .filter(Boolean)
            .map((value) => escapeHtml(value));
          const subtitle = meta.length ? meta.join(' • ') : 'Bilgi bulunmuyor';
          return `
            <li>
              <button type="button" data-project-id="${escapeHtml(markerKey)}">
                <span class="map-project__name">${escapeHtml(project.name || project.id || 'PROJE')}</span>
                <span class="map-project__meta">${subtitle}</span>
              </button>
            </li>
          `;
        })
        .join('');
      mapProjectList.innerHTML = items;
    }
  }

  if (currentView === 'project-maps') {
    window.requestAnimationFrame(() => {
      projectMap?.invalidateSize();
    });
  }
}

function renderProjectReports() {
  if (!reportSummaryCards && !reportCategoryList && !reportChannelList && !reportCityList) {
    return;
  }

  const totalProjects = projectStore.length;
  const totalHousingUnits = projectStore.reduce(
    (sum, project) => sum + getHousingUnitTotal(project.housingUnits),
    0,
  );
  const averageHousing = totalProjects ? Math.round(totalHousingUnits / totalProjects) : 0;

  if (reportSummaryCards) {
    const summaryCards = [
      {
        title: 'Toplam Proje',
        metric: numberFormatter.format(totalProjects),
        hint: 'Aktif kayıt sayısı',
      },
      {
        title: 'Toplam Konut',
        metric: numberFormatter.format(totalHousingUnits),
        hint: 'Projelerdeki toplam konut adedi',
      },
      {
        title: 'Ortalama Konut',
        metric: totalProjects ? numberFormatter.format(averageHousing) : '-',
        hint: 'Proje başına ortalama konut',
      },
    ];

    reportSummaryCards.innerHTML = summaryCards
      .map(
        (card) => `
          <article class="report-card">
            <h3>${card.title}</h3>
            <p class="report-card__metric">${card.metric}</p>
            <p class="muted">${card.hint}</p>
          </article>
        `,
      )
      .join('');
  }

  if (reportCategoryList) {
    const categoryOrder = ['TOKİ', 'Emlak Konut', 'Özel', 'Kamu'];
    const categoryTotals = categoryOrder.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {});

    projectStore.forEach((project) => {
      const category = normalizeProjectCategory(project.category);
      if (!(category in categoryTotals)) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += 1;
    });

    const orderedEntries = [
      ...categoryOrder.map((category) => [category, categoryTotals[category] ?? 0]),
      ...Object.keys(categoryTotals)
        .filter((category) => !categoryOrder.includes(category))
        .map((category) => [category, categoryTotals[category]]),
    ];

    reportCategoryList.innerHTML = orderedEntries
      .map(([category, count]) => {
        const share = totalProjects ? Math.round((count / totalProjects) * 100) : 0;
        return `
          <li>
            <span class="report-list__label">${escapeHtml(category)}</span>
            <span class="report-list__value">${numberFormatter.format(count)} proje • %${share}</span>
          </li>
        `;
      })
      .join('');
  }

  if (reportChannelList) {
    const channelMetrics = {
      direct: { count: 0, housing: 0 },
      dealer: { count: 0, housing: 0 },
    };

    projectStore.forEach((project) => {
      const key = project.channel === 'dealer' ? 'dealer' : 'direct';
      channelMetrics[key].count += 1;
      channelMetrics[key].housing += getHousingUnitTotal(project.housingUnits);
    });

    const channelItems = [
      { key: 'direct', label: 'Doğrudan' },
      { key: 'dealer', label: 'Bayi / Kanal' },
    ]
      .map(({ key, label }) => {
        const data = channelMetrics[key];
        return `
          <li>
            <span class="report-list__label">${label}</span>
            <span class="report-list__value">${numberFormatter.format(data.count)} proje • ${numberFormatter.format(data.housing)} konut</span>
          </li>
        `;
      })
      .join('');

    reportChannelList.innerHTML = channelItems;
  }

  if (reportCityList) {
    const cityMetrics = new Map();
    projectStore.forEach((project) => {
      const city = sanitizeText(project.city);
      if (!city) return;
      if (!cityMetrics.has(city)) {
        cityMetrics.set(city, { count: 0, housing: 0 });
      }
      const entry = cityMetrics.get(city);
      entry.count += 1;
      entry.housing += getHousingUnitTotal(project.housingUnits);
    });

    const topCities = Array.from(cityMetrics.entries())
      .map(([city, stats]) => ({ city, ...stats }))
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return b.housing - a.housing;
      })
      .slice(0, 5);

    reportCityList.innerHTML = topCities.length
      ? topCities
          .map(
            ({ city, count, housing }) => `
              <li>
                <span class="report-list__label">${escapeHtml(city)}</span>
                <span class="report-list__value">${numberFormatter.format(count)} proje • ${numberFormatter.format(housing)} konut</span>
              </li>
            `,
          )
          .join('')
      : '<li class="muted">İl bilgisi bulunan proje yok.</li>';
  }
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
    schedulePersistState();
    return;
  }

  if (projectSelector) {
    const hasOption = Array.from(projectSelector.options).some((option) => option.value === project.id);
    if (!hasOption) populateProjectSelector();
    projectSelector.value = project.id;
  }

  const salesStatus = deriveSalesStatus(project);
  project.salesStatus = salesStatus;
  project.category = normalizeProjectCategory(project.category);
  project.housingUnits = normalizeHousingUnits(project.housingUnits);
  const housingUnits = formatHousingUnits(project.housingUnits);

  projectInfo.innerHTML = `
    <dt>Proje Kodu</dt><dd>${project.id}</dd>
    <dt>Kategori</dt><dd>${project.category}</dd>
    <dt>İl</dt><dd>${escapeHtml(project.city || '-')}</dd>
    <dt>İlçe</dt><dd>${escapeHtml(project.district || '-')}</dd>
    <dt>Konut Sayısı</dt><dd>${escapeHtml(housingUnits)}</dd>
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
  schedulePersistState();
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

  const columnCount = rows.reduce((max, rawRow) => {
    const cells = Array.isArray(rawRow) ? rawRow : Object.values(rawRow ?? {});
    return Math.max(max, cells.length);
  }, 0);

  if (!columnCount) {
    throw new Error('Excel dosyasında aktarılacak sütun bulunamadı.');
  }

  let headerRow = Array.isArray(rows[0]) ? rows[0] : Object.values(rows[0] ?? {});
  if (headerRow.length < columnCount) {
    headerRow = [...headerRow, ...Array(columnCount - headerRow.length).fill('')];
  }

  let headerFields = headerRow.map((cell) => resolveProjectField(cell));
  if (headerFields.length < columnCount) {
    headerFields = [...headerFields, ...Array(columnCount - headerFields.length).fill(null)];
  }

  const assignedFields = new Set(headerFields.filter(Boolean));
  const dataStartIndex = assignedFields.size ? 1 : 0;

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    if (headerFields[columnIndex]) continue;
    const inferred = inferProjectFieldFromData(
      rows,
      columnIndex,
      dataStartIndex,
      assignedFields,
      dataStartIndex === 1 ? headerRow[columnIndex] : ''
    );
    if (inferred) {
      headerFields[columnIndex] = inferred;
      assignedFields.add(inferred);
    }
  }

  if (!assignedFields.size) {
    throw new Error('Excel başlıkları tanınmadı. Lütfen şablonu güncelleyin.');
  }

  const today = new Date().toISOString().slice(0, 10);
  let created = 0;
  let updated = 0;
  let removed = 0;
  const processedIds = [];
  const processedSet = new Set();
  let refreshConstruction = false;
  let refreshMechanical = false;

  const trackProcessedId = (id) => {
    if (!id || processedSet.has(id)) return;
    processedSet.add(id);
    processedIds.push(id);
  };

  for (let rowIndex = dataStartIndex; rowIndex < rows.length; rowIndex += 1) {
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
      } else if (field === 'housingUnits') {
        record[field] = normalizeHousingUnits(cell);
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
      category: normalizeProjectCategory(record.category),
      city: sanitizeText(record.city),
      district: sanitizeText(record.district),
      housingUnits: normalizeHousingUnits(record.housingUnits),
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
      const previousKey = getProjectLocationKey(existing);
      existing.name = payload.name;
      existing.category = payload.category;
      existing.city = payload.city;
      existing.district = payload.district;
      existing.housingUnits = payload.housingUnits;
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
      const nextKey = getProjectLocationKey(existing);
      if (previousKey !== nextKey) {
        existing.coordinates = null;
      }
      updated += 1;
      trackProcessedId(existing.id);
    } else {
      const newProject = {
        id: payload.id,
        name: payload.name,
        category: payload.category,
        city: payload.city,
        district: payload.district,
        coordinates: null,
        housingUnits: payload.housingUnits,
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

  if (processedSet.size) {
    for (let index = projectStore.length - 1; index >= 0; index -= 1) {
      const project = projectStore[index];
      if (processedSet.has(project.id)) {
        continue;
      }
      projectStore.splice(index, 1);
      removed += 1;
      if (selectedProjectId === project.id) {
        selectedProjectId = null;
      }
    }
  }

  if (created === 0 && updated === 0) {
    throw new Error('Excel dosyasında aktarılacak uygun proje kaydı bulunamadı.');
  }

  populateProjectSelector();
  applyCachedCoordinatesToProjects();
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
  schedulePersistState();
  return { created, updated, removed };
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
      'İlçe': project.district,
      'Konut Sayısı': normalizeHousingUnits(project.housingUnits),
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
      case 'İlçe':
        return { wch: 18 };
      case 'Eklenme Tarihi':
      case 'Son Güncelleme':
        return { wch: 18 };
      case 'Konut Sayısı':
        return { wch: 16 };
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
  if (!target) return;
  currentView = target;

  navLinks.forEach((link) => {
    const isActive = link.dataset.target === target;
    link.classList.toggle('active', isActive);
  });

  dashboards.forEach((section) => {
    section.classList.toggle('hidden', section.dataset.view !== target);
  });

  if (target === 'project-maps') {
    renderProjectMap();
  } else if (target === 'reporting') {
    renderProjectReports();
  }
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
    .filter((item) => {
      const text = [item.name, item.city, item.contact, item.status, item.owner]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('tr-TR');
      return text.includes(query);
    })
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
              <span>${escapeHtml(project.name)} • ${escapeHtml(formatProjectLocation(project) || '-')} (${escapeHtml(project.category || '-')}) • ${escapeHtml(project.salesStatus || '-')}</span>
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
  schedulePersistState();
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
    schedulePersistState();
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
      district: formData.get('projectDistrict')?.trim() ?? '',
      housingUnits: normalizeHousingUnits(formData.get('housingUnits')),
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

    payload.category = normalizeProjectCategory(payload.category);
    if (payload.channel !== 'dealer') {
      payload.channelName = '';
    }

    if (projectFormMode === 'edit') {
      const originalId = formData.get('originalId') || selectedProjectId;
      const project = getProject(originalId);
      if (!project) return;
      if (originalId !== projectId && getProject(projectId)) {
        window.alert('Bu proje kodu zaten kullanılıyor.');
        return;
      }
      const previousLocationKey = getProjectLocationKey(project);
      project.id = projectId;
      project.name = payload.name;
      project.category = payload.category;
      project.city = payload.city;
      project.district = payload.district;
      project.housingUnits = payload.housingUnits;
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
      const nextLocationKey = getProjectLocationKey(project);
      if (previousLocationKey !== nextLocationKey) {
        project.coordinates = null;
      }
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
        district: payload.district,
        coordinates: null,
        housingUnits: payload.housingUnits,
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
    schedulePersistState();
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
    schedulePersistState();
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
    schedulePersistState();
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
    schedulePersistState();
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
      schedulePersistState();
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
        schedulePersistState();
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
      schedulePersistState();
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
        schedulePersistState();
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

function setupMapSection() {
  mapProjectList?.addEventListener('click', (event) => {
    const button = event.target instanceof HTMLElement ? event.target.closest('button[data-project-id]') : null;
    if (!button) return;
    const markerKey = button.dataset.projectId;
    if (!markerKey) return;
    if (!projectMap) {
      renderProjectMap();
    }
    const entry = projectMarkers.get(markerKey);
    if (!entry || !projectMap) return;
    const { marker } = entry;
    const position = marker?.getLatLng?.();
    if (!position) return;
    const currentZoom = projectMap.getZoom() ?? MAP_DEFAULT_ZOOM;
    const targetZoom = Math.max(currentZoom, 7);
    projectMap.flyTo(position, targetZoom, { duration: 0.35 });
    marker.openPopup();
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
      schedulePersistState();
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
      schedulePersistState();

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
  const refreshProjectFilters = () => {
    renderProjectTable();
  };

  projectSearch?.addEventListener('input', refreshProjectFilters);

  constructionSearch?.addEventListener('input', (event) => {
    refreshProjectFilters();
    renderFirmTable(constructionTableBody, constructionFirms, event.target.value);
  });

  mechanicalSearch?.addEventListener('input', (event) => {
    refreshProjectFilters();
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
      const removed = result?.removed ?? 0;
      const parts = [];
      if (created) parts.push(`${created} yeni`);
      if (updated) parts.push(`${updated} güncel`);
      if (removed) parts.push(`${removed} silindi`);
      const summary = parts.length ? parts.join(', ') : 'kayıt bulunamadı';
      const tone = created || updated || removed ? 'success' : 'warning';
      if (projectSearch) {
        projectSearch.value = '';
        renderProjectTable('');
      }
      const message = created || updated || removed
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
  if (element?.dataset?.noUppercase === 'true') {
    return false;
  }
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

function ensureAutoAuthenticatedUser() {
  if (currentUser) return;

  let fallbackUser = userStore.find((user) => user.role === 'manager' && user.status !== 'inactive');
  if (!fallbackUser) {
    fallbackUser = userStore.find((user) => user.status !== 'inactive');
  }

  if (!fallbackUser) {
    fallbackUser = {
      id: createId('user'),
      fullName: 'Yönetici Hesabı',
      email: 'yonetici@kaldeboru.com',
      password: '',
      role: 'manager',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    userStore.push(fallbackUser);
  }

  currentUser = fallbackUser;
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
  ensureAutoAuthenticatedUser();

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
    schedulePersistState();
  });

  logoutBtn?.addEventListener('click', () => {
    currentUser = null;
    ensureAutoAuthenticatedUser();
    updateAuthUI();
    resetProjectForm();
    resetRequestForm();
    schedulePersistState();
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
      schedulePersistState();
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
    schedulePersistState();
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
      schedulePersistState();
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
  setupMapSection();
  setupProjectSelection();
  setupProjectLocationSelectors();
  setupFirmSelection();
  setupFirmProfileForms();
  setupForms();
  setupSearch();
  setupProjectImportExport();
  setupModal();
  setupUppercaseInputs();
  activateView('project-pool');
}

loadPersistedState();
setupAuth();
init();
