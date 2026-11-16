/**
 * @file transaction.controller.js
 * @description Controller untuk memproses pemesanan dan verifikasi transaksi.
 */

const transactionService = require("./transaction.service");
const { HTTP_STATUS } = require("../../constants/app.constants");

class TransactionController {
    async handleGetAllTransactions(req, res, next) {
        try {
            const transactions = await transactionService.findTransactionsByUser(req.payload.id, req.payload.role);
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Data transaksi berhasil diambil",
                data: transactions,
            });
        } catch (error) {
            next(error);
        }
    }

    async handleGetTransactionById(req, res, next) {
        try {
            const transaction = await transactionService.findTransactionById(req.params.id, req.payload.id, req.payload.role);
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Detail transaksi",
                data: transaction,
            });
        } catch (error) {
            next(error);
        }
    }

    async handleCreateTransaction(req, res, next) {
        try {
            const transaction = await transactionService.createTransaction(req.payload.id, req.body.id_kelas);
            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Transaksi berhasil dibuat",
                data: transaction,
            });
        } catch (error) {
            next(error);
        }
    }

    async handleVerifyTransaction(req, res, next) {
        try {
            await transactionService.verifyTransaction(req.params.id);
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Transaksi berhasil diverifikasi dan diaktifkan",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TransactionController();
