const express = require('express');
const path = require('path');
const app = express();

// Parse JSON bodies
app.use(express.json());

// Serve static files from the dist directory with proper headers
app.use(express.static('dist', {
  setHeaders: (res, filePath) => {
    // Set proper MIME types
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.set('Content-Type', 'text/css; charset=utf-8');
    } else if (filePath.endsWith('.html')) {
      res.set('Content-Type', 'text/html; charset=utf-8');
    }

    // Set caching headers
    res.set('Cache-Control', 'public, max-age=3600');
  },
  immutable: true,
  maxAge: '1h'
}));

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Current directory: ${process.cwd()}`);
  console.log(`Static files being served from: ${path.join(process.cwd(), 'dist')}`);
});