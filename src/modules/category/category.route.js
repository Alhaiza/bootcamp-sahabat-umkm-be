/**
 * @file category.route.js
 * @description Definisi route modul kategori dengan proteksi RBAC Admin.
 */

const express = require("express");
const categoryController = require("./category.controller");
const { verifyToken, verifyAdminRole } = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("/", verifyToken, (req, res, next) => categoryController.handleGetAllCategories(req, res, next));
router.get("/:id", verifyToken, (req, res, next) => categoryController.handleGetCategoryById(req, res, next));
router.post("/", verifyToken, verifyAdminRole, (req, res, next) => categoryController.handleCreateCategory(req, res, next));
router.put("/:id", verifyToken, verifyAdminRole, (req, res, next) => categoryController.handleUpdateCategory(req, res, next));
router.delete("/:id", verifyToken, verifyAdminRole, (req, res, next) => categoryController.handleDeleteCategory(req, res, next));

module.exports = router;
