import { Pager as PagerController } from '@coveo/headless';
import { useEffect, useState, FunctionComponent } from 'react';
import {
  Box,
  Button,
  IconButton,
  alpha,
  useTheme
} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface PagerProps {
  controller: PagerController;
}

const Pager: FunctionComponent<PagerProps> = (props) => {
  const { controller } = props;
  const [state, setState] = useState(controller.state);
  const theme = useTheme();

  useEffect(() => controller.subscribe(() => setState(controller.state)), [controller]);

  if (state.maxPage <= 1) {
    return null;
  }

  const generatePageRange = () => {
    const maxDisplayPages = 5;
    const currentPage = state.currentPage;
    const maxPage = state.maxPage;
    
    if (maxPage <= maxDisplayPages) {
      return Array.from({length: maxPage}, (_, i) => i + 1);
    }
    
    let startPage = Math.max(1, currentPage - Math.floor(maxDisplayPages / 2));
    let endPage = startPage + maxDisplayPages - 1;
    
    if (endPage > maxPage) {
      endPage = maxPage;
      startPage = Math.max(1, endPage - maxDisplayPages + 1);
    }
    
    return Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
  };

  const pageRange = generatePageRange();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        justifyContent: 'center'
      }}
    >
      {state.maxPage > 5 && (
        <IconButton
          size="small"
          disabled={!state.hasPreviousPage}
          onClick={() => controller.selectPage(1)}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
          aria-label="First page"
        >
          <FirstPageIcon fontSize="small" />
        </IconButton>
      )}

      <IconButton
        size="small"
        disabled={!state.hasPreviousPage}
        onClick={() => controller.previousPage()}
        sx={{
          color: theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          },
        }}
        aria-label="Previous page"
      >
        <NavigateBeforeIcon fontSize="small" />
      </IconButton>

      {pageRange.map((page) => (
        <Button
          key={page}
          size="small"
          variant={controller.isCurrentPage(page) ? "contained" : "outlined"}
          onClick={() => controller.selectPage(page)}
          disabled={controller.isCurrentPage(page)}
          sx={{
            minWidth: '36px',
            height: '36px',
            padding: '0',
            color: controller.isCurrentPage(page) 
              ? theme.palette.primary.contrastText 
              : theme.palette.text.primary,
            borderColor: theme.palette.divider,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          {page}
        </Button>
      ))}

      <IconButton
        size="small"
        disabled={!state.hasNextPage}
        onClick={() => controller.nextPage()}
        sx={{
          color: theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          },
        }}
        aria-label="Next page"
      >
        <NavigateNextIcon fontSize="small" />
      </IconButton>

      {state.maxPage > 5 && (
        <IconButton
          size="small"
          disabled={!state.hasNextPage}
          onClick={() => controller.selectPage(state.maxPage)}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
          aria-label="Last page"
        >
          <LastPageIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default Pager;