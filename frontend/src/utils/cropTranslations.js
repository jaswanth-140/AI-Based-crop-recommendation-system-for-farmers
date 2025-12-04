const normalizeName = (name = '') =>
  name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const telugu = {
  maize: 'మొక్కజొన్న',
  corn: 'మొక్కజొన్న',
  groundnut: 'వేరుసెనగ',
  peanut: 'వేరుసెనగ',
  jowar: 'జొన్న',
  sorghum: 'జొన్న',
  bajra: 'సజ్జలు',
  millet: 'సిరిధాన్యం',
  ragi: 'రాగి',
  rice: 'బియ్యం',
  paddy: 'వరి',
  wheat: 'గోధుమలు',
  'red gram': 'కందిపప్పు',
  redgram: 'కందిపప్పు',
  tur: 'కందిపప్పు',
  'green gram': 'పెసరపప్పు',
  greengram: 'పెసరపప్పు',
  'black gram': 'మినుములు',
  blackgram: 'మినుములు',
  'bengal gram': 'సెనగలు',
  bengalgram: 'సెనగలు',
  chana: 'సెనగలు',
  peas: 'బటానీలు',
  lentil: 'మసూర్ పప్పు',
  soybean: 'సోయాబీన్',
  sunflower: 'సూర్యకాంతి',
  sesame: 'నువ్వులు',
  mustard: 'ఆవాలు',
  castor: 'ఆముదం',
  sugarcane: 'చెరకు',
  cotton: 'పత్తి',
  jute: 'జూట్',
  turmeric: 'పసుపు',
  ginger: 'అల్లం',
  chili: 'మిరపకాయ',
  coriander: 'ధనియాలు',
  cumin: 'జీలకర్ర',
  fennel: 'సోంపు',
  fenugreek: 'మెంతులు',
  tomato: 'టమాట',
  onion: 'ఉల్లిపాయ',
  potato: 'బంగాళాదుంప',
  brinjal: 'వంకాయ',
  eggplant: 'వంకాయ',
  okra: 'బెండకాయ',
  bhindi: 'బెండకాయ',
  cucumber: 'దోసకాయ',
  'bottle gourd': 'సొరకాయ',
  bottlegourd: 'సొరకాయ',
  'bitter gourd': 'కాకరకాయ',
  bittergourd: 'కాకరకాయ',
  cabbage: 'క్యాబేజి',
  cauliflower: 'కాలీఫ్లవర్',
  carrot: 'క్యారెట్',
  radish: 'ముల్లంగి',
  beetroot: 'బీట్‌రూట్',
  spinach: 'పాలకూర',
  lettuce: 'లెట్యూస్',
  mango: 'మామిడి',
  banana: 'అరటి',
  papaya: 'బొప్పాయి',
  guava: 'జామపండు',
  pomegranate: 'దానిమ్మ',
  citrus: 'నారింజ',
  orange: 'నారింజ',
  coconut: 'కొబ్బరి',
  cashew: 'జీడిపప్పు',
  coffee: 'కాఫీ',
  tea: 'టీ',
  cardamom: 'ఏలకులు',
  'black pepper': 'మిరియాలు',
  blackpepper: 'మిరియాలు'
};

const cropNameTranslations = {
  te: telugu
};

export const getLocalizedCropName = (name = '', language = 'en') => {
  if (!name) return '';
  const normalized = normalizeName(name);
  if (!normalized) return name;

  const langMap = cropNameTranslations[language];
  if (!langMap) return name;

  return langMap[normalized] || langMap[normalized.replace(/\s+/g, '')] || name;
};


