import { NumericFacet as NumericFacetController } from '@coveo/headless';
import { useEffect, useState, FunctionComponent } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Box
} from '@mui/material';

interface NumericFacetProps {
  controller: NumericFacetController;
  title: string;
}

const NumericFacet: FunctionComponent<NumericFacetProps> = (props) => {
  const { controller } = props;
  const [state, setState] = useState(controller.state);

  useEffect(() => controller.subscribe(() => setState(controller.state)), [controller]);

  if (!state.values.length) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>{props.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          No facet values available
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
              primary={'test text'}
              secondary={`(${value.numberOfResults})`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NumericFacet;