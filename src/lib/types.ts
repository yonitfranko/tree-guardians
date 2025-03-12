export interface Activity {
  id: string;
  name: string;
  subject: string;
  treeType: string;
  gradeLevel: string[];
  duration: string;
  skills: string[];
  description: string;
  materials: string[];
  steps: string[];
  expectedOutcomes: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  resources?: {
    teacherResources?: Resource[];
    worksheets?: Resource[];
    media?: Resource[];
    relatedActivities?: string[];
  };
}

export interface Resource {
  type: 'teacher' | 'worksheet' | 'video' | 'presentation' | 'related';
  title: string;
  url: string;
  description?: string;
}