// src/types/tree.ts
export interface Tree {
    id?: string;
    name: string;
    description: string;
    image: string;
    activities?: string[]; // מערך של מזהי פעילויות הקשורות לעץ
    createdAt?: Date;
    updatedAt?: Date;
  }