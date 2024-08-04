
# Do-nors API

Do-nors adalah aplikasi yang dirancang untuk memfasilitasi koneksi antara individu yang membutuhkan donor organ dengan mereka yang bersedia mendonorkan organ. Proyek ini berfokus pada pengembangan API menggunakan berbagai teknologi untuk memastikan keamanan, efisiensi, dan kemampuan real-time.

## Teknologi yang Digunakan

- **Node.js**: Platform yang digunakan untuk menjalankan server.
- **Express.js**: Framework untuk membangun API dengan cepat dan efisien.
- **JWT (JSON Web Tokens)**: Digunakan untuk autentikasi dan otorisasi pengguna.
- **Socket.io**: Untuk implementasi fitur live chatting secara real-time.
- **MySQL**: Database relasional yang digunakan untuk menyimpan data aplikasi.
- **Sequelize**: ORM (Object Relational Mapping) untuk MySQL dan Node.js.
- **Nginx**: Web server yang digunakan untuk reverse proxy dan mendukung WebSocket.
- **Alibaba Cloud**: Platform cloud yang digunakan untuk mendeploy API.

## Fitur Utama

1. **Autentikasi dan Otorisasi**:
   - Pengguna dapat mendaftar dan login menggunakan JWT untuk keamanan.
   
2. **Live Chatting**:
   - Implementasi Socket.io memungkinkan pencari dan pendonor organ untuk berkomunikasi secara real-time.
   
3. **Manajemen Donor dan Pencari**:
   - CRUD (Create, Read, Update, Delete) operasi untuk mengelola data pencari dan pendonor organ.
   
4. **Pencarian Berdasarkan Organ dan Lokasi**:
   - Fitur pencarian yang memungkinkan pengguna mencari donor berdasarkan organ yang dibutuhkan dan lokasi (kota atau rumah sakit).
