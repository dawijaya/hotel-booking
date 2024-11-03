Hotel Booking App
Saya telah mengembangkan sebuah aplikasi Hotel Booking App menggunakan Next.js dan Tailwind CSS sebagai teknologi frontend. Aplikasi ini mendukung berbagai fitur dasar seperti registrasi, login, logout, serta tampilan beberapa hotel berdasarkan data yang diambil dari API eksternal. Berikut adalah deskripsi lengkap dari teknologi dan fitur yang digunakan dalam proyek ini.

Teknologi yang Digunakan
Next.js: Framework React untuk pengembangan frontend berbasis server-side rendering dan static site generation.
Tailwind CSS: Utility-first CSS framework untuk styling yang efisien.
Prisma: ORM yang digunakan untuk menghubungkan dan mengelola database.
Neon: Solusi hosting database PostgreSQL berbasis cloud.
Lucide: Pustaka ikon yang modern dan open-source.
Clerk: Manajemen otentikasi dan user session.
Shadcn: Komponen UI yang elegan untuk mempercepat pengembangan frontend.
Cloudinary: Layanan untuk penyimpanan dan manajemen media.
Stripe: Platform untuk mengelola pembayaran (belum diimplementasikan pada tahap ini).
Integrasi API
Aplikasi ini menggunakan dua endpoint API eksternal untuk mendapatkan data hotel dan informasi ketersediaan kamar:

GET: https://project-technical-test-api.up.railway.app/property/content
GET: https://project-technical-test-api.up.railway.app/stay/availability/{property_id}
Catatan: Pada API stay, saya mengalami kendala dalam mendapatkan izin CORS, sehingga tidak dapat mengaksesnya langsung dari aplikasi ini. Diharapkan pemilik API lebih memperhatikan pengaturan CORS untuk mendukung pengembangan aplikasi lintas domain.

Fitur yang Dikembangkan
Registrasi, Login, Logout: Fitur dasar otentikasi pengguna dengan integrasi Clerk.
Tampilan Hotel: Menampilkan beberapa hotel yang datanya diperoleh dari API property content.
Tambah Hotel dan Kamar: Pengguna dapat menambahkan data hotel dan kamar baru.
Mode Gelap/Terang: Pilihan untuk mengaktifkan mode tampilan sesuai preferensi pengguna.
Detail Hotel: Menampilkan informasi detail dari setiap hotel.
Kendala dan Batasan
Pada tahap ini, saya belum mengembangkan fitur transaksi dan pemesanan karena terkendala oleh izin CORS dari API stay. Selain itu, waktu pengembangan yang terbatas (7 hari) juga membatasi pengembangan fitur yang lebih mendalam. Jika waktu yang diberikan lebih panjang, serta dengan kebebasan untuk mengatur database dan API secara mandiri, saya berpotensi untuk menambahkan lebih banyak fitur dan peningkatan pada aplikasi ini.

Catatan
Jika Anda adalah pemilik API dan membaca README ini, mohon pertimbangkan untuk mengatur kebijakan CORS agar aplikasi ini dapat mengakses data ketersediaan kamar secara langsung.
# hotel-booking
