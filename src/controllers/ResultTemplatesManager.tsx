import {
  ResultTemplatesManager,
  Result,
  buildResultTemplatesManager,
  SearchEngine,
} from '@coveo/headless';
import { InteractiveResult } from '../components/InteractiveResult';
import { Quickview } from '../components/Quickview';
import { headlessEngine } from '../Engine';
import { Box, Typography, Paper, alpha, useTheme, Stack } from '@mui/material';

export const buildResultTemplatesManagerWithEngine = (engine: SearchEngine): ResultTemplatesManager<(result: Result) => JSX.Element> => {
  const manager: ResultTemplatesManager<(result: Result) => JSX.Element> = buildResultTemplatesManager(engine);
 
  manager.registerTemplates(
    {
      conditions: [],
      content: (result: Result) => (
        <li key={result.uniqueId} style={{marginBottom: '16px', listStyle: 'none'}}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
              },
            }}
          >
            <Box display="flex" gap={3}>
              <Box
                sx={{
                  width: '120px',
                  height: '120px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: (theme) => alpha(theme.palette.common.black, 0.05),
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                {result.raw.imageurl ? (
                  <img
                  src={result.raw.imageurl as string}
                  alt={result.title}
                  style={{
                     maxWidth: '100%',
                     maxHeight: '100%',
                     objectFit: 'contain'
                    }}
                />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                    }}
                  >
                    No image
                  </Box>
                )}
              </Box>
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontSize: '1.1rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      flex: 1,
                      mr: 2,
                    }}
                  >
                    <InteractiveResult result={result} engine={engine}>
                      {result.title}
                    </InteractiveResult>
                  </Typography>
                  <Quickview result={result} engine={engine} />
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {result.excerpt || result.printableUri}
                </Typography>
                {result.raw.source && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    Source: {result.raw.source}
                  </Typography>
                )}
              </Box>
            </Box>
          </Paper>
        </li>
      ),
      fields: ['imageurl', 'source'],
    },
  );
  return manager;
};

export const resultTemplatesManager = buildResultTemplatesManagerWithEngine(headlessEngine);