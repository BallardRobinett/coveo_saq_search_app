import { NumericFacet as NumericFacetController } from '@coveo/headless';
import { useEffect, useState, FunctionComponent } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
  Box,
  Divider,
  Slider,
  TextField,
  Grid,
  Stack,
  alpha,
  useTheme
} from '@mui/material';

interface NumericFacetProps {
  controller: NumericFacetController;
  title: string;
}

const NumericFacet: FunctionComponent<NumericFacetProps> = (props) => {
  const { controller, title } = props;
  const [state, setState] = useState(controller.state);
  const theme = useTheme();

  useEffect(() => controller.subscribe(() => setState(controller.state)), [controller]);

  if (!state.values.length) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          No facet values available
        </Typography>
      </Box>
    );
  }

  const handleRangeClick = (value: any) => {
    controller.toggleSelect(value);
  };

  // Format the range labels nicely
  const formatRangeLabel = (range: any) => {
    const start = Math.round(range.start);
    if (range.end === Number.MAX_VALUE) {
      return `${start}+ units`;
    }
    const end = Math.round(range.end);
    return `${start} - ${end} units`;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      
      <Box sx={{ mt: 2 }}>
        <List dense sx={{ px: 0 }}>
          {state.values.map((value) => (
            <ListItem
              key={`${value.start}-${value.end}`}
              dense
              disablePadding
              sx={{ 
                borderRadius: 1,
                my: 0.5,
                transition: 'all 0.15s ease-in-out',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
                ...(controller.isValueSelected(value) && {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                })
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Checkbox
                  edge="start"
                  checked={controller.isValueSelected(value)}
                  onChange={() => handleRangeClick(value)}
                  disabled={state.isLoading}
                  size="small"
                  sx={{
                    color: theme.palette.text.secondary,
                    '&.Mui-checked': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              </ListItemIcon>
              <ListItemText 
                primary={formatRangeLabel(value)}
                secondary={`(${value.numberOfResults})`}
                primaryTypographyProps={{
                  variant: 'body2',
                  color: controller.isValueSelected(value) ? 'primary.main' : 'text.primary',
                  fontWeight: controller.isValueSelected(value) ? 600 : 400,
                }}
                secondaryTypographyProps={{
                  variant: 'caption',
                  color: 'text.secondary',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default NumericFacet;