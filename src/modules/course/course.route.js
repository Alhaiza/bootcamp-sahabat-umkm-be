/**
 * @file course.route.js
 * @description Definisi route modul kelas dengan proteksi RBAC Admin untuk operasi mutasi data.
 */

const express = require("express");
const courseController = require("./course.controller");
const { verifyToken, verifyAdminRole } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, (req, res, next) => courseController.handleGetAllCourses(req, res, next));
router.get("/:id", verifyToken, (req, res, next) => courseController.handleGetCourseById(req, res, next));
router.post("/", verifyToken, verifyAdminRole, (req, res, next) => courseController.handleCreateCourse(req, res, next));
router.put("/:id", verifyToken, verifyAdminRole, (req, res, next) => courseController.handleUpdateCourse(req, res, next));
router.delete("/:id", verifyToken, verifyAdminRole, (req, res, next) => courseController.handleDeleteCourse(req, res, next));

module.exports = router;

