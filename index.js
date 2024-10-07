const express = require('express');
const bodyParser = require('body-parser');
const uploadRoutes = require('./routes');
const cors = require('cors'); 
const path = require("path");

const app = express();
const port = 4000;

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the public/images directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/api', uploadRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
