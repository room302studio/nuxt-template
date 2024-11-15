export interface Issue {
  title: string;
  body: string;
  history?: {
    combinedFrom?: Issue[];
    combinedAt?: string;
    splitFrom?: Issue;
    splitAt?: string;
  }
} 