import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Define skills with categories and subcategories
const skills = [
  // חשיבה - Thinking skills
  { name: 'חשיבה לוגית', category: 'CORE', subcategory: 'חשיבה' },
  { name: 'חשיבה ביקורתית', category: 'CORE', subcategory: 'חשיבה' },
  { name: 'פתרון בעיות', category: 'CORE', subcategory: 'חשיבה' },
  { name: 'קבלת החלטות', category: 'CORE', subcategory: 'חשיבה' },

  // תקשורת - Communication skills
  { name: 'הקשבה פעילה', category: 'CORE', subcategory: 'תקשורת' },
  { name: 'תקשורת בין-אישית', category: 'CORE', subcategory: 'תקשורת' },
  { name: 'עבודת צוות', category: 'CORE', subcategory: 'תקשורת' },
  { name: 'מנהיגות', category: 'CORE', subcategory: 'תקשורת' },

  // יצירתיות - Creativity skills
  { name: 'חשיבה יצירתית', category: 'CORE', subcategory: 'יצירתיות' },
  { name: 'דמיון', category: 'CORE', subcategory: 'יצירתיות' },
  { name: 'חדשנות', category: 'CORE', subcategory: 'יצירתיות' },

  // שיתוף פעולה - Collaboration skills
  { name: 'עבודה בקבוצה', category: 'CORE', subcategory: 'שיתוף פעולה' },
  { name: 'שיתוף פעולה', category: 'CORE', subcategory: 'שיתוף פעולה' },
  { name: 'אחריות קבוצתית', category: 'CORE', subcategory: 'שיתוף פעולה' },
];

async function importSkills() {
  try {
    const skillsCollection = collection(db, 'skills');
    
    for (const skill of skills) {
      await addDoc(skillsCollection, {
        name: skill.name,
        category: skill.category,
        subcategory: skill.subcategory,
        createdAt: new Date(),
      });
      console.log(`Successfully added skill: ${skill.name}`);
    }
    
    console.log('All skills have been imported successfully!');
  } catch (error) {
    console.error('Error importing skills:', error);
  }
}

// Run the import
importSkills(); 