import {
    ResultTemplatesManager,
    Result,
    buildResultTemplatesManager,
  } from '@coveo/headless';
  import { InteractiveResult } from '../components/InteractiveResult';
  import { headlessEngine } from '../Engine';
  import { Box, Typography, Paper, alpha, useTheme } from '@mui/material';
  
  export const resultTemplatesManager: ResultTemplatesManager<
    (result: Result) => JSX.Element
  > = buildResultTemplatesManager(headlessEngine);
  
  resultTemplatesManager.registerTemplates(
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
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontSize: '1.1rem',
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  <InteractiveResult result={result}>
                    {result.title}
                  </InteractiveResult>
                </Typography>
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
                  {result.percentScore}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </li>
      ),
      fields: ['imageurl'],
    },
  );