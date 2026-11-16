/**
 * @file user.service.js
 * @description Service layer untuk profil dan manajemen data pengguna.
 */

const bcrypt = require("bcrypt");
const { User } = require("../../../models");
const { NotFoundError, BadRequestError } = require("../../errors/app.error");
const { USER_ROLES } = require("../../constants/app.constants");

class UserService {
    async findUserById(userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new NotFoundError("Pengguna tidak ditemukan");
        }
        const userJson = user.toJSON();
        delete userJson.password;
        return userJson;
    }

    async updateUserProfile(userId, { name, oldPassword, newPassword }) {
        if (!name) {
            throw new BadRequestError("Nama wajib diisi");
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new NotFoundError("Pengguna tidak ditemukan");
        }

        let updatedPassword = user.password;

        if (oldPassword && newPassword) {
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                throw new BadRequestError("Kata sandi lama tidak sesuai");
            }
            updatedPassword = await bcrypt.hash(newPassword, 10);
        }

        await user.update({
            nama: name,
            password: updatedPassword,
        });

        return { message: "Profil berhasil diperbarui" };
    }

    async findAllStudents() {
        return await User.findAll({
            where: { role: USER_ROLES.STUDENT },
            attributes: { exclude: ["password"] },
        });
    }
}

module.exports = new UserService();
