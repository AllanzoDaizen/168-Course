const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const userController = require('./controllers/userController');

const app = express();

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/css', express.static('public/css'));  // Serve static files like CSS
app.use('/img', express.static('public/img'));  // Serve static files like images

// Session setup
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,  // Set to true if you're using HTTPS
  }
}));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Routes for normal user login and registration
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/user/register', userController.register);

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/user/login', userController.login);

// This is useful if you want to use passport.authenticate for your login:
app.post('/user/login', passport.authenticate('local', { 
  failureRedirect: '/login',
  failureFlash: true 
}), (req, res) => {
  res.redirect('/home');
});


// Home page route (Ensure it's not duplicated)
app.get('/home', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('home', { user: req.user });
  } else {
    res.redirect('/login');
  }
});

// Routes for Google OAuth login
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google callback route
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/home');
  }
);

app.get('/logout', (req, res) => {
  res.render('logout');
});
// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});

// Passport configuration
require('./config/passport-config'); 
