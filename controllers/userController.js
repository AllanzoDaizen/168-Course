const User = require('../models/user');

// Register user
async function register(req, res) {
  const { firstname, lastname, email, password } = req.body;
  try {
    const result = await User.registerUser(firstname, lastname, email, password);
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
}

// Login user using Passport
async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const user = await User.authenticateUser(email, password);
    if (user) {
      req.login(user, (err) => {
        if (err) {
          return next(err);  // Handle any errors during login
        }
        res.redirect('/home');  // Redirect to home if login is successful
      });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in');
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

async function logout(req, res) {
  req.logout();
  res.redirect('/logout');
}
module.exports = { register, login, home, logout };
