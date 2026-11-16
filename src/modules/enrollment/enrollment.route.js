/**
 * @file enrollment.route.js
 * @description Definisi route modul enrollment (daftar-kelas).
 */

const express = require("express");
const enrollmentController = require("./enrollment.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, (req, res, next) => enrollmentController.handleGetEnrolledCourses(req, res, next));

module.exports = router;

