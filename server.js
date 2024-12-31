const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const courseRoutes = require('./routes/courseRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// app.use(express.static('public'));
app.use('/css', express.static('public/css'));
app.use('/img', express.static('public/img'));  // Serve static files like images
app.use('/js', express.static('public/js'));  // Serve static files like images
// Routes
app.use('/', courseRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});