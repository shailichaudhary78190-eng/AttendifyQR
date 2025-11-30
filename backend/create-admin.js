import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import readline from "readline";
import User from "./src/models/User.js";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URI ;

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("      CREATE NEW ADMIN ACCOUNT");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const name = await question("👤 Admin Full Name: ");
    const email = await question("📧 Email Address: ");
    const password = await question("🔑 Password: ");

    rl.close();

    // Validate input
    if (!name || !email || !password) {
      console.log("\n❌ Error: All fields are required!");
      process.exit(1);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("\n❌ Error: Invalid email format!");
      process.exit(1);
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`\n❌ Error: Admin with email '${email}' already exists!`);
      console.log("\nExisting user details:");
      console.log("  Name:", existing.name);
      console.log("  Role:", existing.role);
      console.log("  Created:", existing.createdAt);
      process.exit(1);
    }

    // Hash password
    console.log("\n⏳ Creating admin account...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await User.create({
      email,
      password: hashedPassword,
      name,
      role: "admin",
    });

    console.log("\n✅ SUCCESS! Admin account created!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  ADMIN ACCOUNT DETAILS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  ID:      ", admin._id);
    console.log("  Name:    ", admin.name);
    console.log("  Email:   ", admin.email);
    console.log("  Role:    ", admin.role);
    console.log("  Created: ", admin.createdAt);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("🌐 You can now login at: http://localhost:5173");
    console.log("📧 Email:", admin.email);
    console.log("🔑 Password:", password);
    console.log("\n⚠️  IMPORTANT: Keep your credentials secure!\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error creating admin:", error.message);
    process.exit(1);
  }
}

createAdmin();
