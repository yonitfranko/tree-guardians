// הגדרת טיפוס למשאב (תמונה, קישור, מסמך וכו')
export interface Resource {
  type: string;
  title: string;
  url: string;
  description: string;
}

// הגדרת טיפוס למשאבים של הפעילות
export interface Resources {
  teacherResources: Resource[];
  studentResources: Resource[];
  worksheets: Resource[];
  media: Resource[];
  relatedActivities: Resource[];
}

// הגדרת טיפוס לפעילות
export interface Activity {
  id: string;
  name: string;
  subjects: string[];
  treeIds: string[];
  ageGroup: string;
  skillIds: string[];
  description: string;
  materials: string;
  preparation: string;
  expectedOutcomes: string[];
  steps: string[];
  duration: string;
  treeType: string;
  gradeLevel: string;
  skills: string[];
  tags: string[];
  resources: Resources;
  summary: string;
  image: string;
  participants: string;
  objectives: string[];
  location: string;
  assessment: string;
  extensions: string[];
  safety: string[];
  link: string;
}

// טיפוס למיפוי של פעילויות
export interface ActivitiesData {
  [key: string]: Activity;
}