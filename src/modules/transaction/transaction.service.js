/**
 * @file transaction.service.js
 * @description Service layer untuk transaksi pemesanan dan aktivasi kelas.
 * Dilengkapi dengan Surgical Guards untuk integritas data transaksi dan idempotensi.
 */

const { Transaksi, Kelas } = require("../../models");
const { NotFoundError, BadRequestError } = require("../../errors/app.error");
const { USER_ROLES, TRANSACTION_STATUS } = require("../../constants/app.constants");

class TransactionService {
    /**
     * Mengambil daftar transaksi berdasarkan peran pengguna.
     * Siswa hanya dapat melihat transaksi miliknya sendiri, sedangkan Admin melihat seluruh transaksi.
     */
    async findTransactionsByUser(userId, role) {
        if (role === USER_ROLES.STUDENT) {
            return await Transaksi.findAll({
                where: { id_user: userId },
                include: [{ model: Kelas, as: "kelas" }],
            });
        }
        return await Transaksi.findAll({
            include: [{ model: Kelas, as: "kelas" }],
        });
    }

    /**
     * Mengambil detail transaksi berdasarkan ID dengan pengecekan kepemilikan data.
     */
    async findTransactionById(transactionId, userId, role) {
        let transaction;
        if (role === USER_ROLES.STUDENT) {
            transaction = await Transaksi.findOne({
                where: { id: transactionId, id_user: userId },
                include: [{ model: Kelas, as: "kelas" }],
            });
        } else {
            transaction = await Transaksi.findByPk(transactionId, {
                include: [{ model: Kelas, as: "kelas" }],
            });
        }

        if (!transaction) {
            throw new NotFoundError("Transaksi tidak ditemukan");
        }
        return transaction;
    }

    /**
     * Membuat transaksi baru untuk pendaftaran kelas.
     * Menerapkan Surgical Guard 1 (Anti-Double Purchase) & Surgical Guard 2 (Idempotent Pending Check).
     */
    async createTransaction(userId, courseId) {
        if (!courseId) {
            throw new BadRequestError("ID kelas wajib diisi");
        }

        const course = await Kelas.findByPk(courseId);
        if (!course) {
            throw new NotFoundError("Kelas yang dipilih tidak ditemukan");
        }

        // SURGICAL GUARD 1: Pencegahan Multiple Active Purchases
        // Tolak request jika pengguna sudah memiliki record transaksi berstatus sukses untuk kelas ini.
        const existingActiveEnrollment = await Transaksi.findOne({
            where: {
                id_user: userId,
                id_kelas: courseId,
                status: TRANSACTION_STATUS.SUCCESS,
            },
        });
        if (existingActiveEnrollment) {
            throw new BadRequestError("Anda sudah terdaftar aktif pada kelas ini");
        }

        // SURGICAL GUARD 2: Idempotent Pending Check
        // Jika sudah ada invoice pending yang belum diselesaikan, kembalikan invoice tersebut tanpa membuat duplikat.
        const pendingTransaction = await Transaksi.findOne({
            where: {
                id_user: userId,
                id_kelas: courseId,
                status: TRANSACTION_STATUS.PENDING,
            },
        });
        if (pendingTransaction) {
            return pendingTransaction;
        }

        return await Transaksi.create({
            id_user: userId,
            id_kelas: courseId,
            total: course.harga,
            status: TRANSACTION_STATUS.PENDING,
        });
    }

    /**
     * Memverifikasi transaksi pendaftaran (Admin only).
     * Menerapkan Surgical Guard 3 (Anti-Overwrite Timestamp).
     */
    async verifyTransaction(transactionId) {
        const transaction = await Transaksi.findByPk(transactionId);
        if (!transaction) {
            throw new NotFoundError("Transaksi tidak ditemukan");
        }

        // SURGICAL GUARD 3: Cegah Penimpaan Tanggal Pendaftaran
        // Jika transaksi telah berstatus SUCCESS, kembalikan record tanpa memutakhirkan tanggal_pendaftaran.
        if (transaction.status === TRANSACTION_STATUS.SUCCESS) {
            return transaction;
        }

        return await transaction.update({
            tanggal_pendaftaran: new Date(),
            status: TRANSACTION_STATUS.SUCCESS,
        });
    }
}

module.exports = new TransactionService();
