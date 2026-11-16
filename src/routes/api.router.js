/**
 * @file api.router.js
 * @description Centralized Express API Router yang mengintegrasikan seluruh modul domain.
 */

const express = require("express");
const authRoute = require("../modules/auth/auth.route");
const courseRoute = require("../modules/course/course.route");
const categoryRoute = require("../modules/category/category.route");
const userRoute = require("../modules/user/user.route");
const transactionRoute = require("../modules/transaction/transaction.route");
const enrollmentRoute = require("../modules/enrollment/enrollment.route");

const apiRouter = express.Router();

// Root Gateway Health / Welcome
apiRouter.get("/", (req, res) => {
    res.status(200).json({
        status: 200,
        success: true,
        message: "Selamat Datang di API Backend Sahabat-UMKM Enterprise Gateway",
        version: "2.0.0",
    });
});

// Modular Domain Endpoints
apiRouter.use("/", authRoute);
apiRouter.use("/kelas", courseRoute);
apiRouter.use("/kategori", categoryRoute);
apiRouter.use("/user", userRoute);
apiRouter.use("/transaksi", transactionRoute);
apiRouter.use("/daftar-kelas", enrollmentRoute);

module.exports = apiRouter;

