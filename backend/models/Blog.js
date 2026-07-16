const mongoose = require("mongoose");
const slugify = require("slugify");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true }, // markdown or HTML
    coverImage: { type: String, required: true },
    category: { type: String, default: "Market Insights" },
    tags: [{ type: String }],
    published: { type: Boolean, default: true },
    author: { type: String, default: "Tom Sondagar" },
    readTimeMinutes: { type: Number, default: 4 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

BlogSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(`${this.title}-${Date.now().toString().slice(-5)}`, {
      lower: true,
      strict: true,
    });
  }
  next();
});

module.exports = mongoose.model("Blog", BlogSchema);
