const express = require('express');
const cors = require('cors');
const path = require('path');

// Routes
const uploadRoute = require('./routes/upload');
const scanRoute = require('./routes/scan');
const projectsRoute = require('./routes/projects');
const compareRoute = require('./routes/compare');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use routes
app.use('/upload', uploadRoute);
app.use('/scan', scanRoute);
app.use('/projects', projectsRoute);
app.use('/compare', compareRoute);

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});