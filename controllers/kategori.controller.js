const { Kategori } = require("../models");

/**
 * Controller untuk mengambil seluruh daftar kategori kelas.
 *
 * @async
 * @function getAllKategori
 * @param {import('express').Request} req - Express Request object.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON daftar seluruh kategori (HTTP 200).
 */
const getAllKategori = async (req, res) => {
    try {
        const dataKategori = await Kategori.findAll();

        return res.status(200).json({
            status: 200,
            message: "Data kategori",
            data: dataKategori,
        });
    } catch (error) {
        console.error("Kesalahan getAllKategori:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk mengambil detail kategori tunggal berdasarkan ID parameter.
 *
 * @async
 * @function getKategoriById
 * @param {import('express').Request} req - Express Request dengan req.params.id.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON data kategori (HTTP 200) atau 400 jika tidak ditemukan.
 */
const getKategoriById = async (req, res) => {
    try {
        const dataKategori = await Kategori.findByPk(req.params.id);
        if (!dataKategori) {
            return res.status(400).json({
                status: 400,
                message: "Data tidak ditemukan",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Detail data kategori",
            data: dataKategori,
        });
    } catch (error) {
        console.error("Kesalahan getKategoriById:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk menambahkan kategori kelas baru.
 *
 * @async
 * @function createKategori
 * @param {import('express').Request} req - Express Request dengan req.body: { nama_kategori, deskripsi }.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON kategori yang dibuat (HTTP 201) atau 400 jika field kosong.
 */
const createKategori = async (req, res) => {
    try {
        const { nama_kategori, deskripsi } = req.body;
        if (!nama_kategori || !deskripsi) {
            return res.status(400).json({
                status: 400,
                message: "Data harus diisi",
            });
        }

        const dataKategori = await Kategori.create({ nama_kategori, deskripsi });
        return res.status(201).json({
            status: 201,
            message: "Kategori anda berhasil dibuat",
            data: dataKategori,
        });
    } catch (error) {
        console.error("Kesalahan createKategori:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk memperbarui informasi kategori berdasarkan ID parameter.
 *
 * @async
 * @function updateKategori
 * @param {import('express').Request} req - Express Request dengan req.params.id dan req.body: { nama_kategori, deskripsi }.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON status berhasil (HTTP 200) atau 400 jika tidak ditemukan.
 */
const updateKategori = async (req, res) => {
    try {
        const { nama_kategori, deskripsi } = req.body;
        if (!nama_kategori || !deskripsi) {
            return res.status(400).json({
                status: 400,
                message: "Data harus diisi",
            });
        }

        const dataKategori = await Kategori.findByPk(req.params.id);
        if (!dataKategori) {
            return res.status(400).json({
                status: 400,
                message: "Data tidak ditemukan",
            });
        }

        await Kategori.update(
            { nama_kategori, deskripsi },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        return res.status(200).json({
            status: 200,
            message: "Kategori anda berhasil diubah",
        });
    } catch (error) {
        console.error("Kesalahan updateKategori:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk menghapus kategori kelas berdasarkan ID parameter.
 *
 * @async
 * @function deleteKategori
 * @param {import('express').Request} req - Express Request dengan req.params.id.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON konfirmasi penghapusan (HTTP 200) atau 400 jika ID tidak valid.
 */
const deleteKategori = async (req, res) => {
    try {
        const dataKategori = await Kategori.findByPk(req.params.id);
        if (!dataKategori) {
            return res.status(400).json({
                status: 400,
                message: "Data tidak ditemukan",
            });
        }

        await Kategori.destroy({ where: { id: req.params.id } });
        return res.status(200).json({
            status: 200,
            message: "Kategori anda berhasil dihapus",
        });
    } catch (error) {
        console.error("Kesalahan deleteKategori:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

/**
 * Controller untuk menghapus seluruh kategori kelas (bulk delete).
 *
 * @async
 * @function deleteAllKategori
 * @param {import('express').Request} req - Express Request object.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON status konfirmasi (HTTP 200).
 */
const deleteAllKategori = async (req, res) => {
    try {
        await Kategori.destroy({ truncate: true });
        return res.status(200).json({
            status: 200,
            message: "Kategori anda berhasil dihapus",
        });
    } catch (error) {
        console.error("Kesalahan deleteAllKategori:", error);
        return res.status(500).json({
            status: 500,
            message: "Kesalahan server internal",
        });
    }
};

module.exports = { getAllKategori, getKategoriById, createKategori, updateKategori, deleteKategori, deleteAllKategori };
