// import * as dotenv from 'dotenv'
// dotenv.config()
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";
import fs from "fs/promises";
import { VerifyRoute } from "./routes/verify.js";
import { DigestRoutes } from "./routes/digest.js";
import { router as contactRoutes } from "./routes/contact.js";
import { router as imageRoutes } from "./routes/image.js";
import { router as userRoutes } from "./routes/users.js";
const PORT = process.env.PORT || 5000;

const app = express();
const swaggerDocument = JSON.parse(
  await fs.readFile(new URL("./swagger.json", import.meta.url))
);

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Server running successfully");
});

app.use("/api/verify", VerifyRoute);
app.use("/api/user/", userRoutes);
app.use("/api/image/", imageRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/contact", contactRoutes);
app.use("/api/digest", DigestRoutes);
mongoose.set("strictQuery", true);
mongoose
  .connect(
    `mongodb+srv://user1:030602@neelmani.0rkjf.mongodb.net/graphicalpassword`
  )
  .then(() => {
    app.listen(PORT);
    console.log("Server running...");
    console.log(PORT);
  })
  .catch((err) => console.log(err));
