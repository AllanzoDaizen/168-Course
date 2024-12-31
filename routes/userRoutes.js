const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Ensure the path is correct

// Login route
router.get('/user/login', userController.getLogin); // Get login page
router.post('/user/login', userController.login); // Post login form

// Register route
router.get('/user/register', userController.getRegister); // Get register page
router.post('/user/register', userController.register); // Post register form

module.exports = router;