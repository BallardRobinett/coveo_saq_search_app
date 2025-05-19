import { NumericFacet as NumericFacetController } from '@coveo/headless';
import { useEffect, useState, FunctionComponent } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Box,
  Divider
} from '@mui/material';

interface AvailabilityFacetProps {
  controller: NumericFacetController;
  title: string;
}

const AvailabilityFacet: FunctionComponent<AvailabilityFacetProps> = (props) => {
  const { controller } = props;
  const [state, setState] = useState(controller.state);

  useEffect(() => controller.subscribe(() => setState(controller.state)), [controller]);

  if (!state.values.length) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>{props.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          No availability filters available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>{props.title}</Typography>
      
      <List dense>
        {state.values.map((value) => (
          <ListItem
            key={`${value.start}-${value.end}`}
            dense
            disablePadding
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Checkbox
                edge="start"
                checked={value.state === 'selected'}
                onChange={() => controller.toggleSelect(value)}
                disabled={state.isLoading}
                size="small"
              />
            </ListItemIcon>
            <ListItemText 
              primary={value.start > 0 ? 'In Stock' : 'Out of Stock'}
              secondary={`(${value.numberOfResults})`}
            />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 1 }} />
    </Box>
  );
};

export default AvailabilityFacet;