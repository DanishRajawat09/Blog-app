import express from "express";
import "dotenv/config";
import cors from "cors";
import connect from "./db/connectDB.js";
import adminRouter from "./routes/admin.route.js";
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/admin", adminRouter);

const PORT = process.env.PORT || 3000;

await connect()
  .then(() => {
    console.log("DataBase Connected");
    app.listen(PORT, () => {
      console.log(`server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });

export default app;
