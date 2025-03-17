export type QuoteType = 'auf' | 'sun-tzu' | 'confucius' | 'klitschko';

export type OpponentType = Exclude<QuoteType, 'auf'>;

export interface Quote {
  text: string;
  type: QuoteType;
}

export interface QuoteHistory {
  quote: Quote;
  userAnswer: QuoteType;
  isCorrect: boolean;
  opponent: OpponentType;
}

export interface GameState {
  currentQuote: Quote | null;
  score: number;
  totalQuestions: number;
  isGameOver: boolean;
  currentOpponent: OpponentType;
  history: QuoteHistory[];
  currentHistoryIndex: number;
  usedQuotes: Set<string>;
} 