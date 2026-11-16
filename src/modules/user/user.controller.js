/**
 * @file user.controller.js
 * @description Controller untuk memproses request pengguna.
 */

const userService = require("./user.service");
const { HTTP_STATUS } = require("../../constants/app.constants");

class UserController {
    async handleGetUserProfile(req, res, next) {
        try {
            const user = await userService.findUserById(req.payload.id);
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Data profil user",
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }

    async handleUpdateUserProfile(req, res, next) {
        try {
            const { nama, password_lama, password_baru } = req.body;
            const result = await userService.updateUserProfile(req.payload.id, {
                name: nama,
                oldPassword: password_lama,
                newPassword: password_baru,
            });
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    }

    async handleGetAllStudents(req, res, next) {
        try {
            const students = await userService.findAllStudents();
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Daftar pengguna peserta",
                data: students,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();

