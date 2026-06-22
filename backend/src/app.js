import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { router as loginRouter } from "./routes/loginRoute.js";
import { router as adminRouter } from "./routes/adminRoute.js";
import { router as auctionRoute } from "./routes/auctionRoute.js";
import { router as userRoute } from "./routes/userRoute.js";
import { router as notificationRouter } from "./routes/notificationRoute.js";
import { router as favoriteRouter } from "./routes/favoriteRoute.js";

import { authMiddleware } from "./middleware/authMiddleware.js";
import { authorize } from "./middleware/authorize.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads")),
);

app.get("/", (req, res) => {
  res.send("Server läuft");
});

app.use("/login", loginRouter);

app.use("/admin", authMiddleware, authorize(), adminRouter);

app.use("/user", authMiddleware, userRoute);
app.use("/auctions", authMiddleware, auctionRoute);
app.use("/notifications", authMiddleware, notificationRouter);
app.use("/favorites", authMiddleware, favoriteRouter);
