export type QuoteType = 'auf' | 'sun-tzu';

export interface Quote {
  text: string;
  type: QuoteType;
}

export interface GameState {
  currentQuote: Quote | null;
  score: number;
  totalQuestions: number;
  isGameOver: boolean;
} 