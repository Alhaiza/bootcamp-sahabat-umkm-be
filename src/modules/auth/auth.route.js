/**
 * @file auth.route.js
 * @description Definisi route otentikasi.
 */

const express = require("express");
const authController = require("./auth.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", (req, res, next) => authController.handleRegister(req, res, next));
router.post("/login", (req, res, next) => authController.handleLogin(req, res, next));
router.post("/logout", verifyToken, (req, res, next) => authController.handleLogout(req, res, next));

module.exports = router;

