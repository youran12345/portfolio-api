const Project = require('../models/Project');

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({})
      .populate('user', 'username')
      .sort('-createdAt');
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single project
 * @route   GET /api/projects/:id
 * @access  Public
 */
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'user',
      'username'
    );
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a project (associated with logged-in user)
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = async (req, res, next) => {
  try {
    const { title, description, imageUrl, repoUrl, liveUrl } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error('Title and description are required');
    }

    const project = await Project.create({
      title,
      description,
      imageUrl: imageUrl || '',
      repoUrl: repoUrl || '',
      liveUrl: liveUrl || '',
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 * @access  Private
 */
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const { title, description, imageUrl, repoUrl, liveUrl } = req.body;

    project.title = title !== undefined ? title : project.title;
    project.description =
      description !== undefined ? description : project.description;
    project.imageUrl = imageUrl !== undefined ? imageUrl : project.imageUrl;
    project.repoUrl = repoUrl !== undefined ? repoUrl : project.repoUrl;
    project.liveUrl = liveUrl !== undefined ? liveUrl : project.liveUrl;

    const updated = await project.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a project
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
