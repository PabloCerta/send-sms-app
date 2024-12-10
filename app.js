import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import activity from './routes/activity.js';
const port = process.env.PORT || 8000;

// get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// express
const app = express();

// parse application/json
app.use(bodyParser.json())

// setup static folder
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api/activity', activity);

// init server
app.listen(port, () => console.log(`Server is running on port ${port}...`));