interface Resource {
  type: string;
  title: string;
  url: string;
  description: string;
}

interface Resources {
  teacherResources: Resource[];
  studentResources: Resource[];
}

export interface Activity {
    id: string;
    name: string;
    subjects: string[];
    treeIds: string[];
    ageGroup: string;
    skillIds: string[];
    description: string;
    materials: string;
    steps: string[];
    expectedOutcomes: string[];
    preparation: string;
    objectives: string[];
    duration: string;
    treeType: string;
    gradeLevel: string;
    skills: string[];
    tags: string[];
    link: string;
    image: string;
    category: string;
    favorite: boolean;
    audio: string;
    video: string;
    difficulty: string;
    season: string;
    equipment: string[];
    background: string;
    standards: string[];
    notes: string;
    documentations: any[];
    resources: Resources;
}