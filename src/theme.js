// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#430099',
    },
    secondary: {
      main: '#ffffff',
    },
  },
  typography: {
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      marginBottom: '20px',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      marginTop: '20px',
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

export default theme;
