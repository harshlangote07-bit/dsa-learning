import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/error.middleware";

import healthRoutes from "./routes/health.routes";
import topicRoutes from "./routes/topic.routes";
import problemRoutes from "./routes/problem.routes";
import submissionRoutes from "./routes/submission.routes";
import masteryRoutes from "./routes/mastery.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import recommendationRoutes from "./routes/recommendation.routes";
import compilerRoutes from "./routes/compiler.routes";


const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/health", healthRoutes);
app.use("/topics", topicRoutes);
app.use("/problems", problemRoutes);
app.use("/submissions", submissionRoutes);
app.use("/", masteryRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/recommendations", recommendationRoutes);
app.use("/compiler", compilerRoutes);

app.use(errorHandler);

export default app;