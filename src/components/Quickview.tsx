import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  CircularProgress,
  Typography,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Result, SearchEngine, buildQuickview } from '@coveo/headless';

interface QuickviewProps {
  result: Result;
  engine: SearchEngine;
}

export const Quickview: React.FC<QuickviewProps> = ({ result, engine }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const quickview = buildQuickview(engine, {
    options: { result },
  });

  const [state, setState] = useState(quickview.state);

  useEffect(() => {
    return quickview.subscribe(() => setState(quickview.state));
  }, [quickview]);

  const handleOpen = async () => {
    if (!state.resultHasPreview) {
      setError('No preview available for this item');
      setOpen(true);
      return;
    }

    setOpen(true);
    setLoading(true);
    setError(null);

    try {
      // Call fetchResultContent which updates the state
      quickview.fetchResultContent();
    } catch (err) {
      console.error('Error fetching quickview content:', err);
      setError(err instanceof Error ? err.message : 'Failed to load preview content.');
      setLoading(false);
    }
  };

  // Monitor state changes to detect when content is loaded
  useEffect(() => {
    if (open && state.content && loading) {
      setLoading(false);
      setError(null);
    }
  }, [state.content, open, loading]);

  const handleClose = () => {
    setOpen(false);
    setError(null);
    setLoading(false);
  };

  // Check if quickview button should be shown
  if (!state.resultHasPreview) {
    return null;
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        size="small"
        sx={{
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          },
          transition: 'all 0.2s ease-in-out',
        }}
        title="Quick preview"
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            height: '80vh',
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`,
            pb: 2,
          }}
        >
          <Typography variant="h6" component="div" sx={{ pr: 2 }}>
            {result.title}
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, position: 'relative' }}>
          {loading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                color: theme.palette.error.main,
              }}
            >
              <Typography>{error}</Typography>
            </Box>
          )}

          {state.content && !loading && !error && (
            <Box
              sx={{
                height: '100%',
                backgroundColor: theme.palette.background.default,
                '& iframe': {
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: '#fff',
                },
              }}
            >
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html lang="en">
                    <head>
                      <meta charset="UTF-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        body {
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                          line-height: 1.6;
                          color: #333;
                          max-width: 100%;
                          margin: 0;
                          padding: 20px;
                          background-color: #fff;
                        }
                        img {
                          max-width: 100%;
                          height: auto;
                        }
                        * {
                          box-sizing: border-box;
                        }
                      </style>
                    </head>
                    <body>
                      ${state.content}
                    </body>
                  </html>
                `}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                title={`Preview of ${result.title}`}
              />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};