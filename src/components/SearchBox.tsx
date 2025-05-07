import { SearchBox as SearchBoxController } from "@coveo/headless";
import { useEffect, useState, FunctionComponent } from 'react';
import { 
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Box,
  InputAdornment,
  alpha,
  useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBoxProps {
  controller: SearchBoxController;
}

const SearchBox: FunctionComponent<SearchBoxProps> = (props) => {
  const { controller } = props;
  const [state, setState] = useState(controller.state);
  const theme = useTheme();

  useEffect(() => {
    controller.subscribe(() => setState(controller.state));
  }, [controller]);

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          backgroundColor: theme.palette.background.paper,
          transition: 'all 0.2s ease-in-out',
          transform: 'translateY(0)',
          '&:hover': {
            transform: 'translateY(-4px)',
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.2)}`,
          },
        }}
      >
        <TextField
          fullWidth
          placeholder="Search..."
          value={state.value}
          onChange={(e) => controller.updateText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && controller.submit()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '1.25rem',
                    ml: 1
                  }} 
                />
              </InputAdornment>
            ),
            sx: {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: alpha(theme.palette.primary.main, 0.5),
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              fontSize: '1rem',
              color: theme.palette.text.primary,
              py: 1.5,
              px: 1,
            },
          }}
        />
      </Paper>
      
      {state.suggestions.length > 0 && (
        <Paper 
          elevation={0}
          sx={{ 
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            zIndex: 1,
            mt: 0.5,
            maxHeight: '400px',
            overflow: 'auto',
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.divider,
            boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.2)}`,
          }}
        >
          <List disablePadding>
            {state.suggestions.map((suggestion) => (
              <ListItem 
                key={suggestion.rawValue} 
                disablePadding
              >
                <ListItemButton
                  onClick={() => controller.selectSuggestion(suggestion.rawValue)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                    transition: 'background-color 0.2s ease-in-out',
                  }}
                >
                  <ListItemText 
                    primary={
                      <span 
                        dangerouslySetInnerHTML={{
                          __html: suggestion.highlightedValue
                        }}
                        style={{
                          color: theme.palette.text.primary,
                          fontSize: '0.95rem',
                        }}
                      />
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBox;