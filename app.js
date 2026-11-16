const buffer = require("buffer");
if (!buffer.SlowBuffer) {
    buffer.SlowBuffer = buffer.Buffer;
}

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// Validasi fail-early environment variables
const { envConfig } = require("./src/config/env.config");
const { chaosMiddleware } = require("./src/chaos/chaos.middleware");
const { globalErrorHandler } = require("./src/middlewares/error.middleware");
const apiRouter = require("./src/routes/api.router");

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json());

// Chaos Engineering Failure Injection Middleware
app.use(chaosMiddleware);

// Dedicated Healthcheck Endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: 200,
        statusService: "UP",
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        chaosEnabled: envConfig.chaos.isEnabled,
    });
});

// Centralized API Router
app.use(apiRouter);

// Centralized Global Error Handler
app.use(globalErrorHandler);

// Start server
app.listen(envConfig.port, () => {
    console.log(`Server Sahabat-UMKM Backend aktif pada http://localhost:${envConfig.port}`);
    if (envConfig.chaos.isEnabled) {
        console.warn(`[CHAOS ENGINEERING ACTIVE] Mode pengujian resiliensi aktif di lingkungan ${envConfig.nodeEnv}`);
    }
});

module.exports = app;
