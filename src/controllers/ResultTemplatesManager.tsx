import {
  ResultTemplatesManager,
  Result,
  buildResultTemplatesManager,
  SearchEngine,
} from '@coveo/headless';
import { InteractiveResult } from '../components/InteractiveResult';
import { Quickview } from '../components/Quickview';
import { headlessEngine } from '../Engine';
import { 
  Box, 
  Typography, 
  Paper, 
  alpha, 
  Chip,
  Stack,
  Rating,
  Divider
} from '@mui/material';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';

const titleColor = '#6CB3F5'
const textColor = '#6CB3F5'

function extractTitle(input_str: String){
  return input_str.split('|')[0].trim();
}

export const buildResultTemplatesManagerWithEngine = (engine: SearchEngine): ResultTemplatesManager<(result: Result) => JSX.Element> => {
  const manager: ResultTemplatesManager<(result: Result) => JSX.Element> = buildResultTemplatesManager(engine);
 
  manager.registerTemplates(
    {
      conditions: [],
      content: (result: Result) => {
        const title = extractTitle(result.title);
        const price = result.raw.ec_price as string;
        const availability = result.raw.product_availability as string;
        const rating = parseFloat(result.raw.product_rating as string) || 0;
        const productName = result.raw.product_name as string;
        const categories = result.raw.category as string;
        const categoryList = categories ? categories.split(';').filter(Boolean) : [];
        
        return (
          <li key={result.uniqueId} style={{marginBottom: '16px', listStyle: 'none'}}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
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
                    width: '130px',
                    height: '130px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 1,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {result.raw.imageurl ? (
                    <img
                      src={result.raw.imageurl as string}
                      alt={title}
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
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        flex: 1,
                        mr: 2,
                        color: 'primary.light',
                      }}
                    >
                      <InteractiveResult result={result} engine={engine}>
                        <span 
                        style={{ 
                          color: titleColor,
                          textDecoration: "underline",
                          textDecorationColor: titleColor,
                          }}>
                          {title}
                        </span>
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
                      mt: 1,
                      mb: 2,
                    }}
                  >
                    {result.excerpt || result.printableUri}
                  </Typography>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                    mt: 1.5
                  }}>
                    {(
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalOfferIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography
                          variant="body1"
                          sx={{ 
                            fontWeight: 600,
                            color: 'primary.main'
                          }}
                        >
                          ${parseFloat(price).toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                    
                    {(
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <InventoryIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: 'primary.main'
                          }}
                        >
                          {availability} available
                        </Typography>
                      </Box>
                    )}
                    
                    {(
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating 
                          value={rating/20.0} 
                          readOnly 
                          precision={0.5} 
                          size="small" 
                        />
                        <Typography variant="body2" color="text.secondary">
                          ({rating})
                        </Typography>
                      </Box>
                    )}
                    
                    {(
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        {productName}
                      </Typography>
                    )}
                  </Box>
                  
                  {(
                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {categoryList.map((category, index) => (
                        <Chip
                          key={index}
                          label={category.trim()}
                          size="small"
                          sx={{ 
                            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                            color: 'text.primary',
                            fontSize: '0.7rem',
                            height: '24px'
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </Paper>
          </li>
        );
      },
      fields: ['imageurl', 'source', 'image_url', 'ec_price', 'product_availability', 'product_rating', 'category', 'product_name'],
    },
  );
  return manager;
};

export const resultTemplatesManager = buildResultTemplatesManagerWithEngine(headlessEngine);