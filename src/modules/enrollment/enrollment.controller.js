/**
 * @file enrollment.controller.js
 * @description Controller untuk mengambil kelas aktif pengguna.
 */

const enrollmentService = require("./enrollment.service");
const { HTTP_STATUS } = require("../../constants/app.constants");

class EnrollmentController {
    async handleGetEnrolledCourses(req, res, next) {
        try {
            const courses = await enrollmentService.findEnrolledCoursesByUser(req.payload.id);
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Daftar kelas aktif pengguna",
                data: courses,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new EnrollmentController();
