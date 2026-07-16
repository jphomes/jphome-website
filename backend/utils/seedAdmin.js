require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
    if (existing) {
      console.log(`Admin "${process.env.ADMIN_USERNAME}" already exists. Skipping.`);
      process.exit(0);
    }

    await Admin.create({
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: "Tom Sondagar",
    });

    console.log(`✅ Admin account "${process.env.ADMIN_USERNAME}" created.`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed admin:", err.message);
    process.exit(1);
  }
})();
