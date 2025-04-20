'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skill } from '@/types';

const MAIN_CATEGORIES = ['חשיבה', 'למידה', 'אישי', 'חברתי', 'מיומנויות נוספות'] as const;

const DEFAULT_SKILLS = {
  'חשיבה': ['חשיבה ביקורתית', 'פתרון בעיות', 'חשיבה מתמטית', 'חשיבה מדעית', 'קבלת החלטות', 'חשיבה יצירתית'],
  'למידה': ['הכוונה עצמית בלמידה', 'ארגון וניהול מידע', 'חיפוש ואיתור מידע', 'הסקת מסקנות', 'ייצוג מידע'],
  'אישי': ['מודעות עצמית', 'התמדה', 'ניהול זמן', 'הנעה עצמית', 'אחריות אישית'],
  'חברתי': ['עבודת צוות', 'שיתוף פעולה', 'תקשורת', 'נורמות', 'אמפתיה'],
  'מיומנויות נוספות': ['אוריינות בסיסית', 'חשיבה לוגית']
};

export default function AdminPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ 
    name: '', 
    category: 'חשיבה' as typeof MAIN_CATEGORIES[number]
  });
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const skillsSnapshot = await getDocs(collection(db, 'skills'));
      const skillsData = skillsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Skill[];
      
      // אם אין מיומנויות, נוסיף את המיומנויות הדיפולטיביות
      if (skillsData.length === 0) {
        await addDefaultSkills();
        return;
      }
      
      setSkills(skillsData);
    } catch (error) {
      console.error('שגיאה בטעינת מיומנויות:', error);
    }
  };

  const addDefaultSkills = async () => {
    try {
      const batch = [];
      for (const [mainCategory, skills] of Object.entries(DEFAULT_SKILLS)) {
        for (const skillName of skills) {
          batch.push(
            addDoc(collection(db, 'skills'), {
              name: skillName,
              category: mainCategory,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
          );
        }
      }
      await Promise.all(batch);
      loadSkills();
    } catch (error) {
      console.error('שגיאה בהוספת מיומנויות ברירת מחדל:', error);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'skills'), {
        name: newSkill.name,
        category: newSkill.category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setNewSkill({ 
        name: '', 
        category: 'חשיבה'
      });
      loadSkills();
    } catch (error) {
      console.error('שגיאה בהוספת מיומנות:', error);
    }
  };

  const handleEditSkill = async (skill: Skill) => {
    try {
      const skillRef = doc(db, 'skills', skill.id);
      await updateDoc(skillRef, {
        name: skill.name,
        category: skill.category,
        updatedAt: new Date().toISOString()
      });
      setEditingSkill(null);
      loadSkills();
    } catch (error) {
      console.error('שגיאה בעריכת מיומנות:', error);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מיומנות זו?')) {
      try {
        await deleteDoc(doc(db, 'skills', skillId));
        loadSkills();
      } catch (error) {
        console.error('שגיאה במחיקת מיומנות:', error);
      }
    }
  };

  const getSkillsByMainCategory = (mainCategory: string) => {
    return skills.filter(skill => skill.category === mainCategory);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ניהול מיומנויות</h1>
      
      {/* טופס הוספת מיומנות חדשה */}
      <form onSubmit={handleAddSkill} className="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">הוספת מיומנות חדשה</h2>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              placeholder="שם המיומנות"
              className="flex-1 p-2 border rounded"
              required
            />
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill({ 
                ...newSkill, 
                category: e.target.value as typeof MAIN_CATEGORIES[number]
              })}
              className="p-2 border rounded"
            >
              {MAIN_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              הוסף
            </button>
          </div>
        </div>
      </form>

      {/* הצגת מיומנויות לפי קטגוריה ראשית */}
      {MAIN_CATEGORIES.map(mainCategory => {
        const categorySkills = getSkillsByMainCategory(mainCategory);
        if (categorySkills.length === 0) return null;

        return (
          <div key={mainCategory} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{mainCategory}</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">שם</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categorySkills.map((skill) => (
                    <tr key={skill.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingSkill?.id === skill.id ? (
                          <input
                            type="text"
                            value={editingSkill.name}
                            onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                            className="p-2 border rounded"
                          />
                        ) : (
                          skill.name
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingSkill?.id === skill.id ? (
                          <button
                            onClick={() => handleEditSkill(editingSkill)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            שמור
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditingSkill(skill)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            ערוך
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          מחק
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
} 