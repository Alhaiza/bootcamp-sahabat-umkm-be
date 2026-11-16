/**
 * @file category.controller.js
 * @description Controller untuk memproses request kategori.
 */

const categoryService = require("./category.service");
const { HTTP_STATUS } = require("../../constants/app.constants");

class CategoryController {
    async handleGetAllCategories(req, res, next) {
        try {
            const categories = await categoryService.findAllCategories();
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Data kategori berhasil diambil",
                data: categories,
            });
        } catch (error) {
            next(error);
        }
    }

    async handleGetCategoryById(req, res, next) {
        try {
            const category = await categoryService.findCategoryById(req.params.id);
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Detail data kategori",
                data: category,
            });
        } catch (error) {
            next(error);
        }
    }

    async handleCreateCategory(req, res, next) {
        try {
            const category = await categoryService.createCategory(req.body);
            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Kategori berhasil dibuat",
                data: category,
            });
        } catch (error) {
            next(error);
        }
    }

    async handleUpdateCategory(req, res, next) {
        try {
            await categoryService.updateCategory(req.params.id, req.body);
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Kategori berhasil diubah",
            });
        } catch (error) {
            next(error);
        }
    }

    async handleDeleteCategory(req, res, next) {
        try {
            await categoryService.deleteCategory(req.params.id);
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Kategori berhasil dihapus",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController();
