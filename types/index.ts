export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Supplement {
  id: string;
  name: string;
  tagline: string;
  ingredients: string[];
  goals: string[];
  price: string;
  format: string;
}
