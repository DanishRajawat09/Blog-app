import express from "express";
import "dotenv/config";
import cors from "cors";
import connect from "./db/connectDB.js";
import adminRouter from "./routes/admin.route.js";
import blogRouter from "./routes/blog.routes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/errorHandler.js";
const app = express();

// middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler)
// Routes
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/blog", blogRouter);
const PORT = process.env.PORT || 3000;


const startServer = async () => {
  try {
    await connect(); // only first cold start actually connects
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5500}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();

export default app;
