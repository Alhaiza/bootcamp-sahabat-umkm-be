/**
 * @file course.service.js
 * @description Service layer untuk katalog modul kelas pembelajaran UMKM.
 * Dilengkapi dengan pemeriksaan hak akses konten video untuk mencegah kebocoran materi.
 */

const { Kelas, Transaksi } = require("../../models");
const { NotFoundError, BadRequestError } = require("../../errors/app.error");
const { USER_ROLES, TRANSACTION_STATUS } = require("../../constants/app.constants");

class CourseService {
    /**
     * Mengambil daftar seluruh kelas untuk katalog publik/klien.
     */
    async findAllCourses() {
        return await Kelas.findAll();
    }

    /**
     * Mengambil detail kelas dengan verifikasi kepemilikan akses konten video.
     * Jika user bukan admin dan belum membeli kelas (status: SUCCESS), URL video disensor menjadi null.
     *
     * @param {string|number} courseId - ID kelas.
     * @param {number|null} userId - ID pengguna dari token (jika terautentikasi).
     * @param {number|null} userRole - Role pengguna dari token (0: Student, 1: Admin).
     * @returns {Promise<object>} Data kelas beserta flag hasAccess.
     */
    async findCourseById(courseId, userId = null, userRole = null) {
        const course = await Kelas.findByPk(courseId);
        if (!course) {
            throw new NotFoundError("Kelas pembelajaran tidak ditemukan");
        }

        const courseData = course.toJSON();

        // SURGICAL ACCESS CONTROL: Proteksi Pembocoran Konten Video
        // Administrator (role = 1) selalu memiliki hak akses penuh.
        if (userRole === USER_ROLES.ADMIN) {
            courseData.hasAccess = true;
            return courseData;
        }

        // Jika request datang dari siswa terotentikasi, periksa apakah terdapat transaksi lunas (SUCCESS).
        if (userId) {
            const activeEnrollment = await Transaksi.findOne({
                where: {
                    id_user: userId,
                    id_kelas: courseId,
                    status: TRANSACTION_STATUS.SUCCESS,
                },
            });

            if (activeEnrollment) {
                courseData.hasAccess = true;
                return courseData;
            }
        }

        // Jika belum membeli atau tidak terautentikasi, sensor video dan tandai hasAccess = false.
        courseData.video = null;
        courseData.hasAccess = false;
        return courseData;
    }

    /**
     * Membuat kelas baru (Admin only).
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
     * Memperbarui informasi kelas (Admin only).
     */
    async updateCourse(courseId, updateData) {
        const course = await Kelas.findByPk(courseId);
        if (!course) {
            throw new NotFoundError("Kelas pembelajaran tidak ditemukan");
        }
        return await course.update(updateData);
    }

    /**
     * Menghapus kelas berdasarkan ID (Admin only).
     */
    async deleteCourse(courseId) {
        const course = await Kelas.findByPk(courseId);
        if (!course) {
            throw new NotFoundError("Kelas pembelajaran tidak ditemukan");
        }
        return await course.destroy();
    }
}

module.exports = new CourseService();
