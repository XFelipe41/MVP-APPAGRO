export interface Indicator {
  id: string;
  dimension: 'Técnica' | 'Ecológica' | 'Social';
  question: string;
  type: 'scale' | 'text';
}

export interface Answer {
  indicatorId: string;
  value: number | string;
}

export interface Diagnosis {
  id: string;
  name: string;
  date: string;
  answers: Answer[];
  location: {
    latitude: number;
    longitude: number;
  };
}