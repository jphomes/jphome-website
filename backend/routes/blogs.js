const express = require("express");
const Blog = require("../models/Blog");
const requireAdmin = require("../middleware/auth");

const router = express.Router();

// GET /api/blogs — public, published only, paginated
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 6, category, q } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;
    if (q) filter.title = new RegExp(q, "i");

    const skip = (Number(page) - 1) * Number(limit);
    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Blog.countDocuments(filter),
    ]);

    res.json({ blogs, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch blogs.", error: err.message });
  }
});

// GET /api/blogs/admin/all — admin only, includes drafts.
// NOTE: declared BEFORE "/:slug" below — otherwise Express would treat
// "admin" as a slug value and this route would never be reached.
router.get("/admin/all", requireAdmin, async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

// GET /api/blogs/:slug — public detail
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) return res.status(404).json({ message: "Blog post not found." });

    const recent = await Blog.find({ _id: { $ne: blog._id }, published: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title slug coverImage createdAt");

    res.json({ blog, recent });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch blog post.", error: err.message });
  }
});

// POST /api/blogs — admin only
router.post("/", requireAdmin, async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, createdBy: req.admin.id });
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: "Could not create blog post.", error: err.message });
  }
});

// PUT /api/blogs/:id — admin only
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!blog) return res.status(404).json({ message: "Blog post not found." });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: "Could not update blog post.", error: err.message });
  }
});

// DELETE /api/blogs/:id — admin only
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog post not found." });
    res.json({ message: "Blog post deleted." });
  } catch (err) {
    res.status(500).json({ message: "Could not delete blog post.", error: err.message });
  }
});

module.exports = router;
