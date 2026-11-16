# Sahabat UMKM - Backend API

Enterprise-grade RESTful API service untuk platform edukasi daring (**e-learning / online course**) **Sahabat-UMKM**, dibangun untuk mendukung kapasitas literasi digital, manajemen usaha, dan pemasaran bagi para pelaku Usaha Mikro, Kecil, dan Menengah (UMKM).

---

## 1. Title & Deskripsi Arsitektur

### Core Technology Stack
- **Runtime Environment**: [Node.js](https://nodejs.org/) (LTS v18+ hingga modern v22+)
- **HTTP Framework**: [Express.js](https://expressjs.com/) v4
- **Database Engine**: [MySQL](https://www.mysql.com/) 8.0+
- **Object Relational Mapping (ORM)**: [Sequelize](https://sequelize.org/) v6 dengan `sequelize-cli`
- **Security & Tokenization**: [JSON Web Token (jsonwebtoken)](https://github.com/auth0/node-jsonwebtoken), [bcrypt](https://github.com/kelektiv/node.bcrypt.js) (Salt rounds = 10), CORS

### Core Features
- **Autentikasi & Otorisasi**: Registrasi, login, logout, dan verifikasi berbasis JSON Web Token dengan diferensiasi hak akses Admin (role: `1`) dan Peserta UMKM (role: `0`).
- **Katalog Kursus (Kelas)**: CRUD data kursus, durasi belajar, rating, silabus materi video, thumbnail gambar, serta profil mentor pengajar.
- **Taksonomi Kategori**: Pengelompokan spesialisasi materi (Keuangan, Pemasaran Digital, Legalitas, Manajemen Usaha, dsb.).
- **Manajemen Transaksi & Hak Akses**: Sistem order pendaftaran kelas, status verifikasi lunas, dan aktivasi akses ruang belajar siswa.
- **Manajemen Pengguna**: Monitoring dan pemeliharaan akun peserta oleh Administrator.

---

## 2. System Architecture & Data Flow

```text
                        ┌───────────────────────────────┐
                        │      Client Application       │
                        │   (React SPA / Mobile / Postman)│
                        └───────────────┬───────────────┘
                                        │ HTTP Requests (JSON + Bearer Token)
                                        ▼
                        ┌───────────────────────────────┐
                        │       Express Router          │
                        │       (backend/routes)        │
                        └───────────────┬───────────────┘
                                        │
                         [verifyToken / verifyRole Middleware]
                                        │ Validated req.payload
                                        ▼
                        ┌───────────────────────────────┐
                        │      Express Controllers      │
                        │     (Business Logic Layer)    │
                        └───────────────┬───────────────┘
                                        │
                               [Sequelize Models]
                                        │ SQL Execution
                                        ▼
                        ┌───────────────────────────────┐
                        │         MySQL Database        │
                        │  (Users, Kelas, Kategori, Trx)│
                        └───────────────────────────────┘
```

### Skema Relasi Database (ERD Singkat):
- **User (1) ───< Transaksi (N)**: Satu user dapat memiliki banyak histori transaksi pendaftaran kelas.
- **Kelas (1) ───< Transaksi (N)**: Satu kelas dapat didaftarkan di banyak transaksi.
- **Kategori (1) ───< Kelas (N)**: Satu kategori menaungi banyak kelas pembelajaran.

---

## 3. Prasyarat & Dependensi

Pastikan perangkat lokal Anda telah terpasang:
- **Node.js**: Versi `18.x`, `20.x`, atau `22.x+` (NPM versi `9.x` atau lebih baru).
- **MySQL Server**: Versi `8.0` atau database MariaDB kompatibel yang aktif berjalan di port `3306`.
- **Git**: Untuk version control.

---

## 4. Panduan Instalasi & Setup Lokal

Ikuti langkah-langkah presisi berikut secara berurutan:

### Langkah 1: Kloning Repositori
```bash
git clone git@github.com-personal:Alhaiza/bootcamp-sahabat-umkm-be.git
cd bootcamp-sahabat-umkm-be
```

### Langkah 2: Instalasi Dependensi
```bash
npm install
```

### Langkah 3: Menyiapkan Database MySQL
Buka MySQL CLI atau GUI (DBeaver / MySQL Workbench / phpMyAdmin), lalu buat database baru:
```sql
CREATE DATABASE sahabat_umkm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Langkah 4: Menyiapkan File Environment
Salin file template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan nilai variabel pada file `.env` dengan kredensial database lokal Anda (lihat Bagian 5).

### Langkah 5: Eksekusi Migrasi & Seeder Database
Jalankan migrasi skema tabel dan data permulaan:
```bash
# Membuat struktur tabel database
npx sequelize-cli db:migrate

# Mengisi data awal (kategori, akun demo, kelas, & transaksi contoh)
npx sequelize-cli db:seed:all
```

---

## 5. Konfigurasi Environment Variable

File `.env` digunakan untuk konfigurasi runtime server. Jangan pernah melakukan commit file `.env` ke Git repository.

| Variabel | Tipe | Contoh Default | Deskripsi Teknis |
|---|---|---|---|
| `PORT` | Integer | `3000` | Port listen server Express HTTP |
| `DB_USERNAME` | String | `root` | Username autentikasi server MySQL |
| `DB_PASSWORD` | String | *(kosong)* | Password pengguna MySQL |
| `DB_DATABASE` | String | `sahabat_umkm` | Nama skema database yang digunakan |
| `DB_HOST` | String | `127.0.0.1` | Hostname / IP address server MySQL |
| `DB_DIALECT` | String | `mysql` | Driver dialect database Sequelize |
| `JWT_SECRET` | String | `rahasia_jwt_super_aman` | Kunci simetris enkripsi penandatanganan JWT token |

---

## 6. Cara Menjalankan Aplikasi

### Mode Development (Hot Reloading via Nodemon):
```bash
npm run dev
```
Server aktif dan memantau perubahan file pada `http://localhost:3000`.

### Mode Production:
```bash
npm start
```

---

## 7. Panduan Testing & Validasi API

Uji konektivitas dasar REST API menggunakan `curl` atau REST Client (Postman):

### Healthcheck:
```bash
curl -X GET http://localhost:3000/
```
Respons:
```json
{
  "status": 200,
  "message": "Selamat Datang di api backend"
}
```

### Otentikasi Registrasi:
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "UMKM Budi",
    "email": "budi@example.com",
    "password": "password123",
    "konfirmasi_password": "password123"
  }'
```

### Otentikasi Login:
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "budi@example.com",
    "password": "password123"
  }'
```

---

## 8. Struktur Direktori Proyek

```text
sahabat-umkm-be/
├── config/
│   └── config.js              # Factory konfigurasi koneksi Sequelize berbasis ENV
├── controllers/
│   ├── auth.controller.js     # Logika pendaftaran, login, dan logout
│   ├── daftar_kelas.controller.js # Logika penarikan kelas yang berhasil dibeli peserta
│   ├── kategori.controller.js # CRUD taksonomi kategori materi
│   ├── kelas.controller.js    # CRUD data modul kursus dan detail mentor
│   ├── transaksi.controller.js# Pembuatan pesanan & verifikasi status lunas transaksi
│   └── user.controlller.js    # Manajemen profil dan listing data user
├── middleware/
│   ├── bycookie.js            # Ekstraksi token dari cookie HTTP
│   └── token.js               # Validasi Bearer Token JWT & otorisasi role (Admin/User)
├── migrations/                # Migration files untuk pembuatan tabel di MySQL
├── models/                    # Sequelize Data Models dan asosiasi relasi tabel
├── routes/                    # Definisi router Express modular
├── seeders/                   # Seeder data permulaan pengujian
├── .env.example               # Template environment variables
├── app.js                     # Root bootstrapping Express server & middleware
└── package.json               # Manifest dependensi & script runner
```
