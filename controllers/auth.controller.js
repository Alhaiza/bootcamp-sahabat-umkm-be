const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Controller untuk menangani registrasi pengguna baru (User role default: 0).
 *
 * @async
 * @function registerUser
 * @param {import('express').Request} req - Express Request object dengan req.body: { nama, email, password, konfirmasi_password }.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON response dengan status HTTP 201 jika berhasil, 400 jika validasi gagal, atau 500 jika terjadi kegagalan server.
 * @throws {Error} Mengembalikan status 500 bila terjadi error database atau hashing.
 */
const registerUser = async (req, res) => {
  try {
    const { nama, email, password, konfirmasi_password } = req.body;

    // Validasi field wajib
    if (!nama || !email || !password || !konfirmasi_password) {
      return res.status(400).json({
        status: 400,
        message: "Data harus diisi",
      });
    }

    // Cek duplikasi email pada database
    const checkEmail = await User.findOne({ where: { email } });
    if (checkEmail) {
      return res.status(400).json({
        status: 400,
        message: "Maaf Email anda sudah terdaftar",
      });
    }

    // Validasi kesesuaian konfirmasi password
    if (password !== konfirmasi_password) {
      return res.status(400).json({
        status: 400,
        message: "Password dan Konfirmasi Password tidak cocok",
      });
    }

    // Hashing password menggunakan bcrypt dengan salt rounds = 10
    const hashPassword = bcrypt.hashSync(password, 10);

    const register = await User.create({ nama, email, password: hashPassword });
    return res.status(201).json({
      status: 201,
      message: "Registrasi anda berhasil",
      data: register,
    });
  } catch (error) {
    console.error("Kesalahan registrasi:", error);

    let errorMessage = "Kesalahan server internal selama registrasi";
    if (error.message) {
      errorMessage += `: ${error.message}`;
    }

    return res.status(500).json({
      status: 500,
      error: error.message,
      message: errorMessage,
    });
  }
};

/**
 * Controller untuk menangani otentikasi login pengguna dan penerbitan JSON Web Token (JWT).
 *
 * @async
 * @function loginUser
 * @param {import('express').Request} req - Express Request object dengan req.body: { email, password }.
 * @param {import('express').Response} res - Express Response object.
 * @returns {Promise<import('express').Response>} JSON response dengan status HTTP 200 beserta Access Token jika valid, 400 jika kredensial salah, atau 500 jika internal server error.
 * @throws {Error} Mengembalikan status 500 jika proses querying atau signing token gagal.
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi keberadaan input email dan password
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        message: "Data harus diisi",
      });
    }

    // Pencarian akun berdasarkan email
    const checkEmail = await User.findOne({ where: { email } });
    if (!checkEmail) {
      return res.status(400).json({
        status: 400,
        message: "Maaf Email anda tidak terdaftar",
      });
    }

    // Verifikasi hash password
    const matchPassword = bcrypt.compareSync(req.body.password, checkEmail.password);
    if (!matchPassword) {
      return res.status(400).json({
        status: 400,
        message: "Maaf Password anda salah",
      });
    }

    // Pembuatan access token berdurasi 7 hari
    const accessToken = jwt.sign(
      { id: checkEmail.id, role: checkEmail.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      status: 200,
      message: "Login anda berhasil",
      data: checkEmail,
      token: accessToken,
    });
  } catch (error) {
    console.error("Kesalahan login:", error);
    return res.status(500).json({
      status: 500,
      message: "Kesalahan server internal selama login",
    });
  }
};

/**
 * Controller untuk proses logout (menginvaliasi token secara client-side dan mengembalikan short-lived token).
 *
 * @function logoutUser
 * @param {import('express').Request} req - Express Request object berisi req.payload dari middleware verifyToken.
 * @param {import('express').Response} res - Express Response object.
 * @returns {import('express').Response} JSON response konfirmasi logout.
 */
const logoutUser = (req, res) => {
  try {
    const { id, role } = req.payload;

    // Terbitkan token kedaluwarsa cepat (1 detik) sebagai penanda invalidasi
    const invalidatedToken = jwt.sign(
      { id, role },
      process.env.JWT_SECRET,
      { expiresIn: "1s" }
    );

    return res.status(200).json({
      status: 200,
      message: "Logout anda berhasil",
      invalidatedToken: invalidatedToken,
    });
  } catch (error) {
    console.error("Kesalahan logout:", error);
    return res.status(500).json({
      status: 500,
      message: "Kesalahan server internal selama logout",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
