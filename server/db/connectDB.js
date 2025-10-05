import mongoose from "mongoose";

let isConnected = false;
async function connect() {
  if (isConnected) {
    // Reuse existing connection
    console.log("🟢 Using existing MongoDB connection");
    return;
  }
  try {
   const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${"D-BLOG"}`, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 60000,
    });
    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

export default connect;
