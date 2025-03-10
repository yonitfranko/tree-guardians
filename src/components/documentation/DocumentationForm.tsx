// src/components/documentation/DocumentationForm.tsx
'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface Documentation {
  id?: string;
  title: string;
  description: string;
  className: string;
  date: string;
  activityId?: string;
  images: string[];
  skillIds: string[];
}

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
    title: '',
    description: '',
    className: '',
    date: new Date().toISOString().split('T')[0],
    activityId: '',
    images: [],
    skillIds: [],
    ...initialData
  });
  
  const [imageUrl, setImageUrl] = useState('');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
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
  
  const handleAddImage = () => {
    if (imageUrl && imageUrl.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), imageUrl.trim()]
      }));
      setImageUrl('');
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };
  
  const handleRemoveCapturedImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setCapturedImages(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImages(prev => [...prev, event.target!.result as string]);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };
  
  const openGallery = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // צרף את התמונות שצולמו לרשימת התמונות של הטופס
    const updatedFormData = {
      ...formData,
      images: [...(formData.images || []), ...capturedImages]
    };
    
    onSubmit(updatedFormData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">כותרת התיעוד</label>
        <input
          type="text"
          name="title"
          required
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">כיתה</label>
          <select
            name="className"
            required
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={formData.className || ''}
            onChange={handleChange}
          >
            <option value="">בחר כיתה</option>
            {classes.map(className => (
              <option key={className} value={className}>{className}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">תאריך</label>
          <input
            type="date"
            name="date"
            required
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">פעילות קשורה</label>
        <select
          name="activityId"
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          value={formData.activityId || ''}
          onChange={handleChange}
        >
          <option value="">בחר פעילות</option>
          {activities.map(activity => (
            <option key={activity.id} value={activity.id}>{activity.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
        <textarea
          name="description"
          rows={4}
          required
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          value={formData.description || ''}
          onChange={handleChange}
        ></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">תמונות</label>
        
        {/* אפשרויות צילום והעלאה */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            type="button"
            onClick={openCamera}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            צלם תמונה
          </button>
          
          <button
            type="button"
            onClick={openGallery}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            בחר מהגלריה
          </button>
          
          {/* Input נסתר למצלמה */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            ref={cameraInputRef}
            onChange={handleCameraCapture}
          />
          
          {/* Input נסתר לגלריה */}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          
          <div className="flex-1 flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="או הזן קישור לתמונה"
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              הוסף
            </button>
          </div>
        </div>
        
        {/* תצוגת תמונות שנבחרו מגלריה או צולמו */}
        {capturedImages.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">תמונות שצולמו/נבחרו:</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {capturedImages.map((img, index) => (
                <div key={index} className="relative group">
                  <div className="h-24 bg-gray-100 rounded overflow-hidden relative">
                    <img 
                      src={img} 
                      alt={`תמונה ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCapturedImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-70 hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* תצוגת תמונות מקישורים */}
        {(formData.images?.length || 0) > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">תמונות מקישורים:</h3>
            <div className="grid grid-cols-3 gap-2">
              {formData.images?.map((img, index) => (
                <div key={index} className="relative group">
                  <div className="h-24 bg-gray-100 rounded overflow-hidden relative">
                    <img 
                      src={img} 
                      alt={`תמונה ${index + 1}`} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        // אם התמונה לא נטענת, הצג אייקון תמונה במקומה
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.parentElement!.innerHTML = '<div class="flex items-center justify-center h-full w-full">🖼️</div>';
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-70 hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">מיומנויות שנלמדו</label>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
          {skills.map(skill => (
            <div key={skill.id} className="flex items-center">
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

export default DocumentationForm;