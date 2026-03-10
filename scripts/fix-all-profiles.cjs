const admin = require('firebase-admin');
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
admin.initializeApp({ projectId: 'kasade-lk' });
const db = admin.firestore();

const RASHIS = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrishchika','Dhanu','Makara','Kumbha','Meena'];
const NAKSHATRAS = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','PurvaPhalguni','UttaraPhalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','PurvaAshadha','UttaraAshadha','Shravana','Dhanishta','Shatabhisha','PurvaBhadrapada','UttaraBhadrapada','Revati'];
const DISTRICTS = ['Colombo','Gampaha','Kandy','Galle','Matara','Kurunegala','Ratnapura','Badulla','Anuradhapura','Kalutara','Jaffna','Nuwara Eliya','Kegalle','Hambantota','Polonnaruwa','Trincomalee','Puttalam'];
const CITIES = {
  'Colombo':['Colombo','Dehiwala','Moratuwa','Nugegoda','Maharagama'],'Gampaha':['Gampaha','Negombo','Kadawatha','Ja-Ela'],
  'Kandy':['Kandy','Peradeniya','Katugastota','Gampola'],'Galle':['Galle','Hikkaduwa','Ambalangoda'],
  'Matara':['Matara','Weligama','Dikwella'],'Kurunegala':['Kurunegala','Kuliyapitiya'],
  'Ratnapura':['Ratnapura','Balangoda'],'Badulla':['Badulla','Bandarawela','Ella'],
  'Anuradhapura':['Anuradhapura','Mihintale'],'Kalutara':['Kalutara','Panadura','Beruwala'],
  'Jaffna':['Jaffna','Nallur'],'Nuwara Eliya':['Nuwara Eliya','Hatton'],
  'Kegalle':['Kegalle','Mawanella'],'Hambantota':['Hambantota','Tangalle'],
  'Polonnaruwa':['Polonnaruwa'],'Trincomalee':['Trincomalee'],'Puttalam':['Puttalam','Chilaw']
};
const EDUCATION = ["Bachelor's Degree","Master's Degree","Diploma","PhD","Professional Qualification","A/L Completed","CIMA","ACCA"];
const OCCUPATIONS_M = ['Software Engineer','Doctor','Accountant','Civil Engineer','Business Owner','Teacher','Banker','Lawyer','Manager','Architect','Pharmacist','Marketing Executive','Data Analyst','Quantity Surveyor'];
const OCCUPATIONS_F = ['Doctor','Software Engineer','Teacher','Nurse','Accountant','Lawyer','Business Analyst','Lecturer','Pharmacist','HR Manager','Designer','Bank Officer','Physiotherapist'];
const FAMILY_VALUES = ['Traditional','Moderate','Liberal'];
const FAMILY_TYPES = ['Nuclear','Joint','Extended'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generatePlanetPositions(rashiIdx) {
  const planets = ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'];
  const positions = {};
  planets.forEach((p, i) => {
    const r = (rashiIdx + i * 2 + rand(0, 4)) % 12;
    positions[p] = { rashi: RASHIS[r], rashiIndex: r, degree: rand(0, 29) + Math.random(), nakshatra: NAKSHATRAS[(r * 2 + rand(0, 2)) % 27], nakshatraPada: rand(1, 4) };
  });
  return positions;
}

async function fix() {
  const snapshot = await db.collection('users').get();
  let fixed = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    // Skip profiles that already have data (like Nadeesha and Kamal from manual setup)
    if (data.horoscope && data.location?.district && data.education) {
      console.log(`Skip (already complete): ${data.displayName}`);
      continue;
    }

    const district = pick(DISTRICTS);
    const city = pick(CITIES[district] || [district]);
    const rashiIdx = rand(0, 11);
    const nakIdx = rand(0, 26);
    const lagnaIdx = rand(0, 11);
    const isMale = data.gender === 'male';

    const update = {
      location: { district, city, province: '' },
      education: pick(EDUCATION),
      occupation: isMale ? pick(OCCUPATIONS_M) : pick(OCCUPATIONS_F),
      heightCm: isMale ? rand(165, 188) : rand(150, 172),
      aboutMe: isMale
        ? pick(['A dedicated professional seeking a kind-hearted life partner.','Looking for someone who shares my passion for life and traditional values.','An ambitious person with strong family values seeking a compatible partner.','I enjoy traveling, reading, and family time. Seeking an understanding partner.'])
        : pick(['A cheerful and caring person looking for a compatible life partner.','I believe in traditional values with a modern outlook.','A positive and family-oriented person who enjoys cooking and reading.','An independent and caring individual who values family bonds.']),
      contactNumber: `07${rand(1,9)}${rand(1000000,9999999)}`,
      family: {
        fatherOccupation: pick(['Teacher','Business Owner','Government Officer','Engineer','Farmer','Doctor','Retired']),
        motherOccupation: pick(['Housewife','Teacher','Nurse','Business Owner','Government Officer']),
        siblings: rand(0, 4),
        familyValues: pick(FAMILY_VALUES),
        familyType: pick(FAMILY_TYPES),
      },
      horoscope: {
        rashi: RASHIS[rashiIdx],
        nakshatra: NAKSHATRAS[nakIdx],
        nakshatraPada: rand(1, 4),
        lagna: RASHIS[lagnaIdx],
        planetPositions: generatePlanetPositions(rashiIdx),
        source: 'provided',
      },
      profileComplete: true,
      isActive: true,
      isSuspended: false,
      updatedAt: new Date().toISOString(),
    };

    await doc.ref.update(update);
    console.log(`Fixed: ${data.displayName} → ${district}, ${update.education}, ${RASHIS[rashiIdx]}`);
    fixed++;
  }

  console.log(`\nDone! Fixed ${fixed} profiles.`);
  process.exit(0);
}

fix().catch(e => { console.error(e); process.exit(1); });
