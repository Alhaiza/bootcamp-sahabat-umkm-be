/**
 * @file auth.controller.js
 * @description Controller untuk memproses request HTTP autentikasi.
 */

const authService = require("./auth.service");
const { HTTP_STATUS } = require("../../constants/app.constants");

class AuthController {
    /**
     * Handler registrasi user baru.
     */
    async handleRegister(req, res, next) {
        try {
            const { nama, email, password, konfirmasi_password } = req.body;
            const user = await authService.registerUser({
                name: nama,
                email,
                password,
                confirmPassword: konfirmasi_password,
            });

            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Registrasi berhasil",
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Handler login pengguna.
     */
    async handleLogin(req, res, next) {
        try {
            const { email, password } = req.body;
            const { user, token } = await authService.authenticateUser({ email, password });

            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Login berhasil",
                data: user,
                token,
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Handler logout pengguna.
     */
    async handleLogout(req, res, next) {
        try {
            const { id, role } = req.payload;
            const invalidatedToken = authService.invalidateSession(id, role);

            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Logout berhasil",
                invalidatedToken,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();

