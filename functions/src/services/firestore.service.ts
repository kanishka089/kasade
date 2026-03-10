import * as admin from 'firebase-admin';

const db = admin.firestore();

export const collections = {
  users: 'users',
  settings: 'settings',
  subscriptionPlans: 'subscriptionPlans',
  reports: 'reports',
} as const;

export async function getDoc<T>(collection: string, docId: string): Promise<T | null> {
  const snap = await db.collection(collection).doc(docId).get();
  return snap.exists ? (snap.data() as T) : null;
}

export async function setDoc(collection: string, docId: string, data: Record<string, unknown>): Promise<void> {
  await db.collection(collection).doc(docId).set(data, { merge: true });
}

export async function createDoc(collection: string, data: Record<string, unknown>): Promise<string> {
  const ref = await db.collection(collection).add(data);
  return ref.id;
}

export async function updateDoc(collection: string, docId: string, data: Record<string, unknown>): Promise<void> {
  await db.collection(collection).doc(docId).update(data);
}

export async function deleteDoc(collection: string, docId: string): Promise<void> {
  await db.collection(collection).doc(docId).delete();
}

export async function queryDocs<T>(
  collection: string,
  filters: Array<{ field: string; op: FirebaseFirestore.WhereFilterOp; value: unknown }>,
  options?: { orderBy?: string; direction?: 'asc' | 'desc'; limit?: number; offset?: number }
): Promise<{ docs: T[]; total: number }> {
  let query: FirebaseFirestore.Query = db.collection(collection);

  for (const filter of filters) {
    query = query.where(filter.field, filter.op, filter.value);
  }

  // Get total count with same filters
  const countSnap = await query.count().get();
  const total = countSnap.data().count;

  if (options?.orderBy) {
    query = query.orderBy(options.orderBy, options.direction || 'desc');
  }

  if (options?.offset) {
    query = query.offset(options.offset);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const snap = await query.get();
  const docs = snap.docs.map((d) => ({ ...d.data(), uid: d.id } as T));

  return { docs, total };
}

export function getFirestore() {
  return db;
}
