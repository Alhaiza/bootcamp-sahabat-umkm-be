/**
 * @file category.service.js
 * @description Service layer untuk manajemen taksonomi kategori kelas.
 */

const { Kategori } = require("../../../models");
const { NotFoundError, BadRequestError } = require("../../errors/app.error");

class CategoryService {
    async findAllCategories() {
        return await Kategori.findAll();
    }

    async findCategoryById(categoryId) {
        const category = await Kategori.findByPk(categoryId);
        if (!category) {
            throw new NotFoundError("Kategori tidak ditemukan");
        }
        return category;
    }

    async createCategory({ nama_kategori, deskripsi }) {
        if (!nama_kategori || !deskripsi) {
            throw new BadRequestError("Nama kategori dan deskripsi wajib diisi");
        }
        return await Kategori.create({ nama_kategori, deskripsi });
    }

    async updateCategory(categoryId, updateData) {
        const category = await this.findCategoryById(categoryId);
        return await category.update(updateData);
    }

    async deleteCategory(categoryId) {
        const category = await this.findCategoryById(categoryId);
        return await category.destroy();
    }
}

module.exports = new CategoryService();
