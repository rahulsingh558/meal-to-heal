import { Addon } from './addon';

export interface Food {
  id: number;
  name: string;
  basePrice: number;
  category: 'sprouts' | 'airfried';
  description?: string;
  addons: Addon[];
}
