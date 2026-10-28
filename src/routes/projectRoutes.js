const router = require('express').Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/protect');

router
  .route('/')
  .get(getProjects)
  .post(protect, createProject);

router
  .route('/:id')
  .get(getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
