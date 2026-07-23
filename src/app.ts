import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import healthRoutes from "./routes/health.routes";
import topicRoutes from "./routes/topic.routes";
import problemRoutes from "./routes/problem.routes";
import submissionRoutes from "./routes/submission.routes";
import masteryRoutes from "./routes/mastery.routes";

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

export default app;