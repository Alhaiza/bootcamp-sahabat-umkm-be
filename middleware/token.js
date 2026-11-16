const jwt = require("jsonwebtoken");

/**
 * Middleware untuk memverifikasi keabsahan JSON Web Token (JWT) pada header Authorization.
 * Format header yang diterima: `Bearer <token>`.
 * Menyimpan decoded payload ke `req.payload`.
 *
 * @function verifyToken
 * @param {import('express').Request} req - Express Request object.
 * @param {import('express').Response} res - Express Response object.
 * @param {import('express').NextFunction} next - Express Next function.
 * @returns {void|import('express').Response} Melanjutkan ke middleware berikutnya atau mengembalikan 401/500 jika tidak valid.
 */
const verifyToken = (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({
            status: 401,
            message: "Undefined header",
        });
    }

    const tokenArray = header.split(" ");

    if (tokenArray.length !== 2 || tokenArray[0] !== "Bearer") {
        return res.status(401).json({
            status: 401,
            message: "Invalid token format",
        });
    }

    const token = tokenArray[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.payload = payload;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                status: 401,
                message: "Invalid token",
            });
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                status: 401,
                message: "Token expired",
            });
        } else {
            return res.status(500).json({
                status: 500,
                message: "Internal server error",
            });
        }
    }
};

/**
 * Middleware otorisasi untuk membatasi akses hanya kepada Administrator (role: 1).
 * Harus dipanggil setelah `verifyToken`.
 *
 * @function verifyRoleAdmin
 * @param {import('express').Request} req - Express Request object dengan req.payload.
 * @param {import('express').Response} res - Express Response object.
 * @param {import('express').NextFunction} next - Express Next function.
 * @returns {void|import('express').Response} Lanjut jika admin (1), atau respon 401 jika bukan admin.
 */
const verifyRoleAdmin = (req, res, next) => {
    const { role } = req.payload;
    if (role == 1) {
        next();
    } else {
        return res.status(401).json({
            status: 401,
            message: "Anda tidak bisa mengakses api ini",
        });
    }
};

/**
 * Middleware otorisasi untuk membatasi akses hanya kepada Peserta Kursus (role: 0).
 * Harus dipanggil setelah `verifyToken`.
 *
 * @function verifyRoleUser
 * @param {import('express').Request} req - Express Request object dengan req.payload.
 * @param {import('express').Response} res - Express Response object.
 * @param {import('express').NextFunction} next - Express Next function.
 * @returns {void|import('express').Response} Lanjut jika user biasa (0), atau respon 401 jika bukan.
 */
const verifyRoleUser = (req, res, next) => {
    const { role } = req.payload;
    if (role == 0) {
        next();
    } else {
        return res.status(401).json({
            status: 401,
            message: "Anda tidak bisa mengakses api ini",
        });
    }
};

module.exports = { verifyRoleAdmin, verifyRoleUser, verifyToken };
