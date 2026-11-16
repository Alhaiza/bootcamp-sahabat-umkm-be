/**
 * @file error.middleware.js
 * @description Global Centralized Error Handler Middleware untuk Express.
 * Mencegah kebocoran stack trace ke lingkungan publik dan memastikan format JSON error seragam.
 */

const { AppError } = require("../errors/app.error");

/**
 * Global Error Handling Middleware Express.
 *
 * @param {Error|AppError} err - Objek error yang ditangkap oleh middleware/controller.
 * @param {import('express').Request} req - Express Request object.
 * @param {import('express').Response} res - Express Response object.
 * @param {import('express').NextFunction} next - Express Next function.
 * @returns {import('express').Response} Respons HTTP JSON terstruktur.
 */
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Terjadi kesalahan internal pada server";

    // Tangani error validasi spesifik Sequelize
    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
        statusCode = 400;
        message = err.errors.map((e) => e.message).join(", ");
    }

    // Catat log error ke console/transport
    console.error(`[ERROR] [${req.method} ${req.url}] :`, err);

    return res.status(statusCode).json({
        status: statusCode,
        success: false,
        message,
        // Sertakan stack trace HANYA di lingkungan development
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

module.exports = { globalErrorHandler };
