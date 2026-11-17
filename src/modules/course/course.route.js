/**
 * @file course.route.js
 * @description Definisi route modul kelas dengan proteksi RBAC Admin untuk operasi mutasi data
 * dan ekstraksi token opsional pada GET /:id untuk otorisasi akses materi video.
 */

const express = require("express");
const jwt = require("jsonwebtoken");
const courseController = require("./course.controller");
const { verifyToken, verifyAdminRole } = require("../../middlewares/auth.middleware");

const router = express.Router();

/**
 * Middleware untuk mengekstrak token jika tersedia di header tanpa melempar error jika anonim (Optional Token).
 */
const optionalTokenExtraction = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.payload = decoded;
        } catch (err) {
            // Token tidak valid/kedaluwarsa diabaikan agar tetap bisa melihat preview katalog
            req.payload = null;
        }
    }
    next();
};

router.get("/", (req, res, next) => courseController.handleGetAllCourses(req, res, next));
router.get("/:id", optionalTokenExtraction, (req, res, next) => courseController.handleGetCourseById(req, res, next));
router.post("/", verifyToken, verifyAdminRole, (req, res, next) => courseController.handleCreateCourse(req, res, next));
router.put("/:id", verifyToken, verifyAdminRole, (req, res, next) => courseController.handleUpdateCourse(req, res, next));
router.delete("/:id", verifyToken, verifyAdminRole, (req, res, next) => courseController.handleDeleteCourse(req, res, next));

module.exports = router;
