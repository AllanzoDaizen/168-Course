const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// View all courses
router.get('/', courseController.getCourses);

// Create a course
router.get('/courses/create', courseController.getCreateForm);
router.post('/courses/create', courseController.createCourse);

// Edit a course
router.get('/courses/edit/:id', courseController.getEditForm);
router.post('/courses/edit/:id', courseController.updateCourse);

// Delete a course
router.post('/courses/delete/:id', courseController.deleteCourse);

module.exports = router;
