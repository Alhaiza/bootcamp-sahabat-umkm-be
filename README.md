# Sahabat UMKM - Backend API

RESTful API backend untuk platform pembelajaran daring (*e-learning / online course*) **Sahabat-UMKM**. Layanan ini mengelola data pengguna, kursus/kelas, kategori kelas UMKM, dan transaksi pendaftaran kelas.

---

## 🚀 Tech Stack

- **Runtime & Framework**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database & ORM**: [MySQL](https://www.mysql.com/) & [Sequelize ORM](https://sequelize.org/)
- **Authentication & Security**: JSON Web Token (`jsonwebtoken`), Password Hashing (`bcrypt`), CORS
- **Database Tooling**: `sequelize-cli` (Migrations & Seeders)

---

## 📂 Struktur Direktori

```text
sahabat-umkm-be/
├── config/             # Konfigurasi database Sequelize (menggunakan environment variables)
├── controllers/        # Logika pemrosesan bisnis per modul
├── middleware/         # Middleware autentikasi token JWT
├── migrations/         # Skema database migration
├── models/             # Sequelize data models
├── routes/             # Routing endpoint Express
├── seeders/            # Data dummy awal (user, kategori, kelas, transaksi)
├── .env.example        # Template konfigurasi environment
├── app.js              # Entry point Express server
└── package.json        # Dependencies dan script
```

---

## 🛠️ Panduan Instalasi & Menjalankan Lokal

### 1. Prasyarat
- Node.js (versi 16 atau lebih baru)
- MySQL Server yang sedang aktif

### 2. Kloning Repositori & Instal Dependensi
```bash
git clone git@github.com-personal:Alhaiza/bootcamp-sahabat-umkm-be.git
cd bootcamp-sahabat-umkm-be
npm install
```

### 3. Konfigurasi Environment Variable
Salin file `.env.example` menjadi `.env` lalu sesuaikan kredensial database lokal Anda:
```bash
cp .env.example .env
```

Contoh konfigurasi di `.env`:
```env
PORT=3000
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
DB_DATABASE=sahabat_umkm
DB_HOST=127.0.0.1
DB_DIALECT=mysql
JWT_SECRET=rahasia_jwt_super_aman
```

> **Catatan**: Buat database baru di MySQL sesuai nama `DB_DATABASE` (misal: `sahabat_umkm`).

### 4. Menjalankan Database Migration & Seeder
Gunakan `sequelize-cli` untuk membuat tabel dan mengisi data awal:
```bash
# Menjalankan migrasi tabel
npx sequelize-cli db:migrate

# Mengisi data awal (seeders)
npx sequelize-cli db:seed:all
```

### 5. Menjalankan Server
```bash
# Mode development (dengan nodemon)
npm run dev

# Mode production
npm start
```
Server akan aktif di `http://localhost:3000`.

---

## 📌 Ringkasan Endpoint API

| Method | Endpoint | Deskripsi | Proteksi Token |
|---|---|---|---|
| `POST` | `/register` | Registrasi akun user baru | Publik |
| `POST` | `/login` | Login user & generate JWT | Publik |
| `POST` | `/logout` | Logout user | Publik |
| `GET` | `/user/all` | Mendapatkan daftar seluruh user | Ya (Admin) |
| `GET` | `/kategori` | Mendapatkan daftar kategori kelas | Ya |
| `POST` | `/kategori` | Menambah kategori baru | Ya |
| `PUT` | `/kategori/:id` | Memperbarui kategori | Ya |
| `DELETE` | `/kategori/:id` | Menghapus kategori | Ya |
| `GET` | `/kelas` | Mendapatkan daftar seluruh kelas | Ya |
| `GET` | `/kelas/:id` | Mendapatkan detail kelas berdasarkan ID | Ya |
| `POST` | `/kelas` | Menambahkan kelas baru | Ya |
| `PUT` | `/kelas/:id` | Mengubah data kelas | Ya |
| `DELETE` | `/kelas/:id` | Menghapus data kelas | Ya |
| `GET` | `/transaksi` | Mendapatkan riwayat transaksi | Ya |
| `POST` | `/transaksi` | Membuat pesanan/transaksi pendaftaran | Ya |
| `GET` | `/daftar-kelas` | Menampilkan daftar kelas yang diambil user | Ya |

---

## 🔒 Catatan Keamanan
- File `.env` tidak boleh di-*commit* ke repositori Git.
- Pastikan secret key pada `JWT_SECRET` memiliki entropi tinggi di lingkungan produksi.
