/**
 * @file user.route.js
 * @description Definisi route modul pengguna.
 */

const express = require("express");
const userController = require("./user.controller");
const { verifyToken, verifyAdminRole } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/profile", verifyToken, (req, res, next) => userController.handleGetUserProfile(req, res, next));
router.put("/profile", verifyToken, (req, res, next) => userController.handleUpdateUserProfile(req, res, next));
router.get("/all", verifyToken, verifyAdminRole, (req, res, next) => userController.handleGetAllStudents(req, res, next));

// Backward compatibility untuk route lama /user
router.get("/", verifyToken, (req, res, next) => userController.handleGetUserProfile(req, res, next));
router.put("/", verifyToken, (req, res, next) => userController.handleUpdateUserProfile(req, res, next));

module.exports = router;
