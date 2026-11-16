/**
 * @file env.config.js
 * @description Validasi strict environment variables saat server startup (Fail-Early Principle).
 * Mencegah server berjalan jika konfigurasi kritis tidak terdefinisi.
 */

const dotenv = require("dotenv");
dotenv.config();

const requiredEnvVariables = [
    "JWT_SECRET",
];

const missingVariables = requiredEnvVariables.filter((envVar) => !process.env[envVar]);

if (missingVariables.length > 0) {
    console.error(`[CRITICAL] Variabel lingkungan wajib tidak ditemukan: ${missingVariables.join(", ")}`);
    console.error("[CRITICAL] Server dihentikan untuk mencegah kegagalan runtime (Fail-Early).");
    process.exit(1);
}

const envConfig = Object.freeze({
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    jwtSecret: process.env.JWT_SECRET,
    db: Object.freeze({
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_DATABASE || "sahabat_umkm",
        host: process.env.DB_HOST || "127.0.0.1",
        dialect: process.env.DB_DIALECT || "mysql",
    }),
    chaos: Object.freeze({
        isEnabled: process.env.CHAOS_ENABLED === "true" && process.env.NODE_ENV !== "production",
        faultRate: parseFloat(process.env.CHAOS_FAULT_RATE || "0.15"),
        minDelayMs: parseInt(process.env.CHAOS_MIN_DELAY_MS || "500", 10),
        maxDelayMs: parseInt(process.env.CHAOS_MAX_DELAY_MS || "2000", 10),
        mode: process.env.CHAOS_MODE || "all",
    }),
});

module.exports = { envConfig };
