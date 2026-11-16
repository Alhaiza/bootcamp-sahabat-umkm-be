const { Transaksi, Kelas } = require("../models");

/**
 * Controller untuk mengambil riwayat transaksi.
 * Jika pengguna merupakan peserta biasa (role: 0), data difilter hanya milik user tersebut.
 * Jika pengguna adalah admin (role: 1), seluruh transaksi sistem ditampilkan.
 *
 * @async
 * @function getAllTransaksi
 * @param {import('express').Request} req - Express Request dengan req.payload: { id, role }.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON array transaksi (HTTP 200).
 */
const getAllTransaksi = async (req, res) => {
    try {
        const { id, role } = req.payload;
        let dataTransaksi;
        if (role == 0) {
            dataTransaksi = await Transaksi.findAll({ where: { id_user: id } });
        } else {
            dataTransaksi = await Transaksi.findAll();
        }

        return res.status(200).json({
            status: 200,
            message: "Data transaksi",
            data: dataTransaksi,
        });
    } catch (error) {
        console.error("Kesalahan getAllTransaksi:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk mengambil detail transaksi tertentu berdasarkan ID parameter.
 *
 * @async
 * @function getTransaksiById
 * @param {import('express').Request} req - Express Request dengan req.params.id dan req.payload: { id, role }.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON objek detail transaksi (HTTP 200) atau 400 jika tidak ditemukan.
 */
const getTransaksiById = async (req, res) => {
    try {
        const { id, role } = req.payload;
        let dataTransaksi;
        if (role == 0) {
            dataTransaksi = await Transaksi.findOne({ where: { id: req.params.id, id_user: id } });
        } else {
            dataTransaksi = await Transaksi.findByPk(req.params.id);
        }

        if (!dataTransaksi) {
            return res.status(400).json({
                status: 400,
                message: "Data tidak ditemukan",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Detail data transaksi",
            data: dataTransaksi,
        });
    } catch (error) {
        console.error("Kesalahan getTransaksiById:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk membuat order/transaksi baru pendaftaran kelas oleh peserta.
 *
 * @async
 * @function createTransaksi
 * @param {import('express').Request} req - Express Request dengan req.payload.id (ID user) dan req.body.id_kelas.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON data transaksi baru (HTTP 201) atau 400 jika kelas tidak valid.
 */
const createTransaksi = async (req, res) => {
    try {
        const { id } = req.payload;
        const { id_kelas } = req.body;
        if (!id_kelas) {
            return res.status(400).json({
                status: 400,
                message: "Data harus diisi",
            });
        }

        const dataKelas = await Kelas.findByPk(id_kelas);
        if (!dataKelas) {
            return res.status(400).json({
                status: 400,
                message: "Data tidak ditemukan",
            });
        }

        const dataTransaksi = await Transaksi.create({
            id_user: id,
            id_kelas,
            total: dataKelas.harga,
        });

        return res.status(201).json({
            status: 201,
            message: "Transaksi anda berhasil dibuat",
            data: dataTransaksi,
        });
    } catch (error) {
        console.error("Kesalahan createTransaksi:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk verifikasi / update status transaksi menjadi lunas (status: 1).
 *
 * @async
 * @function updateTransaksi
 * @param {import('express').Request} req - Express Request dengan req.params.id.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON konfirmasi pembaruan (HTTP 200) atau 400 jika transaksi tidak ditemukan.
 */
const updateTransaksi = async (req, res) => {
    try {
        const dataTransaksi = await Transaksi.findByPk(req.params.id);
        if (!dataTransaksi) {
            return res.status(400).json({
                status: 400,
                message: "Data tidak ditemukan",
            });
        }

        await Transaksi.update(
            { tanggal_pendaftaran: new Date(), status: 1 },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        return res.status(200).json({
            status: 200,
            message: "Transaksi anda berhasil diubah",
        });
    } catch (error) {
        console.error("Kesalahan updateTransaksi:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk menghapus data transaksi berdasarkan ID parameter.
 *
 * @async
 * @function deleteTransaksi
 * @param {import('express').Request} req - Express Request dengan req.params.id.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON konfirmasi penghapusan (HTTP 200) atau 400 jika transaksi tidak ditemukan.
 */
const deleteTransaksi = async (req, res) => {
    try {
        const dataTransaksi = await Transaksi.findByPk(req.params.id);
        if (!dataTransaksi) {
            return res.status(400).json({
                status: 400,
                message: "Data tidak ditemukan",
            });
        }

        await Transaksi.destroy({ where: { id: req.params.id } });
        return res.status(200).json({
            status: 200,
            message: "Transaksi anda berhasil dihapus",
        });
    } catch (error) {
        console.error("Kesalahan deleteTransaksi:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk menghapus seluruh data transaksi (bulk delete).
 *
 * @async
 * @function deleteAllTransaksi
 * @param {import('express').Request} req - Express Request object.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON konfirmasi status (HTTP 200).
 */
const deleteAllTransaksi = async (req, res) => {
    try {
        await Transaksi.destroy({ truncate: true });
        return res.status(200).json({
            status: 200,
            message: "Transaksi anda berhasil dihapus",
        });
    } catch (error) {
        console.error("Kesalahan deleteAllTransaksi:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

module.exports = { getAllTransaksi, getTransaksiById, createTransaksi, updateTransaksi, deleteTransaksi, deleteAllTransaksi };
