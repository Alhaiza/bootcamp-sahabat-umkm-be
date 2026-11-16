/**
 * @file transaction.route.js
 * @description Definisi route modul transaksi.
 */

const express = require("express");
const transactionController = require("./transaction.controller");
const { verifyToken, verifyAdminRole } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, (req, res, next) => transactionController.handleGetAllTransactions(req, res, next));
router.get("/:id", verifyToken, (req, res, next) => transactionController.handleGetTransactionById(req, res, next));
router.post("/", verifyToken, (req, res, next) => transactionController.handleCreateTransaction(req, res, next));
router.put("/:id", verifyToken, verifyAdminRole, (req, res, next) => transactionController.handleVerifyTransaction(req, res, next));

module.exports = router;
