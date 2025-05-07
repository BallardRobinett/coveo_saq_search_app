import { Facet as FacetController } from '@coveo/headless';
import { useEffect, useState, FunctionComponent } from 'react';
import { FacetSearch } from './FacetSearch';
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
  Box,
  Divider
} from '@mui/material';

interface FacetProps {
  controller: FacetController;
  title: string;
}

const Facet: FunctionComponent<FacetProps> = (props) => {
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
      
      <FacetSearch
        controller={controller.facetSearch}
        facetSearchState={state.facetSearch}
      />
      
      <List dense>
        {state.values.map((value) => (
          <ListItem
            key={value.value}
            dense
            disablePadding
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Checkbox
                edge="start"
                checked={controller.isValueSelected(value)}
                onChange={() => controller.toggleSelect(value)}
                disabled={state.isLoading}
                size="small"
              />
            </ListItemIcon>
            <ListItemText 
              primary={value.value}
              secondary={`(${value.numberOfResults})`}
            />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        {state.canShowMoreValues && (
          <Button 
            size="small"
            onClick={() => controller.showMoreValues()}
          >
            Show More
          </Button>
        )}
        {state.canShowLessValues && (
          <Button
            size="small"
            onClick={() => controller.showLessValues()}
          >
            Show Less
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Facet;