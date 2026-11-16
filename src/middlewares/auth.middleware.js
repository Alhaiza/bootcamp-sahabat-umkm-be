/**
 * @file auth.middleware.js
 * @description Middleware verifikasi JWT Bearer Token dan Role-Based Access Control (RBAC).
 */

const jwt = require("jsonwebtoken");
const { UnauthorizedError, ForbiddenError } = require("../errors/app.error");
const { USER_ROLES } = require("../constants/app.constants");

/**
 * Middleware untuk memverifikasi keabsahan JWT pada Authorization header.
 *
 * @param {import('express').Request} req - Express Request object.
 * @param {import('express').Response} res - Express Response object.
 * @param {import('express').NextFunction} next - Express Next function.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(new UnauthorizedError("Header Authorization tidak ditemukan"));
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return next(new UnauthorizedError("Format token harus 'Bearer <token>'"));
    }

    const token = tokenParts[1];

    try {
        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
        req.payload = decodedPayload;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new UnauthorizedError("Token telah kedaluwarsa"));
        }
        return next(new UnauthorizedError("Token tidak valid"));
    }
};

/**
 * Middleware otorisasi khusus Administrator (role = 1).
 */
const verifyAdminRole = (req, res, next) => {
    if (!req.payload || req.payload.role !== USER_ROLES.ADMIN) {
        return next(new ForbiddenError("Akses ditolak: Hanya administrator yang diizinkan"));
    }
    next();
};

/**
 * Middleware otorisasi khusus Siswa / Pelaku UMKM (role = 0).
 */
const verifyStudentRole = (req, res, next) => {
    if (!req.payload || req.payload.role !== USER_ROLES.STUDENT) {
        return next(new ForbiddenError("Akses ditolak: Hanya peserta yang diizinkan"));
    }
    next();
};

module.exports = {
    verifyToken,
    verifyAdminRole,
    verifyStudentRole,
};
