const http = require('http');

const API_KEY = 'AIzaSyCphukUum-CcMA7IxE4qLPsNlQ8dO83X9E';
const API_BASE = 'http://localhost:3333/api';
const AUTH_BASE = 'http://localhost:9099/identitytoolkit.googleapis.com/v1';

const RASHIS = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrishchika','Dhanu','Makara','Kumbha','Meena'];
const NAKSHATRAS = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','PurvaPhalguni','UttaraPhalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','PurvaAshadha','UttaraAshadha','Shravana','Dhanishta','Shatabhisha','PurvaBhadrapada','UttaraBhadrapada','Revati'];
const DISTRICTS = ['Colombo','Gampaha','Kandy','Galle','Matara','Kurunegala','Ratnapura','Badulla','Anuradhapura','Kalutara','Jaffna','Nuwara Eliya','Kegalle'];
const CITIES = {
  'Colombo':['Colombo','Dehiwala','Moratuwa','Nugegoda'],'Gampaha':['Gampaha','Negombo','Kadawatha'],'Kandy':['Kandy','Peradeniya','Katugastota'],
  'Galle':['Galle','Hikkaduwa','Ambalangoda'],'Matara':['Matara','Weligama','Dikwella'],'Kurunegala':['Kurunegala','Kuliyapitiya'],
  'Ratnapura':['Ratnapura','Balangoda'],'Badulla':['Badulla','Bandarawela','Ella'],'Anuradhapura':['Anuradhapura','Mihintale'],
  'Kalutara':['Kalutara','Panadura','Beruwala'],'Jaffna':['Jaffna','Nallur'],'Nuwara Eliya':['Nuwara Eliya','Hatton'],'Kegalle':['Kegalle','Mawanella']
};
const EDUCATION = ["Bachelor's Degree","Master's Degree","Diploma","PhD","Professional Qualification","A/L Completed"];
const OCCUPATIONS_M = ['Software Engineer','Doctor','Accountant','Civil Engineer','Business Owner','Teacher','Banker','Lawyer','Manager','Architect','Pilot','Pharmacist','Marketing Executive'];
const OCCUPATIONS_F = ['Doctor','Software Engineer','Teacher','Nurse','Accountant','Lawyer','Business Analyst','Lecturer','Pharmacist','Architect','HR Manager','Designer','Bank Officer'];
const FAMILY_VALUES = ['Traditional','Moderate','Liberal'];
const FAMILY_TYPES = ['Nuclear','Joint','Extended'];
const RELIGIONS = ['Buddhist','Hindu','Christian','Muslim'];

const FEMALE_PROFILES = [
  { name: 'Sanduni Perera', age: 26 },
  { name: 'Hiruni Fernando', age: 28 },
  { name: 'Chathurika Silva', age: 24 },
  { name: 'Dilini Jayawardena', age: 27 },
  { name: 'Rashmi Bandara', age: 25 },
  { name: 'Tharushi Wijesinghe', age: 29 },
  { name: 'Ayesha Rathnayake', age: 23 },
  { name: 'Nethmi Gunawardena', age: 30 },
  { name: 'Sachini Dissanayake', age: 26 },
  { name: 'Kavindi Rajapaksha', age: 28 },
  { name: 'Malsha Herath', age: 25 },
  { name: 'Isuri Wickramasinghe', age: 27 },
];

const MALE_PROFILES = [
  { name: 'Tharindu Silva', age: 28 },
  { name: 'Nuwan Jayasuriya', age: 30 },
  { name: 'Dimuth Karunaratne', age: 27 },
  { name: 'Ravindu Perera', age: 29 },
  { name: 'Chamika Bandara', age: 26 },
  { name: 'Asela Fernando', age: 31 },
  { name: 'Kaveen Rathnayake', age: 25 },
  { name: 'Lahiru Gunathilaka', age: 32 },
  { name: 'Dinesh Priyantha', age: 28 },
  { name: 'Sahan Wijeratne', age: 30 },
  { name: 'Malith Mendis', age: 27 },
  { name: 'Isuru Udayanga', age: 29 },
  { name: 'Pasan Liyanage', age: 26 },
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function makeRequest(url, method, data) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const postData = data ? JSON.stringify(data) : null;
    const options = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (postData) options.headers['Content-Length'] = Buffer.byteLength(postData);
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch { resolve(body); }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function makeAuthRequest(url, method, data, token) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const postData = data ? JSON.stringify(data) : null;
    const options = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    };
    if (postData) options.headers['Content-Length'] = Buffer.byteLength(postData);
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch { resolve(body); }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

