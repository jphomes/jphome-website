require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

(async () => {
  try {
    const { resolveMongoUri } = require("./mongoUri");
    const mongo = resolveMongoUri();
    await mongoose.connect(mongo.uri);

    const username = (process.env.ADMIN_USERNAME || "").trim();
    const email = (process.env.ADMIN_EMAIL || username).trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || "JP Homes Admin";

    if (!username || !password) {
      throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD are required in .env");
    }

    let admin = await Admin.findOne({ $or: [{ username }, { email }] });

    if (admin) {
      admin.username = username;
      admin.email = email;
      admin.password = password; // hashed by pre-save hook
      admin.name = name;
      await admin.save();
      console.log(`✅ Admin "${username}" updated (${mongo.label}).`);
    } else {
      await Admin.create({ username, email, password, name });
      console.log(`✅ Admin "${username}" created (${mongo.label}).`);
    }

    process.exit(0);
  } catch (err) {
    console.error("Failed to seed admin:", err.message);
    process.exit(1);
  }
})();
