/**
 * @file course.service.js
 * @description Service layer untuk katalog modul kelas pembelajaran UMKM.
 */

const { Kelas } = require("../../../models");
const { NotFoundError, BadRequestError } = require("../../errors/app.error");

class CourseService {
    /**
     * Mengambil daftar seluruh kelas.
     */
    async findAllCourses() {
        return await Kelas.findAll();
    }

    /**
     * Mengambil detail kelas tunggal berdasarkan ID.
     */
    async findCourseById(courseId) {
        const course = await Kelas.findByPk(courseId);
        if (!course) {
            throw new NotFoundError("Kelas pembelajaran tidak ditemukan");
        }
        return course;
    }

    /**
     * Membuat kelas baru.
     */
    async createCourse(courseData) {
        const { id_kategori, nama_kelas, deskripsi, harga, nama_pengajar, detail_pengajar, durasi, rating, gambar, video } = courseData;
        if (!id_kategori || !nama_kelas || !deskripsi || !harga || !nama_pengajar || !detail_pengajar || !durasi || !gambar || !video) {
            throw new BadRequestError("Seluruh field data kelas wajib diisi");
        }

        return await Kelas.create({
            id_kategori,
            nama_kelas,
            deskripsi,
            harga,
            nama_pengajar,
            detail_pengajar,
            durasi,
            rating,
            gambar,
            video,
        });
    }

    /**
     * Memperbarui informasi kelas.
     */
    async updateCourse(courseId, updateData) {
        const course = await this.findCourseById(courseId);
        return await course.update(updateData);
    }

    /**
     * Menghapus kelas berdasarkan ID.
     */
    async deleteCourse(courseId) {
        const course = await this.findCourseById(courseId);
        return await course.destroy();
    }
}

module.exports = new CourseService();
