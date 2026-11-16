/**
 * @file auth.service.js
 * @description Service layer untuk logika bisnis autentikasi, hashing, dan tokenisasi.
 */

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");
const { BadRequestError, UnauthorizedError } = require("../../errors/app.error");

class AuthService {
    /**
     * Mendaftarkan pengguna baru dengan kata sandi ter-hash secara asynchronous (non-blocking).
     *
     * @param {object} params
     * @param {string} params.name - Nama lengkap pengguna.
     * @param {string} params.email - Alamat email pengguna.
     * @param {string} params.password - Kata sandi plaintext.
     * @param {string} params.confirmPassword - Konfirmasi kata sandi plaintext.
     * @returns {Promise<object>} Objek data user yang terdaftar tanpa atribut password.
     */
    async registerUser({ name, email, password, confirmPassword }) {
        if (!name || !email || !password || !confirmPassword) {
            throw new BadRequestError("Semua data pendaftaran wajib diisi");
        }

        if (password !== confirmPassword) {
            throw new BadRequestError("Password dan konfirmasi password tidak cocok");
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new BadRequestError("Email sudah terdaftar dalam sistem");
        }

        // Hashing asynchronous agar tidak memblokir event loop
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdUser = await User.create({
            nama: name,
            email,
            password: hashedPassword,
        });

        // Hapus password dari objek respons
        const userJson = createdUser.toJSON();
        delete userJson.password;

        return userJson;
    }

    /**
     * Otentikasi login pengguna dan penerbitan JWT access token.
     *
     * @param {object} params
     * @param {string} params.email
     * @param {string} params.password
     * @returns {Promise<{ user: object, token: string }>}
     */
    async authenticateUser({ email, password }) {
        if (!email || !password) {
            throw new BadRequestError("Email dan password wajib diisi");
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new UnauthorizedError("Kredensial login tidak valid");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError("Kredensial login tidak valid");
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const safeUser = user.toJSON();
        delete safeUser.password;

        return { user: safeUser, token };
    }

    /**
     * Invalidation session token helper.
     *
     * @param {number} userId
     * @param {number} role
     * @returns {string} Invalidation token.
     */
    invalidateSession(userId, role) {
        return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: "1s" });
    }
}

module.exports = new AuthService();
