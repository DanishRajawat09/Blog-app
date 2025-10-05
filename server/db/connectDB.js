import mongoose from "mongoose";

async function connect() {
  try {
    mongoose.connection.on("connected", () =>
      console.log("database is connected")
    );
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URI}/${"D-BLOG"}`,
      {
        //   serverSelectionTimeoutMS: 5000,
        //   socketTimeoutMS: 45000,
        //   maxIdleTimeMS: 60000,
      }
    );
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

export default connect;
