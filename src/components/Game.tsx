import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { quotes } from '../data/quotes';
import { GameState, Quote, QuoteType, OpponentType } from '../types';

const OPPONENTS: OpponentType[] = ['sun-tzu', 'confucius', 'klitschko'];

const getOpponentButtonText = (opponent: OpponentType): string => {
  switch (opponent) {
    case 'sun-tzu':
      return 'Это фраза Сунь-Цзы';
    case 'confucius':
      return 'Это фраза Конфуция';
    case 'klitschko':
      return 'Это фраза Виталия Кличко';
    default:
      return '';
  }
};

const Game: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const buttonContainerStyles = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
    width: '100%',
    '& > button': {
      width: isMobile ? '100%' : '280px',
      height: 'auto',
      minHeight: '48px',
      whiteSpace: 'normal',
      padding: '12px 16px',
      fontSize: isMobile ? '0.875rem' : '0.9375rem',
      lineHeight: '1.2'
    }
  };

  const [gameState, setGameState] = useState<GameState>({
    currentQuote: null,
    score: 0,
    totalQuestions: 0,
    isGameOver: false,
    currentOpponent: 'sun-tzu'
  });

  const getRandomQuote = useCallback((): Quote => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }, []);

  const getRandomOpponent = useCallback((): OpponentType => {
    const randomIndex = Math.floor(Math.random() * OPPONENTS.length);
    return OPPONENTS[randomIndex];
  }, []);

  const startNewGame = useCallback(() => {
    setGameState({
      currentQuote: getRandomQuote(),
      score: 0,
      totalQuestions: 0,
      isGameOver: false,
      currentOpponent: getRandomOpponent()
    });
  }, [getRandomQuote, getRandomOpponent]);

  const handleAnswer = (answer: QuoteType) => {
    const isCorrect = gameState.currentQuote?.type === answer;
    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      totalQuestions: prev.totalQuestions + 1,
      currentQuote: getRandomQuote(),
      currentOpponent: getRandomOpponent()
    }));
  };

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  if (!gameState.currentQuote) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh" py={4}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Угадай цитату
          </Typography>
          
          <Typography variant="h6" sx={{ my: 4 }}>
            "{gameState.currentQuote.text}"
          </Typography>

          <Box sx={buttonContainerStyles}>
            <Button
              variant="contained"
              color="warning"
              onClick={() => handleAnswer('auf')}
              size="large"
            >
              Это АУФ цитата волка
            </Button>
            <Button
              variant="contained"
              color="info"
              onClick={() => handleAnswer(gameState.currentOpponent)}
              size="large"
            >
              {getOpponentButtonText(gameState.currentOpponent)}
            </Button>
          </Box>

          <Typography variant="h6" sx={{ mt: 4 }}>
            Счёт: {gameState.score} / {gameState.totalQuestions}
          </Typography>

          <Button
            variant="outlined"
            onClick={startNewGame}
            sx={{ mt: 2 }}
          >
            Начать заново
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Game; 