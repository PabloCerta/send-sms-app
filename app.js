const express = require('express');
const path = require('path');
const activity = require('./routes/activity');
const port = process.env.PORT || 8000;

// express
const app = express();

// setup static folder
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api/activity', activity);

// init server
app.listen(port, () => console.log(`Server is running on port ${port}...`));