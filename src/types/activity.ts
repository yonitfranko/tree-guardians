export interface Activity {
    id?: string;
    name: string;
    materials: string;
    description: string;
    summary: string;
    preparation: string;
    image: string;
    participants: string;
    category: string;
    favorite: boolean;
    ageGroup: string;
    notes: string;
    audio: string;
    link: string;
    subjects: string[];
    skillIds: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }