/**
 * @file course.controller.js
 * @description Controller untuk memproses request katalog kelas.
 */

const courseService = require("./course.service");
const { HTTP_STATUS } = require("../../constants/app.constants");

class CourseController {
    async handleGetAllCourses(req, res, next) {
        try {
            const courses = await courseService.findAllCourses();
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Data kelas berhasil diambil",
                data: courses,
            });
        } catch (error) {
            next(error);
        }
    }

    async handleGetCourseById(req, res, next) {
        try {
            const course = await courseService.findCourseById(req.params.id);
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Detail data kelas",
                data: course,
            });
        } catch (error) {
            next(error);
        }
    }

    async handleCreateCourse(req, res, next) {
        try {
            const course = await courseService.createCourse(req.body);
            return res.status(HTTP_STATUS.CREATED).json({
                status: HTTP_STATUS.CREATED,
                success: true,
                message: "Kelas berhasil dibuat",
                data: course,
            });
        } catch (error) {
            next(error);
        }
    }

    async handleUpdateCourse(req, res, next) {
        try {
            await courseService.updateCourse(req.params.id, req.body);
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Kelas berhasil diubah",
            });
        } catch (error) {
            next(error);
        }
    }

    async handleDeleteCourse(req, res, next) {
        try {
            await courseService.deleteCourse(req.params.id);
            return res.status(HTTP_STATUS.OK).json({
                status: HTTP_STATUS.OK,
                success: true,
                message: "Kelas berhasil dihapus",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CourseController();
