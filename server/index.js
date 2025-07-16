// Server index.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');

// Routes
const uploadRoute = require('./routes/upload');
const scanRoute = require('./routes/scan');
const projectsRoute = require('./routes/projects');
const compareRoute = require('./routes/compareRoute')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../client/build')));

// Use routes
app.use('/upload', uploadRoute);
app.use('/scan', scanRoute);
app.use('/projects', projectsRoute);
app.use('/compare', compareRoute);

app.get('/', (req, res) => {
  res.send('API is running');
});

/* Server now runs on 0.0.0.0 to support local network access
   Using HashRouter in frontend to simplify routing and avoid path to regexp errors */
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
};

const host = '0.0.0.0';
app.listen(PORT, host, () => {
  console.log(`Server running on http://${getLocalIp()}:${PORT}`);
})