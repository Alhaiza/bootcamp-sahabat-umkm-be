const { User } = require("../models");
const bcrypt = require("bcrypt");

/**
 * Controller untuk mengambil data profil user yang sedang aktif berdasarkan decoded JWT payload.
 *
 * @async
 * @function getUserByToken
 * @param {import('express').Request} req - Express Request dengan req.payload: { id, role }.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON data profil user (HTTP 200) atau 400 jika user tidak ditemukan.
 */
const getUserByToken = async (req, res) => {
    try {
        const { id } = req.payload;
        const dataUser = await User.findByPk(id);
        if (!dataUser) {
            return res.status(400).json({
                status: 400,
                message: "Data tidak ditemukan",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Data user",
            data: dataUser,
        });
    } catch (error) {
        console.error("Kesalahan getUserByToken:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal selama ambil data user",
        });
    }
};

/**
 * Controller untuk memperbarui informasi nama atau kata sandi profil pengguna aktif.
 *
 * @async
 * @function updateUserByToken
 * @param {import('express').Request} req - Express Request dengan req.payload { id } dan req.body: { nama, password_lama, password_baru }.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON respons status update (HTTP 200) atau pesan error (400/500).
 */
const updateUserByToken = async (req, res) => {
    try {
        const { id } = req.payload;
        const { nama, password_lama, password_baru } = req.body;
        if (!nama) {
            return res.status(400).json({
                status: 400,
                message: "Data harus diisi",
            });
        }

        const dataUser = await User.findByPk(id);
        if (!dataUser) {
            return res.status(400).json({
                status: 400,
                message: "Data tidak ditemukan",
            });
        }

        let password = dataUser.password;

        // Jika user mengajukan perubahan kata sandi, verifikasi kata sandi lama
        if (password_lama && password_baru) {
            const matchPassword = bcrypt.compareSync(password_lama, dataUser.password);
            if (!matchPassword) {
                return res.status(400).json({
                    status: 400,
                    message: "Maaf Password anda salah",
                });
            }

            password = bcrypt.hashSync(password_baru, 10);
        }

        await User.update(
            { nama, password },
            {
                where: {
                    id,
                },
            }
        );
        return res.status(200).json({
            status: 200,
            message: "User berhasil diubah",
        });
    } catch (error) {
        console.error("Kesalahan updateUserByToken:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk mengambil seluruh daftar pengguna bertipe peserta (role: 0). Khusus admin.
 *
 * @async
 * @function getAllUser
 * @param {import('express').Request} req - Express Request object.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON array data user siswa (HTTP 200).
 */
const getAllUser = async (req, res) => {
    try {
        const dataUser = await User.findAll({
            where: {
                role: 0,
            },
        });
        return res.status(200).json({
            status: 200,
            message: "Data user",
            data: dataUser,
        });
    } catch (error) {
        console.error("Kesalahan getAllUser:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal selama ambil data user",
            error: error.message,
        });
    }
};

module.exports = { getUserByToken, updateUserByToken, getAllUser };
