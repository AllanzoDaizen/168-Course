const User = require('../models/user');

// Register user
async function register(req, res) {
  const { firstname, lastname, email, password } = req.body;
  try {
    const result = await User.registerUser(firstname, lastname, email, password);
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render('register', { // Use res.render() to render the registration page with error messages
      messages: { error: [error.message] } 
    });
  }
}


async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.authenticateUser(email, password);
    if (user) {
      req.login(user, (err) => {
        if (err) {
          return next(err); // Handle any errors during login
        }
        res.redirect('/home'); // Redirect to home if login is successful
      });
    } else {
      req.flash('error', 'Invalid credentials. Please try again.');
      res.redirect('/login'); // Redirect to login page on failure
    }
  } catch (error) {
    console.error(error);
    req.flash('error', 'An error occurred during login. Please try again.');
    res.redirect('/login'); // Redirect to login page on error
  }
}


// Home page after login
function home(req, res) {
  if (req.isAuthenticated()) {
    res.render('home', { user: req.user });
  } else {
    res.redirect('/login');
  }
}
async function logout(req, res, next) {
  // Log out the user and destroy the session
  req.logout((err) => {
    if (err) {
      return next(err); // Handle any logout error
    }

    // Destroy the session data
    req.session.destroy((err) => {
      if (err) {
        return next(err); // Handle any session destruction error
      }

      // After logging out, redirect to home page with default user data
      res.render('home', { user: { firstname: 'User', email: 'Not logged in' } });
    });
  });
}


module.exports = { register, login, home, logout };
