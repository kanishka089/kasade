const http = require('http');

const API_KEY = 'AIzaSyCphukUum-CcMA7IxE4qLPsNlQ8dO83X9E';
const API_BASE = 'http://localhost:3333/api';
const AUTH_BASE = 'http://localhost:9099/identitytoolkit.googleapis.com/v1';

const RASHIS = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrishchika','Dhanu','Makara','Kumbha','Meena'];
const NAKSHATRAS = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','PurvaPhalguni','UttaraPhalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','PurvaAshadha','UttaraAshadha','Shravana','Dhanishta','Shatabhisha','PurvaBhadrapada','UttaraBhadrapada','Revati'];
const DISTRICTS = ['Colombo','Gampaha','Kandy','Galle','Matara','Kurunegala','Ratnapura','Badulla','Anuradhapura','Kalutara','Jaffna','Nuwara Eliya','Kegalle','Hambantota','Polonnaruwa','Trincomalee','Batticaloa','Puttalam','Monaragala'];
const CITIES = {
  'Colombo':['Colombo','Dehiwala','Moratuwa','Nugegoda','Maharagama','Kotte'],'Gampaha':['Gampaha','Negombo','Kadawatha','Ja-Ela','Wattala'],
  'Kandy':['Kandy','Peradeniya','Katugastota','Gampola'],'Galle':['Galle','Hikkaduwa','Ambalangoda','Unawatuna'],
  'Matara':['Matara','Weligama','Dikwella','Akuressa'],'Kurunegala':['Kurunegala','Kuliyapitiya','Narammala'],
  'Ratnapura':['Ratnapura','Balangoda','Eheliyagoda'],'Badulla':['Badulla','Bandarawela','Ella','Welimada'],
  'Anuradhapura':['Anuradhapura','Mihintale','Kekirawa'],'Kalutara':['Kalutara','Panadura','Beruwala','Horana'],
  'Jaffna':['Jaffna','Nallur','Chavakachcheri'],'Nuwara Eliya':['Nuwara Eliya','Hatton','Talawakelle'],
  'Kegalle':['Kegalle','Mawanella','Rambukkana'],'Hambantota':['Hambantota','Tangalle','Tissamaharama'],
  'Polonnaruwa':['Polonnaruwa','Kaduruwela'],'Trincomalee':['Trincomalee','Kinniya'],'Batticaloa':['Batticaloa','Kattankudy'],
  'Puttalam':['Puttalam','Chilaw','Wennappuwa'],'Monaragala':['Monaragala','Wellawaya','Buttala']
};
const EDUCATION = ["Bachelor's Degree","Master's Degree","Diploma","PhD","Professional Qualification","A/L Completed","CIMA","ACCA"];
const OCCUPATIONS_M = ['Software Engineer','Doctor','Accountant','Civil Engineer','Business Owner','Teacher','Banker','Lawyer','Manager','Architect','Pilot','Pharmacist','Marketing Executive','Data Analyst','Quantity Surveyor'];
const OCCUPATIONS_F = ['Doctor','Software Engineer','Teacher','Nurse','Accountant','Lawyer','Business Analyst','Lecturer','Pharmacist','Architect','HR Manager','Designer','Bank Officer','Quantity Surveyor','Physiotherapist'];
const FAMILY_VALUES = ['Traditional','Moderate','Liberal'];
const FAMILY_TYPES = ['Nuclear','Joint','Extended'];
const RELIGIONS = ['Buddhist','Buddhist','Buddhist','Hindu','Christian','Muslim']; // weighted toward Buddhist

const FEMALE_PROFILES = [
  { name: 'Nimasha De Silva', age: 24 },
  { name: 'Pawani Senanayake', age: 27 },
  { name: 'Dinusha Kumari', age: 26 },
  { name: 'Thilini Madushani', age: 29 },
  { name: 'Hashini Weerasinghe', age: 25 },
  { name: 'Udari Warnakulasuriya', age: 28 },
  { name: 'Chamari Athapaththu', age: 23 },
  { name: 'Sewwandi Ranasinghe', age: 30 },
  { name: 'Dulani Kodithuwakku', age: 26 },
  { name: 'Nimesha Jayathilaka', age: 27 },
  { name: 'Yashodha Mendis', age: 25 },
  { name: 'Geethika Bandara', age: 28 },
  { name: 'Oshadi Hewavitharana', age: 24 },
];