function generatePlanetPositions(rashiIdx) {
  const planets = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
  const positions = {};
  planets.forEach((p, i) => {
    const r = (rashiIdx + i * 3 + rand(0,3)) % 12;
    positions[p] = {
      rashi: RASHIS[r],
      rashiIndex: r,
      degree: rand(0, 29) + Math.random(),
      nakshatra: NAKSHATRAS[(r * 2 + rand(0,1)) % 27],
      nakshatraPada: rand(1,4),
    };
  });
  return positions;
}

async function createUser(email, password, displayName) {
  const res = await makeRequest(
    `${AUTH_BASE}/accounts:signUp?key=${API_KEY}`,
    'POST',
    { email, password, returnSecureToken: true }
  );
  return res;
}

async function seed() {
  const allProfiles = [
    ...FEMALE_PROFILES.map(p => ({ ...p, gender: 'female' })),
    ...MALE_PROFILES.map(p => ({ ...p, gender: 'male' })),
  ];

  let created = 0;
  for (const prof of allProfiles) {
    const emailName = prof.name.toLowerCase().replace(/\s+/g, '.');
    const email = `${emailName}@kasade.lk`;
    const password = 'Secure@123';

    console.log(`Creating ${prof.name} (${prof.gender})...`);

    // 1. Create auth user
    const authRes = await createUser(email, password, prof.name);
    if (authRes.error) {
      console.log(`  Auth error: ${authRes.error.message}`);
      continue;
    }
    const token = authRes.idToken;
    const uid = authRes.localId;

    // 2. Register via API
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
      birthPlace: { name: city, lat: 6.9 + Math.random(), lng: 79.8 + Math.random(), tz: 'Asia/Colombo' },
      location: { district, city },
      education: pick(EDUCATION),
      occupation: prof.gender === 'male' ? pick(OCCUPATIONS_M) : pick(OCCUPATIONS_F),
      heightCm: prof.gender === 'male' ? rand(165, 185) : rand(150, 170),
      aboutMe: `I am ${prof.name}, a ${prof.gender === 'male' ? 'kind and ambitious young man' : 'caring and cheerful young woman'} from ${district}. Looking for a compatible life partner who shares similar values and interests.`,
      contactNumber: `07${rand(1,9)}${rand(1000000,9999999)}`,
      family: {
        fatherOccupation: pick(['Teacher','Business Owner','Government Officer','Engineer','Farmer','Doctor','Retired']),
        motherOccupation: pick(['Housewife','Teacher','Nurse','Business Owner','Government Officer']),
        siblings: rand(0, 4),
        familyValues: pick(FAMILY_VALUES),
        familyType: pick(FAMILY_TYPES),
      },
      preferences: {
        ageRange: { min: prof.age - 4, max: prof.age + 4 },
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
      console.log(`  Register error: ${regRes.message}`);
      // Try complete-profile instead
      const cpRes = await makeAuthRequest(`${API_BASE}/auth/complete-profile`, 'POST', regData, token);
      if (!cpRes.success) {
        console.log(`  Complete-profile error: ${cpRes.message}`);
        continue;
      }
    }

    // 3. Confirm horoscope
    await makeAuthRequest(`${API_BASE}/horoscope/confirm`, 'POST', {
      source: 'provided',
      rashi: RASHIS[rashiIdx],
      nakshatra: NAKSHATRAS[nakIdx],
      nakshatraPada: rand(1, 4),
      lagna: RASHIS[lagnaIdx],
      planetPositions: regData.horoscope.planetPositions,
    }, token);

    created++;
    console.log(`  ✓ Created ${prof.name} (${uid})`);
  }

  console.log(`\nDone! Created ${created}/25 profiles.`);
}

seed().catch(console.error);
