import { db } from '@/lib/firebase';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Domain } from './constants';

const DOMAINS_COLLECTION = 'domains';

export async function getDomains(): Promise<Domain[]> {
  const domainsRef = collection(db, DOMAINS_COLLECTION);
  const snapshot = await getDocs(domainsRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Domain));
}

export async function addDomainToFirestore(domain: Omit<Domain, 'id'>): Promise<string> {
  const domainsRef = collection(db, DOMAINS_COLLECTION);
  const docRef = await addDoc(domainsRef, domain);
  return docRef.id;
}

export async function updateDomainInFirestore(id: string, updates: Partial<Omit<Domain, 'id'>>): Promise<void> {
  const domainRef = doc(db, DOMAINS_COLLECTION, id);
  await updateDoc(domainRef, updates);
}

export async function deleteDomainFromFirestore(id: string): Promise<void> {
  const domainRef = doc(db, DOMAINS_COLLECTION, id);
  await deleteDoc(domainRef);
} 