const { Kelas } = require("../models");

/**
 * Controller untuk mengambil seluruh daftar kelas yang tersedia.
 *
 * @async
 * @function getAllKelas
 * @param {import('express').Request} req - Express Request object.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON list seluruh kelas (HTTP 200).
 */
const getAllKelas = async (req, res) => {
    try {
        const dataKelas = await Kelas.findAll();

        return res.status(200).json({
            status: 200,
            message: "Data kelas",
            data: dataKelas,
        });
    } catch (error) {
        console.error("Kesalahan getAllKelas:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk mengambil detail kelas tunggal berdasarkan ID parameter.
 *
 * @async
 * @function getKelasById
 * @param {import('express').Request} req - Express Request dengan req.params.id.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON detail kelas (HTTP 200) atau 400 jika tidak ditemukan.
 */
const getKelasById = async (req, res) => {
    try {
        const dataKelas = await Kelas.findByPk(req.params.id);
        if (!dataKelas) {
            return res.status(400).json({
                status: 400,
                message: "Data tidak ditemukan",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Detail data kelas",
            data: dataKelas,
        });
    } catch (error) {
        console.error("Kesalahan getKelasById:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk membuat kelas baru ke dalam database.
 *
 * @async
 * @function createKelas
 * @param {import('express').Request} req - Express Request dengan req.body: { id_kategori, nama_kelas, deskripsi, harga, nama_pengajar, detail_pengajar, durasi, rating, gambar, video }.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON kelas yang baru dibuat (HTTP 201) atau 400 jika data belum lengkap.
 */
const createKelas = async (req, res) => {
    try {
        const { id_kategori, nama_kelas, deskripsi, harga, nama_pengajar, detail_pengajar, durasi, rating, gambar, video } = req.body;
        if (!id_kategori || !nama_kelas || !deskripsi || !harga || !nama_pengajar || !detail_pengajar || !durasi || !gambar || !video) {
            return res.status(400).json({
                status: 400,
                message: "Data harus diisi",
            });
        }

        const dataKelas = await Kelas.create({ id_kategori, nama_kelas, deskripsi, harga, nama_pengajar, detail_pengajar, durasi, rating, gambar, video });
        return res.status(201).json({
            status: 201,
            message: "Kelas anda berhasil dibuat",
            data: dataKelas,
        });
    } catch (error) {
        console.error("Kesalahan createKelas:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk memperbarui informasi kelas yang ada berdasarkan ID parameter.
 *
 * @async
 * @function updateKelas
 * @param {import('express').Request} req - Express Request dengan req.params.id dan req.body pembaruan.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON status berhasil (HTTP 200) atau 400 jika kelas tidak ditemukan / data tidak lengkap.
 */
const updateKelas = async (req, res) => {
    try {
        const { id_kategori, nama_kelas, deskripsi, harga, nama_pengajar, detail_pengajar, durasi, rating, gambar, video } = req.body;
        if (!id_kategori || !nama_kelas || !deskripsi || !harga || !nama_pengajar || !detail_pengajar || !durasi || !gambar || !video) {
            return res.status(400).json({
                status: 400,
                message: "Data harus diisi",
            });
        }

        const dataKelas = await Kelas.findByPk(req.params.id);
        if (!dataKelas) {
            return res.status(400).json({
                status: 400,
                message: "Data tidak ditemukan",
            });
        }

        await Kelas.update(
            { id_kategori, nama_kelas, deskripsi, harga, nama_pengajar, detail_pengajar, durasi, rating, gambar, video },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        return res.status(200).json({
            status: 200,
            message: "Kelas anda berhasil diubah",
        });
    } catch (error) {
        console.error("Kesalahan updateKelas:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk menghapus data kelas berdasarkan ID parameter.
 *
 * @async
 * @function deleteKelas
 * @param {import('express').Request} req - Express Request dengan req.params.id.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON status konfirmasi penghapusan (HTTP 200) atau 400 jika ID tidak ditemukan.
 */
const deleteKelas = async (req, res) => {
    try {
        const dataKelas = await Kelas.findByPk(req.params.id);
        if (!dataKelas) {
            return res.status(400).json({
                status: 400,
                message: "Data tidak ditemukan",
            });
        }

        await Kelas.destroy({ where: { id: req.params.id } });
        return res.status(200).json({
            status: 200,
            message: "Kelas anda berhasil dihapus",
        });
    } catch (error) {
        console.error("Kesalahan deleteKelas:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk menghapus seluruh data kelas (bulk delete).
 *
 * @async
 * @function deleteAllKelas
 * @param {import('express').Request} req - Express Request object.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON status konfirmasi (HTTP 200).
 */
const deleteAllKelas = async (req, res) => {
    try {
        await Kelas.destroy({ truncate: true });
        return res.status(200).json({
            status: 200,
            message: "Kelas anda berhasil dihapus",
        });
    } catch (error) {
        console.error("Kesalahan deleteAllKelas:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

module.exports = { getAllKelas, getKelasById, createKelas, updateKelas, deleteKelas, deleteAllKelas };
