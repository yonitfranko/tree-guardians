'use client';

import React, { useState } from 'react';
import { Activity } from '@/types/activity';

interface ActivityFormProps {
  initialData?: Partial<Activity>;
  onSubmit: (data: Partial<Activity>) => void;
  onCancel: () => void;
  trees: { id: string; name: string }[];
  skills: { id: string; name: string; subject: string }[];
}

const ActivityForm: React.FC<ActivityFormProps> = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  trees,
  skills
}) => {
  const [formData, setFormData] = useState<Partial<Activity>>({
    name: '',
    description: '',
    summary: '',
    materials: '',
    preparation: '',
    participants: '',
    category: '',
    ageGroup: 'א-ג',
    favorite: false,
    image: '',
    skillIds: [],
    treeIds: [],
    ...initialData
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSkillChange = (skillId: string) => {
    setFormData(prev => {
      const currentSkills = prev.skillIds || [];
      if (currentSkills.includes(skillId)) {
        return { ...prev, skillIds: currentSkills.filter(id => id !== skillId) };
      } else {
        return { ...prev, skillIds: [...currentSkills, skillId] };
      }
    });
  };
  
  const handleTreeChange = (treeId: string) => {
    setFormData(prev => {
      const currentTrees = prev.treeIds || [];
      if (currentTrees.includes(treeId)) {
        return { ...prev, treeIds: currentTrees.filter(id => id !== treeId) };
      } else {
        return { ...prev, treeIds: [...currentTrees, treeId] };
      }
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם הפעילות</label>
            <input
              type="text"
              name="name"
              required
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">תקציר</label>
            <input
              type="text"
              name="summary"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={formData.summary || ''}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={formData.description || ''}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ציוד נדרש</label>
            <textarea
              name="materials"
              rows={3}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={formData.materials || ''}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">הנחיות</label>
            <textarea
              name="preparation"
              rows={5}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={formData.preparation || ''}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">קישור לתמונה</label>
            <input
              type="url"
              name="image"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={formData.image || ''}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">קטגוריה</label>
            <select
              name="category"
              required
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={formData.category || ''}
              onChange={handleChange}
            >
              <option value="">בחר קטגוריה</option>
              <option value="מדעים">מדעים</option>
              <option value="מתמטיקה">מתמטיקה</option>
              <option value="שפה">שפה</option>
              <option value="היסטוריה">היסטוריה</option>
              <option value="גיאוגרפיה">גיאוגרפיה</option>
              <option value="אומנות">אומנות</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">קבוצת גיל</label>
            <select
              name="ageGroup"
              required
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={formData.ageGroup || 'א-ג'}
              onChange={handleChange}
            >
              <option value="א-ג">כיתות א-ג</option>
              <option value="ד-ו">כיתות ד-ו</option>
              <option value="א-ו">כל כיתות היסוד</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מספר משתתפים</label>
            <input
              type="text"
              name="participants"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={formData.participants || ''}
              onChange={handleChange}
              placeholder="לדוגמה: 20-25"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="favorite"
              name="favorite"
              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              checked={formData.favorite || false}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="favorite" className="mr-2 text-sm text-gray-700">
              פעילות מועדפת
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">עצים קשורים</label>
            <div className="max-h-36 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {trees.map(tree => (
                <div key={tree.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`tree-${tree.id}`}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={(formData.treeIds || []).includes(tree.id)}
                    onChange={() => handleTreeChange(tree.id)}
                  />
                  <label htmlFor={`tree-${tree.id}`} className="mr-2 text-sm text-gray-700">
                    {tree.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מיומנויות</label>
            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {skills.map(skill => (
                <div key={skill.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`skill-${skill.id}`}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={(formData.skillIds || []).includes(skill.id)}
                    onChange={() => handleSkillChange(skill.id)}
                  />
                  <label htmlFor={`skill-${skill.id}`} className="mr-2 text-sm text-gray-700">
                    {skill.name} ({skill.subject})
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          onClick={onCancel}
        >
          ביטול
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          שמור
        </button>
      </div>
    </form>
  );
};

export default ActivityForm;