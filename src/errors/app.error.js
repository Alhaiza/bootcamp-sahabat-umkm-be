/**
 * @file app.error.js
 * @description Hirarki standardisasi exception/error berbasis Clean Architecture.
 * Menyediakan representasi terstruktur untuk setiap jenis kegagalan operasional (Operational Errors).
 */

class AppError extends Error {
    /**
     * @param {string} message - Pesan deskripsi kesalahan.
     * @param {number} statusCode - Kode status HTTP (e.g. 400, 401, 403, 404, 500).
     * @param {boolean} isOperational - Penanda apakah error ini diprediksi dalam alur bisnis.
     */
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends AppError {
    constructor(message = "Permintaan tidak valid atau data input tidak lengkap") {
        super(message, 400);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = "Akses ditolak: Token autentikasi tidak valid atau kedaluwarsa") {
        super(message, 401);
    }
}

class ForbiddenError extends AppError {
    constructor(message = "Akses terlarang: Anda tidak memiliki izin untuk sumber daya ini") {
        super(message, 403);
    }
}

class NotFoundError extends AppError {
    constructor(message = "Sumber daya yang diminta tidak ditemukan") {
        super(message, 404);
    }
}

module.exports = {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
};