const MALE_PROFILES = [
  { name: 'Shehan Madushanka', age: 29 },
  { name: 'Kasun Rajapaksha', age: 27 },
  { name: 'Pathum Nissanka', age: 31 },
  { name: 'Dhananjaya Lakshan', age: 28 },
  { name: 'Buddhika Madushan', age: 26 },
  { name: 'Charith Asalanka', age: 30 },
  { name: 'Ishan Premaratne', age: 25 },
  { name: 'Supun Weerakkody', age: 33 },
  { name: 'Janith Liyanage', age: 27 },
  { name: 'Pramod Madushan', age: 29 },
  { name: 'Dasun Shanaka', age: 28 },
  { name: 'Wanindu Hasaranga', age: 26 },
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function makeRequest(url, method, data) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const postData = data ? JSON.stringify(data) : null;
    const options = { hostname: parsed.hostname, port: parsed.port, path: parsed.pathname + parsed.search, method, headers: { 'Content-Type': 'application/json' } };
    if (postData) options.headers['Content-Length'] = Buffer.byteLength(postData);
    const req = http.request(options, (res) => { let body = ''; res.on('data', c => body += c); res.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve(body); } }); });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function makeAuthRequest(url, method, data, token) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const postData = data ? JSON.stringify(data) : null;
    const options = { hostname: parsed.hostname, port: parsed.port, path: parsed.pathname + parsed.search, method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };
    if (postData) options.headers['Content-Length'] = Buffer.byteLength(postData);
    const req = http.request(options, (res) => { let body = ''; res.on('data', c => body += c); res.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve(body); } }); });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function generatePlanetPositions(rashiIdx) {
  const planets = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
  const positions = {};
  planets.forEach((p, i) => {
    const r = (rashiIdx + i * 2 + rand(0,4)) % 12;
    positions[p] = { rashi: RASHIS[r], rashiIndex: r, degree: rand(0, 29) + Math.random(), nakshatra: NAKSHATRAS[(r * 2 + rand(0,2)) % 27], nakshatraPada: rand(1,4) };
  });
  return positions;
}

const ABOUT_TEMPLATES_M = [
  'A dedicated professional seeking a kind-hearted life partner. I value honesty, loyalty, and family.',
  'Looking for someone who shares my passion for life and traditional values. Family-oriented and caring.',
  'An ambitious and hardworking individual with strong family values. Seeking a compatible partner for life.',
  'I enjoy reading, traveling, and spending time with family. Looking for a genuine and understanding partner.',
  'A respectful and responsible person who believes in building a happy home together.',
];
const ABOUT_TEMPLATES_F = [
  'A cheerful and caring person looking for a compatible life partner who values family and mutual respect.',
  'I believe in traditional values with a modern outlook. Seeking a kind and understanding partner.',
  'A positive and family-oriented person. I enjoy cooking, reading, and spending quality time with loved ones.',
  'Looking for a genuine and responsible partner to share life\'s journey together.',
  'An independent and caring individual who values education, culture, and family bonds.',
];

