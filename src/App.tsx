import { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid,
  ThemeProvider,
  createTheme,
  CssBaseline,
  alpha,
  Button
} from '@mui/material';
import SearchBox from "./components/SearchBox";
import NumericFacet from "./components/NumericFacet"; // Import the new NumericFacet component
import ResultList from "./components/ResultList";
import Pager from "./components/Pager";
import { buildControllers } from './controllers/controllers';
import { criteria, Sort } from './components/Sort';
import { headlessEngine, updatePipeline } from "./Engine";

const colors = {
  background: '#1A1C23',
  paper: '#252832',
  primary: '#546E7A',
  secondary: '#455A64',
  accent: '#78909C',
  text: {
    primary: '#E0E3E7',
    secondary: '#B0BEC5',
    muted: '#90A4AE'
  },
  border: '#2F3543'
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: colors.background,
      paper: colors.paper,
    },
    primary: {
      main: colors.primary,
      dark: colors.secondary,
      light: colors.accent,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: colors.text.primary,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
      color: colors.text.primary,
    },
    body1: {
      color: colors.text.secondary,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.paper,
          borderRadius: 8,
          border: `1px solid ${colors.border}`,
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '6px',
          padding: '8px 16px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(colors.paper, 0.6),
          '&:hover': {
            backgroundColor: alpha(colors.paper, 0.8),
          },
          '&.Mui-focused': {
            backgroundColor: colors.paper,
          },
        },
        notchedOutline: {
          borderColor: colors.border,
        },
      },
    },
  },
});

let didInit = false;

function App() {
  const [language, setLanguage] = useState('en');
  const [controllers, setControllers] = useState(() => buildControllers(headlessEngine));

  useEffect(() => {
    if (!didInit) {
      didInit = true;
      headlessEngine.executeFirstSearch();
    }
  }, []);

  useEffect(() => {
    if (didInit) {
      const newEngine = updatePipeline(language);
      const newControllers = buildControllers(newEngine);
      setControllers(newControllers);
      headlessEngine.executeFirstSearch();
    }
  }, [language]);


  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fr' : 'en');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: colors.background,
          pt: 4,
          pb: 6
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 2
            }}
          >
            <Button
              variant="outlined"
              onClick={toggleLanguage}
              sx={{
                color: colors.text.primary,
                borderColor: colors.border,
                '&:hover': {
                  borderColor: colors.primary,
                  backgroundColor: alpha(colors.primary, 0.1),
                },
              }}
            >
              {language === 'en' ? 'French' : 'English'}
            </Button>
          </Box>
          <Typography 
            variant="h1" 
            component="h1" 
            align="center" 
            sx={{ mb: 5 }}
          >
            {language === 'en' ? "SAQ Search App English" : "SAQ Search App French"}
          </Typography>
          
          <Box 
            sx={{ 
              mb: 4,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            <SearchBox controller={controllers.searchBox} />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  backgroundColor: colors.paper,
                }}
              >
                <NumericFacet controller={controllers.numericFacet} title="Available Units" />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={9}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  backgroundColor: colors.paper,
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Sort controller={controllers.sort} criteria={criteria} />
                </Box>
                <ResultList
                  controller={controllers.resultList}
                  resultTemplatesManager={controllers.resultTemplatesManager}
                />
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <Pager controller={controllers.pager} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;