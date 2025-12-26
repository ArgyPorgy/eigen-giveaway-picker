const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 8080;
const distPath = path.join(__dirname, 'dist');

// Serve static files
app.use(express.static(distPath));

// Handle React Router - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`SportsBet server running on port ${port}`);
  console.log(`Serving from: ${distPath}`);
});

