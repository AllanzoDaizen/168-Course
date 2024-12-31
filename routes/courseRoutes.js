const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const upload = require('../config/multer'); 

// View all courses
router.get('/', courseController.getCourses);

// Create a course
router.get('/courses/create', courseController.getCreateForm);
router.post('/courses/create', (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        console.error('Multer Error:', err);
        return res.status(500).send('File upload error');
      }
      next();  
    });
  }, courseController.createCourse);
  
// Edit a course
router.get('/courses/edit/:id', courseController.getEditForm);
router.post('/courses/edit/:id', courseController.updateCourse);

// Delete a course
router.post('/courses/delete/:id', courseController.deleteCourse);

module.exports = router;
