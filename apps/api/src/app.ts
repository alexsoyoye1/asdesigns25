import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import pingRouter from "./routes/ping";
import contactRouter from "./routes/contact";

const app = express();
app.use(helmet());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/ping", pingRouter);
app.use("/contact", contactRouter);
export default app;
