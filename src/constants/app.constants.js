/**
 * @file app.constants.js
 * @description Konstanta global aplikasi backend Sahabat-UMKM.
 * Mengikuti konvensi SCREAMING_SNAKE_CASE untuk konstanta imutabel dan enumerasi.
 */

const USER_ROLES = Object.freeze({
    ADMIN: 1,
    STUDENT: 0,
});

const HTTP_STATUS = Object.freeze({
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
});

const TRANSACTION_STATUS = Object.freeze({
    PENDING: 0,
    SUCCESS: 1,
});

module.exports = {
    USER_ROLES,
    HTTP_STATUS,
    TRANSACTION_STATUS,
};

