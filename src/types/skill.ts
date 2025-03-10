export interface Skill {
    id?: string;
    name: string;
    description: string;
    subject: string;
    level: number;
    icon?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }