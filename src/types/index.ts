// טיפוסים הקשורים לפעילויות
export interface Activity {
  id: string;
  name: string;
  title?: string;
  treeType: string;
  subject: string;
  domain?: string;
  gradeLevel: string;
  ageGroup?: string;
  duration: string;
  description: string;
  summary?: string;
  preparation?: string;
  participants?: string;
  category?: string;
  favorite?: boolean;
  skills: string[];
  materials: string[];
  steps: string[];
  expectedOutcomes: string[];
  expectedResults?: string[];
  tags: string[];
  resources: {
    media: Resource[];
    teacherResources: Resource[];
    relatedActivities: Resource[];
    worksheets: Resource[];
    externalLinks: Resource[];
  };
  media?: Resource[];
  teacherResources?: Resource[];
  relatedActivities?: Resource[];
  worksheets?: Resource[];
  isActive?: boolean;
  updatedAt?: Date;
  skillIds?: string[];
  treeIds?: string[];
  image?: string;
}

export interface Resource {
  type: 'teacherResources' | 'worksheets' | 'media' | 'relatedActivities' | 'externalLinks';
  title: string;
  url: string;
  description?: string;
}

export interface Resources {
  teachingMaterials: Resource[];
  worksheets: Resource[];
  videosAndPresentations: Resource[];
  relatedActivities: Resource[];
}

export interface Documentation {
  id: string;
  title: string;
  description: string;
  className: string;
  teacherName: string;
  date: string;
  activityId: string;
  activityName?: string;
  images: string[];
  skillIds: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface DocumentationFormData extends Omit<Documentation, 'id'> {
  className: string;
  skillIds: string[];
}

// טיפוסים הקשורים לעצים
export interface Tree {
  id: string;
  name: string;
  image: string;
  description: string;
  activities?: Activity[];
}

// טיפוסים הקשורים למיומנויות
export interface Skill {
  id: string;
  name: string;
  category: 'CORE' | 'CUSTOM' | 'OTHER';
  subcategory: string;
  createdAt?: Date;
}