async function seed() {
  const allProfiles = [
    ...FEMALE_PROFILES.map(p => ({ ...p, gender: 'female' })),
    ...MALE_PROFILES.map(p => ({ ...p, gender: 'male' })),
  ];

  let created = 0;
  for (const prof of allProfiles) {
    const emailName = prof.name.toLowerCase().replace(/\s+/g, '.');
    const email = `${emailName}@kasade.lk`;

    console.log(`Creating ${prof.name} (${prof.gender})...`);

    const authRes = await makeRequest(`${AUTH_BASE}/accounts:signUp?key=${API_KEY}`, 'POST', { email, password: 'Secure@123', returnSecureToken: true });
    if (authRes.error) { console.log(`  Skip: ${authRes.error.message}`); continue; }
    const token = authRes.idToken;

    const dob = new Date(2026 - prof.age, rand(0,11), rand(1,28));
    const district = pick(DISTRICTS);
    const city = pick(CITIES[district] || [district]);
    const rashiIdx = rand(0, 11);
    const nakIdx = rand(0, 26);
    const lagnaIdx = rand(0, 11);

    const regData = {
      email,
      displayName: prof.name,
      gender: prof.gender,
      dateOfBirth: dob.toISOString().split('T')[0],
      religion: pick(RELIGIONS),
      birthTime: `${String(rand(1,23)).padStart(2,'0')}:${String(rand(0,59)).padStart(2,'0')}`,
      birthPlace: { name: city, lat: 6.5 + Math.random() * 1.5, lng: 79.5 + Math.random() * 1.5, tz: 'Asia/Colombo' },
      location: { district, city },
      education: pick(EDUCATION),
      occupation: prof.gender === 'male' ? pick(OCCUPATIONS_M) : pick(OCCUPATIONS_F),
      heightCm: prof.gender === 'male' ? rand(165, 188) : rand(150, 172),
      aboutMe: pick(prof.gender === 'male' ? ABOUT_TEMPLATES_M : ABOUT_TEMPLATES_F),
      contactNumber: `07${rand(1,9)}${rand(1000000,9999999)}`,
      family: {
        fatherOccupation: pick(['Teacher','Business Owner','Government Officer','Engineer','Farmer','Doctor','Retired','Police Officer','Military']),
        motherOccupation: pick(['Housewife','Teacher','Nurse','Business Owner','Government Officer','Retired']),
        siblings: rand(0, 4),
        familyValues: pick(FAMILY_VALUES),
        familyType: pick(FAMILY_TYPES),
      },
      preferences: {
        ageRange: { min: prof.age - 5, max: prof.age + 5 },
        heightRange: { min: prof.gender === 'female' ? 165 : 150, max: prof.gender === 'female' ? 190 : 175 },
      },
      horoscope: {
        rashi: RASHIS[rashiIdx],
        nakshatra: NAKSHATRAS[nakIdx],
        nakshatraPada: rand(1, 4),
        lagna: RASHIS[lagnaIdx],
        planetPositions: generatePlanetPositions(rashiIdx),
      },
    };

    const regRes = await makeAuthRequest(`${API_BASE}/auth/register`, 'POST', regData, token);
    if (!regRes.success) {
      await makeAuthRequest(`${API_BASE}/auth/complete-profile`, 'POST', regData, token);
    }

    await makeAuthRequest(`${API_BASE}/horoscope/confirm`, 'POST', {
      source: 'provided', rashi: RASHIS[rashiIdx], nakshatra: NAKSHATRAS[nakIdx], nakshatraPada: rand(1, 4), lagna: RASHIS[lagnaIdx], planetPositions: regData.horoscope.planetPositions,
    }, token);

    created++;
    console.log(`  ✓ ${prof.name}`);
  }

  console.log(`\nCreated ${created}/25. Now fixing profileComplete...`);

  // Fix profileComplete using admin API
  const adminAuth = await makeRequest(`${AUTH_BASE}/accounts:signInWithPassword?key=${API_KEY}`, 'POST', { email: 'nadeesha@kasade.lk', password: 'Secure@123', returnSecureToken: true });
  // Use firestore directly
  const { execSync } = require('child_process');
  execSync('cd d:/Company/kasade/functions && node -e "' +
    "const admin=require('firebase-admin');" +
    "process.env.FIRESTORE_EMULATOR_HOST='127.0.0.1:8080';" +
    "admin.initializeApp({projectId:'kasade-lk'});" +
    "admin.firestore().collection('users').where('profileComplete','==',false).get().then(s=>{const b=admin.firestore().batch();s.docs.forEach(d=>{b.update(d.ref,{profileComplete:true,isActive:true,isSuspended:false});console.log('Fixed:',d.data().displayName)});return b.commit()}).then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)})" +
    '"', { stdio: 'inherit' });

  console.log('Done!');
}

seed().catch(console.error);
