const { Transaksi, Kelas, User } = require("../models");

/**
 * Controller untuk mengambil daftar seluruh kelas yang telah berhasil didaftarkan/dibeli oleh pengguna aktif (status: 1).
 *
 * @async
 * @function getAllDaftarKelas
 * @param {import('express').Request} req - Express Request dengan req.payload: { id, role }.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON array berisi daftar objek Kelas milik pengguna (HTTP 200).
 */
const getAllDaftarKelas = async (req, res) => {
    try {
        const { id } = req.payload;

        // Validasi keberadaan user di database
        const dataUser = await User.findByPk(id);
        if (!dataUser) {
            return res.status(400).json({
                status: 400,
                message: "Data tidak ditemukan",
            });
        }

        // Query tabel transaksi dengan status lunas (1) berelasi ke model Kelas
        const dataKelas = await Transaksi.findAll({
            where: { id_user: id, status: 1 },
            include: [{ model: Kelas, as: "kelas" }],
        });

        // Ekstraksi entitas kelas dari relasi transaksi
        return res.status(200).json({
            status: 200,
            message: "Data daftar kelas",
            data: dataKelas.map((transaksi) => transaksi.kelas),
        });
    } catch (error) {
        console.error("Kesalahan getAllDaftarKelas:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

module.exports = { getAllDaftarKelas };
