// create web server
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// create a static web server
app.use(express.static('public'));

// create a route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// create a route
app.get('/comments', (req, res) => {
  res.sendFile(path.join(__dirname + '/comments.html'));
});

// start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});