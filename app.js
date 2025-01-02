const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const userController = require('./controllers/userController');
const flash = require('connect-flash');
const app = express();

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/css', express.static('public/css'));  // Serve static files like CSS
app.use('/img', express.static('public/img'));  // Serve static files like images

// Session setup
app.use(session({
  name: 'Cookies',
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,  // Don't save uninitialized sessions
  cookie: { 
    secure: false,  // Set to true if you're using HTTPS
  }
}));


// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Middleware to pass flash messages to views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Routes for normal user login and registration
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', userController.register);

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', userController.login);

// This is useful if you want to use passport.authenticate for your login:
app.post('/login', passport.authenticate('local', { 
  failureRedirect: '/login',
  failureFlash: true 
}), (req, res) => {
  res.redirect('/home');
});


// Home page route (Ensure it's not duplicated)
// app.get('/home', (req, res) => {
//   if (req.isAuthenticated()) {
//     res.render('home', { user: req.user });
//   } else {
//     res.redirect('/login');
//   }
// });
app.get('/home', (req, res) => {
  if (req.isAuthenticated()) {
    // Render home with authenticated user data
    res.render('home', { user: req.user });
  } else {
    // If not authenticated, show a default message or redirect to login
    res.render('home', { user: { firstname: 'User', email: 'Not logged in' } });
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

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Facebook callback handler
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/home');  // Redirect the user to their profile page or dashboard
  });

// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Failed to log out');
    }

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Failed to destroy session');
      }

      // Clear the cookies (ensure 'cookieName' matches the session cookie name)
      res.clearCookie('Cookies', { path: '/' });  // 'Cookies' is your session cookie name

      // Clear any other authentication cookies (like Google token)
      res.clearCookie('googleAuthToken', { path: '/' });

      // Redirect to the logout page or home page
      res.render('logout');
    });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000/home');
});

// Passport configuration
require('./config/passport-config'); 
require('./config/passport-facebook');
