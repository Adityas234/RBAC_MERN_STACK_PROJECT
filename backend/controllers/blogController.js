import Blog from "../models/Blog.js";


// CREATE BLOG

export const createBlog = async (req, res) => {

  try {

    const { title, content } = req.body;

    const blog = await Blog.create({

      title,

      content,

      author: req.user.id,

      organizationId: req.user.organizationId

    });

    res.status(201).json(blog);

  }

  catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};


// GET ALL BLOGS

export const getBlogs = async (req, res) => {

  try {

    const blogs = await Blog.find({

      organizationId: req.user.organizationId

    }).populate("author", "name email");

    res.json(blogs);

  }

  catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};


// GET MY BLOGS

export const getMyBlogs = async (req, res) => {

  try {

    const blogs = await Blog.find({

      author: req.user.id

    });

    res.json(blogs);

  }

  catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};


// UPDATE BLOG

export const updateBlog = async (req, res) => {

  try {

    const { id } = req.params;

    const { title, content } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {

      return res.status(404).json({
        message: "Blog not found"
      });

    }

    if (blog.author.toString() !== req.user.id) {

      return res.status(403).json({
        message: "Unauthorized"
      });

    }

    blog.title = title;

    blog.content = content;

    await blog.save();

    res.json(blog);

  }

  catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};


// DELETE BLOG

export const deleteBlog = async (req, res) => {

  try {

    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {

      return res.status(404).json({
        message: "Blog not found"
      });

    }

    const isOwner = blog.author.toString() === req.user.id;

    const isAdmin = req.user.permissions.includes("MANAGE_ROLES");

    if (!isOwner && !isAdmin) {

      return res.status(403).json({
        message: "Unauthorized"
      });

    }

    await blog.deleteOne();

    res.json({
      message: "Blog deleted"
    });

  }

  catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

};