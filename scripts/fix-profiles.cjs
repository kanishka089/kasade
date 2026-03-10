const admin = require('firebase-admin');

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';

admin.initializeApp({ projectId: 'kasade-lk' });
const db = admin.firestore();

async function fix() {
  const snapshot = await db.collection('users').get();
  let fixed = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data.profileComplete) {
      await doc.ref.update({ profileComplete: true, isActive: true, isSuspended: false });
      console.log(`Fixed: ${data.displayName}`);
      fixed++;
    }
  }
  console.log(`\nFixed ${fixed} profiles. Total: ${snapshot.size}`);
  process.exit(0);
}

fix().catch(console.error);
