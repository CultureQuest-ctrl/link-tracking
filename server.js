const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. List of links (slug -> destination URL)
const links = {
  'google': 'https://www.google.com',
  'github': 'https://github.com',
  'my-site': 'https://example.com'
};

// File to store click logs
const logFile = path.join(__dirname, 'clicks.log');

// 2. Redirect and logging route
app.get('/:slug', (req, res) => {
  const { slug } = req.params;
  const destination = links[slug];

  if (!destination) {
    return res.status(404).send('<h1>404 - Link not found</h1>');
  }

  // Gather log data
  const timestamp = new Date().toISOString();
  const userAgent = req.get('User-Agent') || 'Unknown';

  // Format log entry
  const logEntry = `[${timestamp}] Clicked: ${slug} | User-Agent: ${userAgent}\n`;

  // Log the click to clicks.log (in a real app, this might go to a database)
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error('Failed to log click:', err);
    }
  });

  // Redirect to the destination URL
  res.redirect(destination);
});

// A simple home route so the root isn't empty
app.get('/', (req, res) => {
  res.send(`
    <h2>Link Tracker is running!</h2>
    <p>Try visiting these links:</p>
    <ul>
      ${Object.keys(links).map(slug => `<li><a href="/${slug}">/${slug}</a></li>`).join('')}
    </ul>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Available links based on the configuration:');
  for (const slug in links) {
    console.log(`  http://localhost:${PORT}/${slug} -> ${links[slug]}`);
  }
});
