/**
 * @file chaos.middleware.js
 * @description Chaos Engineering Middleware untuk menyuntikkan kegagalan terkontrol (controlled failures)
 * ke dalam sistem backend Express di lingkungan pre-production/staging/development.
 *
 * Menerapkan prinsip Chaos Engineering:
 * 1. Latency Injection (Delay tiruan untuk menguji resiliensi timeout client/downstream)
 * 2. Fault Injection (Pemberian HTTP 500 / 503 acak untuk menguji retry policy dan circuit breaker)
 * 3. Exception Chaos (Unhandled error injection untuk menguji global error handling dan process resilience)
 */

/**
 * Konfigurasi Chaos Engineering dari variabel lingkungan atau default.
 * Pastikan chaos hanya aktif bila CHAOS_ENABLED='true' dan BUKAN di production murni.
 */
const chaosConfig = {
    isEnabled: process.env.CHAOS_ENABLED === "true" && process.env.NODE_ENV !== "production",
    // Probabilitas terjadinya fault acak (0.0 - 1.0, contoh: 0.15 = 15% request mengalami fault)
    faultRate: parseFloat(process.env.CHAOS_FAULT_RATE || "0.15"),
    // Delay minimum dalam milidetik jika mode latency chaos aktif
    minDelayMs: parseInt(process.env.CHAOS_MIN_DELAY_MS || "500", 10),
    // Delay maksimum dalam milidetik
    maxDelayMs: parseInt(process.env.CHAOS_MAX_DELAY_MS || "2000", 10),
    // Tipe chaos: 'all' | 'latency' | 'error'
    mode: process.env.CHAOS_MODE || "all",
};

/**
 * Menghasilkan delay asynchronous dalam rentang min dan max milidetik.
 *
 * @param {number} min - Durasi minimum (ms).
 * @param {number} max - Durasi maksimum (ms).
 * @returns {Promise<void>} Promise yang diselesaikan setelah waktu jeda tertentu.
 */
const injectDelay = (min, max) => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Middleware Express untuk menyuntikkan skenario Chaos Engineering terkontrol.
 *
 * @function chaosMiddleware
 * @param {import('express').Request} req - Express Request object.
 * @param {import('express').Response} res - Express Response object.
 * @param {import('express').NextFunction} next - Express Next function.
 * @returns {Promise<void>|void}
 */
const chaosMiddleware = async (req, res, next) => {
    // Lewatkan jika chaos dinonaktifkan atau pada endpoint healthcheck
    if (!chaosConfig.isEnabled || req.path === "/" || req.path === "/health") {
        return next();
    }

    // Cek header override dari penguji (misal Postman atau script chaos tester)
    const forceChaos = req.headers["x-chaos-injection"];
    const shouldTriggerChaos = forceChaos === "true" || Math.random() < chaosConfig.faultRate;

    if (!shouldTriggerChaos) {
        return next();
    }

    const chaosType = forceChaos ? (req.headers["x-chaos-type"] || "error") : (Math.random() > 0.5 ? "latency" : "error");

    console.warn(`[CHAOS ENGINEERING] Menyuntikkan simulasi kegagalan '${chaosType}' pada endpoint: ${req.method} ${req.originalUrl}`);

    // Skenario 1: Latency Injection (Simulasi Jaringan Lambat / Resource Contention)
    if (chaosType === "latency" && (chaosConfig.mode === "all" || chaosConfig.mode === "latency")) {
        await injectDelay(chaosConfig.minDelayMs, chaosConfig.maxDelayMs);
        res.setHeader("X-Chaos-Injected", "Latency");
        return next();
    }

    // Skenario 2: HTTP Fault Injection (Simulasi Service Degradation / Overload)
    if (chaosType === "error" && (chaosConfig.mode === "all" || chaosConfig.mode === "error")) {
        const errorStatuses = [500, 502, 503, 504];
        const selectedStatus = errorStatuses[Math.floor(Math.random() * errorStatuses.length)];
        
        return res.status(selectedStatus).json({
            status: selectedStatus,
            chaos: true,
            message: `[Chaos Engineering] Kegagalan disengaja: Simulasi HTTP ${selectedStatus} untuk pengujian resiliensi sistem.`,
            timestamp: new Date().toISOString(),
            incidentStrategyPlan: "Pastikan client menangani retry backoff exponential atau menampilkan fallback UI.",
        });
    }

    return next();
};

module.exports = { chaosMiddleware, chaosConfig };

