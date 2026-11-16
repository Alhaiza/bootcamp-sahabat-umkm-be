/**
 * @file enrollment.service.js
 * @description Service layer untuk kelas yang berhasil didaftarkan peserta (My Classes).
 */

const { Transaksi, Kelas } = require("../../../models");
const { TRANSACTION_STATUS } = require("../../constants/app.constants");

class EnrollmentService {
    async findEnrolledCoursesByUser(userId) {
        const enrollments = await Transaksi.findAll({
            where: {
                id_user: userId,
                status: TRANSACTION_STATUS.SUCCESS,
            },
            include: [{ model: Kelas, as: "kelas" }],
        });

        return enrollments.map((item) => item.kelas).filter(Boolean);
    }
}

module.exports = new EnrollmentService();
