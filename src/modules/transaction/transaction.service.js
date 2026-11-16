/**
 * @file transaction.service.js
 * @description Service layer untuk transaksi pemesanan dan aktivasi kelas.
 */

const { Transaksi, Kelas } = require("../../../models");
const { NotFoundError, BadRequestError } = require("../../errors/app.error");
const { USER_ROLES, TRANSACTION_STATUS } = require("../../constants/app.constants");

class TransactionService {
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

    async createTransaction(userId, courseId) {
        if (!courseId) {
            throw new BadRequestError("ID kelas wajib diisi");
        }

        const course = await Kelas.findByPk(courseId);
        if (!course) {
            throw new NotFoundError("Kelas yang dipilih tidak ditemukan");
        }

        return await Transaksi.create({
            id_user: userId,
            id_kelas: courseId,
            total: course.harga,
            status: TRANSACTION_STATUS.PENDING,
        });
    }

    async verifyTransaction(transactionId) {
        const transaction = await Transaksi.findByPk(transactionId);
        if (!transaction) {
            throw new NotFoundError("Transaksi tidak ditemukan");
        }

        return await transaction.update({
            tanggal_pendaftaran: new Date(),
            status: TRANSACTION_STATUS.SUCCESS,
        });
    }
}

module.exports = new TransactionService();
