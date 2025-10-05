import mongoose from "mongoose";

async function connect() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${"D-BLOG"}`, {
     serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 60000,
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

export default connect;
