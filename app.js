const buffer = require("buffer");
if (!buffer.SlowBuffer) {
    buffer.SlowBuffer = buffer.Buffer;
}

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const routes = require("./routes");
const { chaosMiddleware } = require("./src/chaos/chaos.middleware");
const { globalErrorHandler } = require("./src/middlewares/error.middleware");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware umum
app.use(cors());
app.use(express.json());

// Injeksi Chaos Engineering Middleware (Hanya aktif bila CHAOS_ENABLED='true' dan pre-production)
app.use(chaosMiddleware);

// Endpoint Healthcheck terisolasi
app.get("/health", (req, res) => {
    res.status(200).json({
        status: 200,
        statusService: "UP",
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
    });
});

// Routing aplikasi utama
app.use(routes);

// Centralized Global Error Handler Middleware
app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`Server Sahabat-UMKM Backend aktif pada http://localhost:${PORT}`);
    if (process.env.CHAOS_ENABLED === "true") {
        console.warn(`[CHAOS ENGINEERING ACTIVE] Mode pengujian resiliensi aktif di lingkungan ${process.env.NODE_ENV || "development"}`);
    }
});

module.exports = app;
