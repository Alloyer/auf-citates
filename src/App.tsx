import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Game from './components/Game';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff9800', // оранжевый для АУФ
    },
    secondary: {
      main: '#2196f3', // синий для Сунь-Цзы
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Game />
    </ThemeProvider>
  );
}

export default App;
