// src/components/documentation/DocumentationForm.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Documentation } from '@/types';
import ImageUpload from '@/components/ImageUpload';

// Function to convert between English and Hebrew grades
const gradeMap: Record<string, string> = {
  'א': 'A',
  'ב': 'B',
  'ג': 'C',
  'ד': 'D',
  'ה': 'E',
  'ו': 'F',
  'A': 'א',
  'B': 'ב',
  'C': 'ג',
  'D': 'ד',
  'E': 'ה',
  'F': 'ו'
};

const convertGradeToHebrew = (grade: string): string => {
  return gradeMap[grade] || grade;
};

const convertGradeToEnglish = (grade: string): string => {
  return gradeMap[grade] || grade;
};

interface DocumentationFormProps {
  initialData?: Partial<Documentation>;
  onSubmit: (data: Partial<Documentation>) => void;
  onCancel: () => void;
  activities: { id: string; name: string }[];
  skills: { id: string; name: string; subject: string }[];
  classes: string[];
}

const DocumentationForm: React.FC<DocumentationFormProps> = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel,
  activities,
  skills,
  classes
}) => {
  const [formData, setFormData] = useState<Partial<Documentation>>({
    activityId: '',
    title: '',
    className: '',
    teacherName: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    skillIds: [],
    images: [],
    ...initialData
  });
  
  const [selectedActivity, setSelectedActivity] = useState<{ id: string; name: string } | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>(() => {
    const grade = formData.className?.charAt(0) || '';
    return convertGradeToHebrew(grade);
  });
  const [selectedNumber, setSelectedNumber] = useState<string>(formData.className?.charAt(1) || '');

  const grades = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'];
  const numbers = ['1', '2', '3', '4'];

  useEffect(() => {
    if (formData.activityId) {
      const activity = activities.find(a => a.id === formData.activityId);
      if (activity) {
        setSelectedActivity(activity);
        // רק אם אין כותרת קיימת, השתמש בשם הפעילות
        if (!formData.title) {
          setFormData(prev => ({
            ...prev,
            title: activity.name
          }));
        }
      }
    }
  }, [formData.activityId, activities]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert the class name to English format before submitting
    const updatedData = {
      ...formData,
      className: selectedGrade && selectedNumber ? `${convertGradeToEnglish(selectedGrade)}${selectedNumber}` : formData.className
    };
    onSubmit(updatedData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          פעילות
        </label>
        <select
          value={formData.activityId}
          onChange={(e) => {
            const activityId = e.target.value;
            const activity = activities.find(a => a.id === activityId);
            setFormData(prev => ({
              ...prev,
              activityId,
              // רק אם אין כותרת קיימת או אם הכותרת זהה לשם הפעילות הקודמת
              title: !prev.title || (selectedActivity && prev.title === selectedActivity.name) 
                ? activity?.name || ''
                : prev.title
            }));
          }}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">בחר פעילות</option>
          {activities.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          כותרת התיעוד
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="ניתן לשנות את כותרת הפעילות או להשאיר כברירת מחדל"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          שם המורה
        </label>
        <input
          type="text"
          name="teacherName"
          value={formData.teacherName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          placeholder="הכנס את שם המורה"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            שכבה
          </label>
          <select
            value={selectedGrade}
            onChange={(e) => {
              const grade = e.target.value;
              setSelectedGrade(grade);
              if (grade && selectedNumber) {
                const hebrewGrade = convertGradeToHebrew(grade);
                setFormData(prev => ({ ...prev, className: `${hebrewGrade}${selectedNumber}` }));
              }
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">בחר שכבה</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            מספר כיתה
          </label>
          <select
            value={selectedNumber}
            onChange={(e) => {
              const number = e.target.value;
              setSelectedNumber(number);
              if (selectedGrade && number) {
                const hebrewGrade = convertGradeToHebrew(selectedGrade);
                setFormData(prev => ({ ...prev, className: `${hebrewGrade}${number}` }));
              }
            }}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">בחר מספר</option>
            {numbers.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          תאריך
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          תיאור
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded h-32"
          required
          placeholder="תאר את מהלך הפעילות והתובנות העיקריות..."
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          מיומנויות
        </label>
        <div className="grid grid-cols-2 gap-2">
          {skills.map((skill) => (
            <label key={skill.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(formData.skillIds || []).includes(skill.id)}
                onChange={() => handleSkillChange(skill.id)}
              />
              {skill.name}
            </label>
          ))}
        </div>
      </div>

      <ImageUpload
        images={formData.images || []}
        onChange={(images) => setFormData(prev => ({ ...prev, images }))}
      />

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ביטול
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          שמור
        </button>
      </div>
    </form>
  );
};

export default DocumentationForm;