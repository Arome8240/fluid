import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { feeBumpHandler } from "./handlers/feeBump";
import { loadConfig } from "./config";
import { notFoundHandler, globalErrorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());

const config = loadConfig();

// Configure rate limiter
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: { error: "Too many requests from this IP, please try again later.", code: "RATE_LIMITED" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/fee-bump", limiter, (req: Request, res: Response, next: NextFunction) => {
  feeBumpHandler(req, res, next, config);
});

// 404 - must come after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Fluid server running on http://0.0.0.0:${PORT}`);
  console.log(`Fee payer: ${config.feePayerPublicKey}`);
});
