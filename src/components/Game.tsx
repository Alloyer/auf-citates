import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { quotes } from '../data/quotes';
import { GameState, Quote, QuoteType, OpponentType, QuoteHistory } from '../types';

const APP_VERSION = '0.1.0';
const MAX_QUOTES = 100;

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
    currentOpponent: 'sun-tzu',
    history: [],
    currentHistoryIndex: -1,
    usedQuotes: new Set()
  });

  const getRandomQuote = useCallback((): Quote => {
    const availableQuotes = quotes.filter(quote => !gameState.usedQuotes.has(quote.text));
    if (availableQuotes.length === 0) {
      return quotes[0]; // возвращаем любую цитату, она не будет использована из-за isGameOver
    }
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    return availableQuotes[randomIndex];
  }, []);

  const getRandomOpponent = useCallback((): OpponentType => {
    const randomIndex = Math.floor(Math.random() * OPPONENTS.length);
    return OPPONENTS[randomIndex];
  }, []);

  const startNewGame = useCallback(() => {
    setGameState(prev => {
      const firstQuote = getRandomQuote();
      return {
        currentQuote: firstQuote,
        score: 0,
        totalQuestions: 0,
        isGameOver: false,
        currentOpponent: getRandomOpponent(),
        history: [],
        currentHistoryIndex: -1,
        usedQuotes: new Set([firstQuote.text])
      };
    });
  }, [getRandomQuote, getRandomOpponent]);

  const handleAnswer = (answer: QuoteType) => {
    if (gameState.currentHistoryIndex !== -1 || gameState.isGameOver) return;

    setGameState(prev => {
      const isCorrect = prev.currentQuote?.type === answer;
      const newQuote = getRandomQuote();
      const newOpponent = getRandomOpponent();

      if (prev.totalQuestions + 1 >= MAX_QUOTES) {
        return {
          ...prev,
          score: isCorrect ? prev.score + 1 : prev.score,
          totalQuestions: prev.totalQuestions + 1,
          isGameOver: true,
          history: [...prev.history, {
            quote: prev.currentQuote!,
            userAnswer: answer,
            isCorrect,
            opponent: prev.currentOpponent
          }]
        };
      }

      const newHistory: QuoteHistory = {
        quote: prev.currentQuote!,
        userAnswer: answer,
        isCorrect,
        opponent: prev.currentOpponent
      };

      const newSet = new Set(prev.usedQuotes);
      newSet.add(newQuote.text);

      return {
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        totalQuestions: prev.totalQuestions + 1,
        currentQuote: newQuote,
        currentOpponent: newOpponent,
        history: [...prev.history, newHistory],
        usedQuotes: newSet
      };
    });
  };

  const navigateHistory = (direction: 'back' | 'forward') => {
    setGameState(prev => {
      if (prev.currentHistoryIndex === -1 && direction === 'back') {
        const newIndex = prev.history.length - 1;
        if (newIndex >= 0) {
          const historyItem = prev.history[newIndex];
          return {
            ...prev,
            currentHistoryIndex: newIndex,
            currentQuote: historyItem.quote,
            currentOpponent: historyItem.opponent
          };
        }
        return prev;
      }

      let newIndex = direction === 'back' 
        ? prev.currentHistoryIndex - 1
        : prev.currentHistoryIndex + 1;

      if (newIndex >= prev.history.length) {
        return {
          ...prev,
          currentHistoryIndex: -1,
          currentQuote: prev.currentQuote,
          currentOpponent: prev.currentOpponent
        };
      }

      if (newIndex < 0) {
        return prev;
      }

      const historyItem = prev.history[newIndex];
      return {
        ...prev,
        currentHistoryIndex: newIndex,
        currentQuote: historyItem.quote,
        currentOpponent: historyItem.opponent
      };
    });
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

  const isViewingHistory = gameState.currentHistoryIndex !== -1;
  const currentHistoryItem = isViewingHistory ? gameState.history[gameState.currentHistoryIndex] : null;

  return (
    <Container maxWidth="sm">
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        minHeight="100vh" 
        py={4}
        position="relative"
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {gameState.isGameOver ? "Игра окончена!" : "Угадай цитату"}
          </Typography>
          
          {/* Navigation controls */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            <IconButton 
              onClick={() => navigateHistory('back')}
              disabled={gameState.currentHistoryIndex === 0}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="body2" sx={{ alignSelf: 'center' }}>
              {`Цитата ${gameState.currentHistoryIndex === -1 ? gameState.history.length + 1 : gameState.currentHistoryIndex + 1} из ${gameState.history.length + 1}`}
            </Typography>
            <IconButton 
              onClick={() => navigateHistory('forward')}
              disabled={gameState.currentHistoryIndex === -1}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" sx={{ my: 4 }}>
            "{gameState.currentQuote.text}"
          </Typography>

          {isViewingHistory ? (
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" sx={{ 
                color: currentHistoryItem?.isCorrect ? 'success.main' : 'error.main',
                fontWeight: 'bold'
              }}>
                {currentHistoryItem?.isCorrect ? "Правильно!" : "Неправильно!"}
              </Typography>
              <Typography variant="body2">
                Ваш ответ: {currentHistoryItem?.userAnswer === 'auf' ? 
                  "АУФ цитата волка" : 
                  getOpponentButtonText(currentHistoryItem?.opponent!)}
              </Typography>
              <Typography variant="body2">
                Правильный ответ: {currentHistoryItem?.quote.type === 'auf' ? 
                  "АУФ цитата волка" : 
                  getOpponentButtonText(currentHistoryItem?.quote.type as OpponentType)}
              </Typography>
            </Box>
          ) : (
            <Box sx={buttonContainerStyles}>
              <Button
                variant="contained"
                color="warning"
                onClick={() => handleAnswer('auf')}
                size="large"
                disabled={gameState.isGameOver}
              >
                Это АУФ цитата волка
              </Button>
              <Button
                variant="contained"
                color="info"
                onClick={() => handleAnswer(gameState.currentOpponent)}
                size="large"
                disabled={gameState.isGameOver}
              >
                {getOpponentButtonText(gameState.currentOpponent)}
              </Button>
            </Box>
          )}

          <Typography variant="h6" sx={{ mt: 4 }}>
            Счёт: {gameState.score} / {gameState.totalQuestions}
          </Typography>

          {gameState.isGameOver && (
            <Typography variant="body1" sx={{ mt: 2, color: 'warning.main' }}>
              Достигнут лимит цитат ({MAX_QUOTES})
            </Typography>
          )}

          <Button
            variant="outlined"
            onClick={startNewGame}
            sx={{ mt: 2 }}
          >
            Начать заново
          </Button>
        </Paper>
        
        <Typography 
          variant="caption" 
          sx={{ 
            position: 'absolute',
            bottom: 8,
            right: 8,
            opacity: 0.4,
            userSelect: 'none'
          }}
        >
          v{APP_VERSION}
        </Typography>
      </Box>
    </Container>
  );
};

export default Game; 