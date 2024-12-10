import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import activity from './routes/activity.js';
const port = process.env.PORT || 8000;

// get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// express
const app = express();

// setup static folder
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api/activity', activity);

// init server
app.listen(port, () => console.log(`Server is running on port ${port}...`));