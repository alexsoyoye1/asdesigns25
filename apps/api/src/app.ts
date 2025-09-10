import { env } from "./env";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import pingRouter from "./routes/ping";
import contactRouter from "./routes/contact";
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";
import { authRequired, rolesRequired } from "./middleware/auth";

const app = express();

// security & basics
app.use(helmet());
app.use(cors({ origin: env.WEB_ORIGIN, credentials: true })); // ✅ use explicit origin
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// health & public routes
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/ping", pingRouter);
app.use("/auth", authRouter);
app.use("/contact", contactRouter);

// protected admin routes
app.use(
  "/admin",
  authRequired,
  rolesRequired("admin", "employee"),
  adminRouter
);

export default app;
