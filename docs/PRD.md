# KURA: Product Requirements Document (PRD)

**Intent Engine · Guardian AI · DeFi on Sui**  
**Versi 1.0 · Juni 2025 · Status: Draft Final**  
**Tim Produk Kura**  
*Membangun Jembatan antara Bahasa Manusia dan DeFi*  
*DOKUMEN KONFIDENSIAL*

---

## DAFTAR ISI

1. [Filosofi Nama & Identitas Produk](#1-filosofi-nama--identitas-produk)
2. [Ringkasan Visi & Misi](#2-ringkasan-visi--misi)
3. [Ruang Lingkup (Scope)](#3-ruang-lingkup-scope)
   - 3.1 Fitur yang Termasuk (In-Scope)
   - 3.2 Fitur yang Tidak Termasuk (Out-of-Scope)
4. [Problem Statement](#4-problem-statement)
   - 4.1 Masalah Utama yang Diidentifikasi
   - 4.2 Root Cause Analysis
   - 4.3 Dampak Kuantitatif Masalah
5. [Goals, Objectives & Success Metrics](#5-goals-objectives--success-metrics)
   - 5.1 Product Goals
   - 5.2 Key Performance Indicators (KPI)
6. [Target Pengguna](#6-target-pengguna)
   - 6.1 Segmentasi Pengguna
   - 6.2 User Persona
7. [User Stories & Epics](#7-user-stories--epics)
   - 7.1 Epic 1 – Interaksi & Parsing Niat
   - 7.2 Epic 2 – Guardian Layer & Analisis Risiko
   - 7.3 Epic 3 – Transparansi & Konfirmasi Eksplisit
8. [Arsitektur Sistem](#8-arsitektur-sistem)
   - 8.1 Diagram Arsitektur
   - 8.2 Rincian Komponen per Lapisan
   - 8.3 Spesifikasi Modul Smart Contract: KuraLogger
9. [Alur Kerja Sistem (System Workflow)](#9-alur-kerja-sistem-system-workflow)
   - 9.1 Fase 1 – Input & Pengiriman
   - 9.2 Fase 2 – Intent Parsing & PTB Builder
   - 9.3 Fase 3 – Dry Run & Guardian AI
   - 9.4 Fase 4 – Review & Konfirmasi
   - 9.5 Fase 5 – Eksekusi & Finalisasi
10. [Spesifikasi Fitur Detail](#10-spesifikasi-fitur-detail)
    - 10.1 Chat Interface
    - 10.2 Intent Parser Agent
    - 10.3 PTB Builder Service
    - 10.4 Guardian AI Agent
    - 10.5 Human-Readable Preview Card
    - 10.6 Sistem Autentikasi & Wallet
11. [Tech Stack & Dependensi](#11-tech-stack--dependensi)
12. [Non-Functional Requirements (NFR)](#12-non-functional-requirements-nfr)
    - 12.1 Performa
    - 12.2 Keamanan
    - 12.3 Keandalan
    - 12.4 Skalabilitas
13. [Asumsi & Dependensi Eksternal](#13-asumsi--dependensi-eksternal)
14. [Risiko & Rencana Mitigasi](#14-risiko--rencana-mitigasi)
15. [Timeline & Milestones](#15-timeline--milestones)
16. [Glosarium](#16-glosarium)

---

## 1. Filosofi Nama & Identitas Produk

Nama **"Kura"** bukan sekadar label produk — ia adalah manifesto filosofis yang merangkum empat prinsip inti dari sistem yang dibangun. Nama ini lahir dari dua pendekatan makna sekaligus: secara harfiah (kura-kura sebagai hewan) dan secara linguistik (kata serapan dalam Bahasa Indonesia). Keempat pilar berikut menjadi fondasi setiap keputusan desain dan rekayasa dalam produk ini.

* **Pilar 1 – Tempurung Pelindung (The Guardian Shell)**  
  Tempurung kura-kura adalah simbol perlindungan terkuat di alam. Dalam ekosistem DeFi yang penuh jebakan, Kura bertindak sebagai "tempurung" digital bagi pengguna. Melalui **Guardian AI Layer**, sistem secara aktif mendeteksi, menahan, dan memperingatkan pengguna dari ancaman nyata seperti slippage tinggi, likuiditas rendah (*stale pools*), dan eksekusi transaksi yang merugikan. Tidak ada transaksi yang lolos tanpa melewati lapisan perlindungan ini.
* **Pilar 2 – Sang Kurator (The Curator)**  
  "Kura" adalah kependekan dari kata **Kurator**. Sistem ini bertindak sebagai kurator pribadi untuk setiap transaksi finansial pengguna — mengubah niat (*intent*) dalam bahasa sehari-hari yang acak menjadi susunan transaksi (PTB – Programmable Transaction Block) yang rapi, terstruktur, dan disajikan dalam format *human-readable preview* yang mudah dipahami sebelum dieksekusi.
* **Pilar 3 – Tingkat Akurasi Tinggi (A-KURA-si)**  
  Nama ini menyisipkan kata **Akurasi** di dalamnya. Berkat kapabilitas *Dry Run* dari jaringan Sui, Kura tidak sekadar menebak hasil transaksi. Sistem memberikan simulasi matematis yang akurat secara off-chain mengenai apa yang akan terjadi jika niat pengguna dieksekusi. AI tidak berhalusinasi — ia bekerja berdasarkan data riil dari jaringan blockchain yang sesungguhnya.
* **Pilar 4 – Kehati-hatian Sebelum Melangkah (Deliberate Execution)**  
  Seekor kura-kura tidak pernah melangkah gegabah; ia selalu mengamati kondisi sekitarnya sebelum mengeluarkan kepala dari tempurungnya. Kura mengadopsi filosofi ini melalui syarat mutlak **Explicit Confirmation**. Sistem tidak akan pernah mengeksekusi aset secara sepihak. AI hanya menyusun dan menganalisis risiko, namun kendali penuh dan langkah terakhir (tanda tangan transaksi) selalu berada di tangan pengguna.

---

## 2. Ringkasan Visi & Misi

> *"Kura adalah Intent Engine berbasis AI di jaringan Sui yang bertindak sebagai kurator dan pelindung (Guardian). Kura memungkinkan pengguna berinteraksi dengan DeFi menggunakan bahasa sehari-hari, menyimulasikan transaksi dengan akurat, dan menahan eksekusi di balik 'tempurung' peringatan risiko hingga pengguna memberikan konfirmasi sadar."*

### Misi Produk
* Menghilangkan hambatan teknis DeFi dengan menyediakan antarmuka bahasa natural yang intuitif dan mudah digunakan oleh siapapun.
* Melindungi aset pengguna melalui lapisan Guardian AI yang secara proaktif menganalisis dan memperingatkan risiko transaksi sebelum eksekusi.
* Memastikan transparansi penuh dalam setiap transaksi dengan menyajikan rincian langkah demi langkah (Human-Readable PTB) yang dapat dipahami tanpa pengetahuan teknis.
* Menjamin kedaulatan pengguna atas asetnya sendiri melalui prinsip Explicit Confirmation — AI tidak pernah bertindak sepihak.
* Membangun kepercayaan ekosistem DeFi melalui simulasi akurat (Dry Run) yang berbasis data riil, bukan estimasi halusinasi AI.

---

## 3. Ruang Lingkup (Scope)

### 3.1 Fitur yang Termasuk (In-Scope)

| No. | Fitur | Keterangan |
|---|---|---|
| 1 | Chat Interface berbasis Natural Language | Antarmuka percakapan yang menerima input bahasa Indonesia/Inggris untuk memulai transaksi DeFi. |
| 2 | Intent Parser Agent (AI) | Agen AI yang menerjemahkan teks bebas menjadi JSON terstruktur berisi parameter transaksi yang valid. |
| 3 | PTB Builder Service | Layanan TypeScript yang merakit Programmable Transaction Block menggunakan `@mysten/sui.js` berdasarkan JSON dari Intent Parser. |
| 4 | Dry Run Simulation | Simulasi off-chain menggunakan `dryRunTransactionBlock` via Sui RPC untuk mendapatkan hasil transaksi tanpa biaya gas. |
| 5 | Guardian AI Layer | Agen AI kedua yang menganalisis hasil Dry Run, mendeteksi slippage, risiko likuiditas, dan menghasilkan laporan risiko dalam bahasa natural. |
| 6 | Human-Readable PTB Preview | Kartu transaksi yang menampilkan langkah-langkah eksekusi secara rinci dalam bahasa yang mudah dipahami, beserta peringatan risiko. |
| 7 | Explicit Confirmation Flow | Alur konfirmasi dua langkah dengan tombol 'Saya Paham & Eksekusi' sebelum transaksi diteruskan ke wallet. |
| 8 | Wallet Integration (dApp Kit) | Integrasi dengan Sui dApp Kit untuk koneksi wallet konvensional dan opsi zkLogin (Google Sign-In). |
| 9 | On-Chain Log Storage (KuraLogger) | Smart contract Move di Sui Testnet yang menyimpan secara permanen dan tidak dapat diubah: GuardianReport, ConfirmationEvent, dan ExecutionLog setiap transaksi. |
| 10 | Eksekusi On-Chain di Sui Testnet | Kemampuan mengirimkan PTB yang telah ditandatangani ke jaringan Sui Testnet untuk eksekusi aktual. |

### 3.2 Fitur yang Tidak Termasuk (Out-of-Scope)

| No. | Fitur/Fungsi | Alasan Pengecualian |
|---|---|---|
| 1 | Eksekusi Otomatis Tanpa Konfirmasi | Bertentangan dengan filosofi inti Kura (Deliberate Execution). Semua eksekusi membutuhkan persetujuan eksplisit. |
| 2 | Portfolio Management & Auto-Rebalancing | Di luar cakupan MVP; dapat dipertimbangkan pada fase pengembangan selanjutnya. |
| 3 | Support Multi-Chain (non-Sui) | Fokus MVP adalah ekosistem Sui. Ekspansi multi-chain merupakan roadmap masa depan. |
| 4 | Fiat On/Off Ramp | Membutuhkan integrasi dengan penyedia pembayaran pihak ketiga yang berada di luar batas MVP. |
| 5 | Notifikasi Real-Time (Push Notification) | Fitur pasif; bukan inti dari alur transaksional yang menjadi fokus saat ini. |
| 6 | Eksekusi di Mainnet Sui | MVP berjalan di Testnet untuk keamanan dan demo. Mainnet deployment adalah fase berikutnya. |

---

## 4. Problem Statement

Ekosistem DeFi (Decentralized Finance) saat ini menghadapi paradoks yang mendasar: ia menawarkan kebebasan finansial yang belum pernah ada sebelumnya, namun secara bersamaan membangun tembok teknis yang terlalu tinggi bagi mayoritas pengguna awam untuk melewatinya. Kura hadir untuk meruntuhkan tembok tersebut.

### 4.1 Masalah Utama yang Diidentifikasi

* **Masalah 1: Kompleksitas Antarmuka & Jargon Teknis**  
  Pengguna yang hanya ingin *"mendapatkan bunga dari USDC"* harus memahami konsep rumit seperti Liquidity Pools, Slippage Tolerance, RPC nodes, dan Smart Contract Routing. Mereka harus berpindah-pindah antara beberapa dApp yang berbeda untuk menyelesaikan satu tujuan finansial yang sederhana. Kurva pembelajaran yang curam ini menjadi penghalang masuk yang sangat signifikan bagi mayoritas pengguna potensial.
* **Masalah 2: Kurangnya Visibilitas Risiko (Blind Signing)**  
  Sebagian besar dApp hanya menampilkan ringkasan kasar sebelum pengguna menyetujui transaksi di dompet mereka. Pengguna tidak menyadari bahwa mereka terekspos risiko slippage yang sangat tinggi, atau bahwa mereka sedang berinteraksi dengan pool yang likuiditasnya sudah kering (*stale pools*). Ketidaktahuan ini berujung pada kerugian dana yang nyata dan pengalaman pengguna yang traumatis, mendorong churn rate yang tinggi dari ekosistem DeFi.
* **Masalah 3: Bahaya Bot AI Tanpa Pengawasan (Unsupervised AI)**  
  Solusi chatbot Web3 yang ada saat ini seringkali hanya bertindak sebagai eksekutor buta — langsung meneruskan perintah ke smart contract tanpa adanya lapisan pelindung yang memvalidasi apakah perintah tersebut aman dan masuk akal secara finansial pada detik tersebut. Tidak ada mekanisme Quality Assurance yang memeriksa kondisi pasar real-time sebelum dana pengguna berpindah tangan.

### 4.2 Root Cause Analysis

| Akar Masalah | Dampak Langsung | Dampak Tidak Langsung |
|---|---|---|
| Desain UX dApp yang berorientasi pada developer, bukan end-user | Pengguna awam tidak bisa menggunakan DeFi secara mandiri | Adopsi DeFi stagnan; ekosistem hanya berkembang di komunitas teknis |
| Tidak ada standar transparansi pra-eksekusi di industri | Pengguna melakukan blind signing yang berisiko | Kerugian dana, hilangnya kepercayaan, dan reputasi negatif DeFi |
| AI finansial yang ada tidak dilengkapi lapisan validasi | Eksekusi transaksi berbahaya tanpa peringatan | Potensi kehilangan seluruh aset karena instruksi AI yang tidak tervalidasi |
| Fragmentasi ekosistem — banyak protokol, sedikit aggregator cerdas | Pengguna harus berpindah-pindah platform untuk satu tujuan | Pengalaman pengguna yang buruk dan peluang arbitrase yang terlewatkan |

### 4.3 Dampak Kuantitatif Masalah
Masalah-masalah di atas bukan sekadar keluhan pengguna — ia berdampak nyata pada adopsi dan pertumbuhan ekosistem. Riset industri menunjukkan bahwa lebih dari 70% pengguna yang mencoba DeFi untuk pertama kalinya tidak kembali setelah satu bulan, terutama karena kompleksitas antarmuka dan pengalaman negatif pertama mereka.

---

## 5. Goals, Objectives & Success Metrics

### 5.1 Product Goals
* Menurunkan barrier masuk DeFi dari memerlukan pengetahuan teknis mendalam menjadi cukup bisa mengetik kalimat sederhana dalam bahasa sehari-hari.
* Mencegah transaksi dengan risiko tinggi (slippage > 5% atau likuiditas pool < ambang batas) yang dapat dieksekusi tanpa peringatan eksplisit yang disadari pengguna.
* Semua transaksi yang akan dieksekusi harus dapat dijelaskan secara lengkap dalam bahasa manusia biasa, tanpa menyembunyikan satu pun langkah di balik smart contract.
* AI tidak pernah mengeksekusi aset secara sepihak. Semua eksekusi membutuhkan tanda tangan kriptografi aktif dari pengguna.
* Latensi dari pengiriman perintah teks hingga kartu transaksi siap untuk dikonfirmasi tidak boleh melebihi 10 detik dalam kondisi normal.

### 5.2 Key Performance Indicators (KPI)

| KPI | Target (MVP) | Cara Pengukuran |
|---|---|---|
| Intent Parse Success Rate | >= 90% dari semua input menghasilkan JSON yang valid | Log server — rasio sukses/gagal parsing |
| Guardian Detection Rate | 100% transaksi melewati Guardian sebelum dieksekusi | Audit log — setiap eksekusi memiliki `guardian_report_id` |
| Dry Run Accuracy | Hasil dry run <= 0.5% berbeda dari hasil eksekusi aktual | Perbandingan on-chain result vs dry run estimate |
| End-to-End Latency | <= 10 detik dari submit input hingga kartu transaksi muncul | Frontend performance monitoring (e.g., Vercel Analytics) |
| User Explicit Confirmation Rate | 100% transaksi yang dieksekusi memiliki konfirmasi eksplisit | Database log — setiap `tx_hash` terhubung ke `confirmation_event` |
| Zero Blind Execution Incidents | 0 insiden transaksi dieksekusi tanpa konfirmasi pengguna | Audit on-chain: setiap `tx_digest` di `ExecutionLog` harus memiliki `GuardianReport` dengan `confirmed=true` |

---

## 6. Target Pengguna

### 6.1 Segmentasi Pengguna
* **Pengguna Primer**: Individu berusia 20–40 tahun yang familiar dengan konsep kripto secara umum (pernah membeli BTC/ETH di CEX) namun belum pernah menggunakan DeFi secara langsung karena kompleksitasnya. Mereka memiliki aset kripto dan keinginan untuk mendapatkan yield, namun takut membuat kesalahan yang tidak dapat dibalik.
* **Pengguna Sekunder**: Pengguna DeFi tingkat menengah yang sudah berpengalaman dengan beberapa protokol, namun menginginkan alat yang lebih cerdas dan efisien untuk merutekan transaksi kompleks. Mereka menghargai lapisan keamanan tambahan dan transparansi yang disediakan oleh Kura.
* **Pengguna Tersier**: Developer dan peneliti ekosistem Sui yang ingin mengeksplorasi kemampuan Intent Engine dan Programmable Transaction Block (PTB) melalui antarmuka AI. Mereka tertarik pada aspek teknis dan potensi integrasi Kura ke dalam proyek mereka sendiri.

### 6.2 User Persona

#### Raka, 27 tahun (Karyawan Swasta & Crypto Holder)
> *"Aku punya USDC di wallet tapi nggak tau cara kerja DeFi. Takut salah klik dan duit hilang."*
* **Goals**:
  * Mendapatkan passive income dari aset kripto tanpa harus menjadi expert blockchain.
  * Merasa aman dan terlindungi saat melakukan transaksi pertamanya di DeFi.
* **Pain Points**:
  * Antarmuka dApp membingungkan dan penuh jargon teknis.
  * Tidak ada yang memberitahu jika transaksinya berisiko.
  * Takut membuat kesalahan yang tidak bisa dibalik.

#### Dina, 34 tahun (DeFi Enthusiast Tingkat Menengah)
> *"Aku biasa pakai Cetus dan DeepBook, tapi selalu khawatir soal slippage di pool yang kurang likuid."*
* **Goals**:
  * Mengoptimalkan rute transaksi untuk mendapatkan harga terbaik.
  * Mendapatkan peringatan otomatis sebelum transaksi berisiko dieksekusi.
* **Pain Points**:
  * Harus memeriksa data pool secara manual sebelum setiap transaksi.
  * Tools yang ada tidak memberikan simulasi akurat sebelum eksekusi.
  * Ingin interface yang lebih cepat dan lebih cerdas dari DEX biasa.

---

## 7. User Stories & Epics

Pengembangan Kura dipandu oleh tiga Epic utama yang merepresentasikan tiga tahap perjalanan pengguna: dari berbicara dengan sistem, mendapatkan perlindungan dari Guardian, hingga mengeksekusi transaksi dengan kepercayaan penuh. Setiap Epic dipecah menjadi User Stories yang spesifik dan terukur.

### 7.1 Epic 1 – Interaksi & Parsing Niat (Text to PTB)
* **US-1.1 Input Bahasa Natural**
  * **Sebagai** pengguna awam tanpa pengetahuan teknis DeFi
  * **Saya ingin** mengetikkan tujuan finansial saya menggunakan bahasa sehari-hari (misalnya: *'Tukarkan separuh USDC saya ke SUI'*) dan sistem memahaminya secara otomatis
  * **Sehingga** saya tidak perlu secara manual mencari token, mengetik angka kontrak, dan mencari protokol DEX yang tepat
* **US-1.2 Context-Aware Revision**
  * **Sebagai** pengguna yang sedang melakukan negosiasi parameter transaksi
  * **Saya ingin** AI dapat memahami konteks percakapan sebelumnya sehingga jika saya merevisi perintah (misalnya: *'Ganti jadi 25 USDC saja'*), sistem memahami bahwa ini adalah modifikasi dari instruksi sebelumnya
  * **Sehingga** saya tidak perlu mengetik ulang seluruh instruksi dari awal, menghemat waktu dan mengurangi risiko kesalahan input
* **US-1.3 Klarifikasi Interaktif**
  * **Sebagai** pengguna yang memberikan instruksi ambigu
  * **Saya ingin** sistem meminta klarifikasi dalam bahasa natural yang ramah (misalnya: *'Maksud kamu tukar semua USDC atau setengahnya?'*) ketika perintah tidak cukup spesifik
  * **Sehingga** tidak ada asumsi tersembunyi yang dapat menyebabkan transaksi tidak sesuai keinginan saya

### 7.2 Epic 2 – Guardian Layer & Analisis Risiko
* **US-2.1 Dry Run Simulation**
  * **Sebagai** pengguna yang ingin tahu hasil pasti sebelum berkomitmen
  * **Saya ingin** sistem menyimulasikan transaksi saya (Dry Run) di belakang layar tanpa dikenakan biaya gas, sehingga sistem mengetahui persis berapa jumlah token riil yang akan saya terima termasuk semua potongan biaya
  * **Sehingga** saya dapat membuat keputusan berdasarkan angka yang akurat, bukan estimasi kasar
* **US-2.2 Peringatan Slippage Tinggi**
  * **Sebagai** pengguna yang akan mengeksekusi transaksi di pasar volatile
  * **Saya ingin** mendapatkan peringatan visual yang jelas (indikator warna merah) dan penjelasan bahasa natural jika transaksi saya memiliki Risiko Slippage Tinggi — di mana harga eksekusi melenceng jauh dari harga pasar saat ini
  * **Sehingga** saya terhindar dari kerugian nilai tukar yang signifikan dan dapat memilih untuk menunggu kondisi pasar yang lebih baik
* **US-2.3 Deteksi Stale Pool / Likuiditas Rendah**
  * **Sebagai** pengguna yang melakukan swap di pool berlikuiditas rendah
  * **Saya ingin** sistem memblokir atau memberikan peringatan keras jika saya mencoba menukar aset di Pool dengan likuiditas sangat rendah atau Stale Pool yang sudah tidak aktif
  * **Sehingga** transaksi saya tidak menyebabkan dampak harga (*price impact*) yang sangat besar yang dapat merugikan saya sendiri maupun pengguna pool lainnya
* **US-2.4 Laporan Risiko Human-Readable**
  * **Sebagai** pengguna yang tidak memahami angka teknis blockchain
  * **Saya ingin** Guardian AI menghasilkan laporan risiko dalam bahasa natural yang mudah dipahami (misalnya: *'Estimasi kamu akan mendapat 48.2 SUI. Risiko Sedang: harga sedikit lebih buruk dari harga pasar saat ini (-1.8%)'*)
  * **Sehingga** saya dapat memahami risiko transaksi tanpa harus memiliki pengetahuan teknis tentang DeFi

### 7.3 Epic 3 – Transparansi & Konfirmasi Eksplisit
* **US-3.1 Human-Readable PTB Preview**
  * **Sebagai** pengguna sebelum mengkonfirmasi transaksi
  * **Saya ingin** melihat rincian langkah demi langkah dari transaksi yang akan dilakukan sistem (Human-Readable PTB Preview) — termasuk protokol mana yang digunakan (misalnya: Cetus, DeepBook), jumlah token yang masuk dan keluar di setiap langkah, serta biaya gas yang akan dikenakan
  * **Sehingga** saya tahu persis kemana uang saya pergi dan aplikasi apa yang menggunakannya, tanpa ada transparansi yang disembunyikan
* **US-3.2 Tombol Konfirmasi Eksplisit**
  * **Sebagai** pengguna yang sudah membaca semua peringatan dan laporan
  * **Saya ingin** diwajibkan untuk menekan tombol **'Saya Paham & Eksekusi'** secara eksplisit setelah membaca seluruh laporan dari Guardian AI — dengan tombol ini hanya aktif setelah scrolling melalui seluruh laporan
  * **Sehingga** sistem atau AI tidak akan pernah bisa memindahkan dana saya secara sepihak, dan saya selalu menjadi pemegang kendali terakhir atas aset saya
* **US-3.3 Alur Signing Wallet yang Aman**
  * **Sebagai** pengguna yang sudah memberikan konfirmasi eksplisit
  * **Saya ingin** diarahkan ke ekstensi wallet saya (atau UI zkLogin) untuk proses penandatanganan kriptografi final hanya setelah semua peringatan sudah saya baca dan saya tekan tombol konfirmasi
  * **Sehingga** keamanan kriptografi transaksi tetap terjaga sesuai standar industri blockchain
* **US-3.4 Transaction Receipt & Explorer Link**
  * **Sebagai** pengguna yang baru saja menyelesaikan eksekusi transaksi
  * **Saya ingin** mendapatkan pesan sukses yang mencakup hash transaksi (digest) dan tautan langsung ke block explorer (SuiVision) agar saya dapat memverifikasi transaksi secara independen
  * **Sehingga** saya memiliki bukti yang dapat diverifikasi secara publik bahwa transaksi saya berhasil dieksekusi sesuai yang diharapkan

---

## 8. Arsitektur Sistem

Kura dibangun di atas arsitektur **multi-layered full-stack** yang memisahkan tanggung jawab secara jelas antara antarmuka pengguna, logika AI/bisnis, penyimpanan data, dan eksekusi blockchain. Pendekatan ini memastikan keamanan, skalabilitas, dan kemudahan pemeliharaan sistem.

### 8.1 Diagram Arsitektur (Textual Representation)

```
=============================================================================
                           LAPISAN FRONTEND (Client)
  +------------------+     +------------------+     +-----------------------+
  |     Chat UI      |     |   Transaction    |     |   Wallet Connection   |
  | (React/Next.js)  |     |   Preview Card   |     | (Sui dApp Kit/zkLogin)|
  +------------------+     +------------------+     +-----------------------+
=============================================================================
          | HTTP POST              ^ Render Response        | signAndExecute
          v                        |                        v
=============================================================================
             LAPISAN BACKEND & AI (Server - Next.js API Routes)
  +-----------------------+     +------------------+     +------------------+
  |       Agent 1:        |     |   PTB Builder    |     |     Agent 2:     |
  |     Intent Parser     | --> |     Service      | --> |   The Guardian   |
  |    (Gemini Flash)     |     | (@mysten/sui.js) |     |  (Gemini Flash)  |
  +-----------------------+     +------------------+     +------------------+
=============================================================================
                                                            | emit_log() via PTB
                                                            v
=============================================================================
                         LAPISAN BLOCKCHAIN (Sui Network)
  +----------------------------+     +------------------+     +--------------+
  |    KuraLogger Contract     |     | Sui Testnet RPC  |     |DeFi Protocols|
  |       (Move Module)        |     |   (Dry Run /     |     |    Cetus,    |
  | • GuardianReport           | <-> | signAndExecute)  | <-> |   DeepBook   |
  | • ExecutionLog             |     |                  |     |              |
  | • ConfirmationEvent        |     |                  |     |              |
  +----------------------------+     +------------------+     +--------------+
=============================================================================
```

### 8.2 Rincian Komponen per Lapisan

#### Lapisan 1: Frontend Layer (Antarmuka Pengguna)
* **Chat Interface**: Komponen UI interaktif berbasis React/Next.js untuk menerima input teks bahasa natural. Dilengkapi dengan animasi loading berjenjang menggunakan Framer Motion ('Parsing...', 'Simulasi...', 'Mengecek Risiko...') untuk memberikan feedback visual yang informatif.
* **Transaction Preview Card**: Kartu transaksi dinamis yang merender PTB Human-Readable, laporan risiko Guardian dengan indikator warna (merah/kuning/hijau), estimasi output, dan biaya gas yang diformat dengan jelas.
* **Sui dApp Kit Integration**: Komponen koneksi wallet yang mendukung baik wallet extension konvensional maupun zkLogin (autentikasi melalui akun Google) menggunakan library resmi dari Mysten Labs.
* **State Management**: Pengelolaan state yang komprehensif mencakup status loading, riwayat percakapan aktif, data transaksi pending, dan status konfirmasi pengguna.

#### Lapisan 2: Backend & Agentic Layer (Otak Sistem)
* **Agent 1 – Intent Parser (The PM)**: Menggunakan model Gemini Flash untuk memproses teks bahasa natural dan riwayat percakapan. Diinstruksikan untuk membalas secara eksklusif dalam format JSON terstruktur yang berisi: action type, token asal, token tujuan, jumlah, dan protokol yang direkomendasikan.
* **PTB Builder Service**: Modul TypeScript murni yang menerima JSON dari Intent Parser dan menggunakan `@mysten/sui.js` untuk merakit objek TransactionBlock (PTB) yang valid di dalam memory server. Ini adalah tahap pembuatan 'resep' transaksi sebelum simulasi.
* **Agent 2 – The Guardian (The QA)**: Menerima output mentah dari Dry Run simulation dan data harga pasar real-time. Menghitung persentase slippage, kedalaman pool, dan price impact. Menghasilkan laporan risiko terstruktur dalam bahasa natural yang mudah dipahami.
* **Vercel AI SDK**: Framework orkestrasi yang memungkinkan streaming respons AI, manajemen koneksi ke berbagai model AI, dan penanganan tool calls secara efisien.

#### Lapisan 3: On-Chain Log Layer (Sui Smart Contract)
* **KuraLogger Move Module**: Smart contract yang ditulis dalam bahasa Move dan di-deploy di Sui Testnet. Bertindak sebagai buku besar (ledger) yang tidak dapat dimanipulasi untuk seluruh aktivitas Kura. Setiap log yang ditulis bersifat permanen, transparan, dan dapat diverifikasi secara publik oleh siapapun.
* **Struct GuardianReport**: Objek on-chain yang menyimpan hasil analisis Guardian untuk setiap intent: alamat pengguna, hash intent, risk_level (0=Rendah, 1=Sedang, 2=Tinggi, 3=Kritis), slippage dalam basis points, estimasi likuiditas pool (USD), dan timestamp.
* **Struct ExecutionLog**: Objek on-chain yang mencatat eksekusi final: referensi ke GuardianReport yang telah dikonfirmasi, transaction digest on-chain, timestamp konfirmasi pengguna, dan status eksekusi (sukses/gagal).
* **Sui Events (IntentParsedEvent, UserConfirmedEvent, TransactionExecutedEvent)**: Event yang di-emit oleh smart contract pada setiap tahap kritis. Event ini dapat didengarkan secara real-time via Sui WebSocket RPC dan menjadi sumber kebenaran (source of truth) audit trail.

#### Lapisan 4: Blockchain Layer (Eksekusi & Log)
* **KuraLogger Contract (Entry Functions)**: Entry functions Move yang dapat dipanggil dari backend: `emit_guardian_report()` untuk menulis laporan risiko on-chain, `confirm_intent()` untuk mencatat konfirmasi eksplisit pengguna, dan `log_execution()` untuk mencatat digest transaksi final beserta statusnya.
* **Sui Testnet RPC**: Endpoint komunikasi antara backend dengan jaringan Sui. Digunakan untuk: Dry Run (simulasi off-chain), pemanggilan entry function KuraLogger, dan pengambilan data state on-chain.
* **dryRunTransactionBlock**: Fungsi RPC kritis untuk simulasi matematis PTB tanpa gas riil. Mengembalikan estimasi akurat: output token, gas yang digunakan, dan perubahan state.
* **signAndExecuteTransactionBlock**: Fungsi eksekusi akhir yang hanya dipanggil setelah pengguna memberikan konfirmasi eksplisit. Memicu popup wallet/zkLogin untuk tanda tangan kriptografi.
* **On-Chain DeFi Protocols**: Integrasi dengan protokol DeFi di ekosistem Sui seperti Cetus (AMM), DeepBook (CLOB DEX), dan Scallop (lending) melalui PTB yang dirakit oleh PTB Builder.

### 8.3 Spesifikasi Modul Smart Contract: KuraLogger

KuraLogger adalah Move module yang di-deploy di Sui Testnet sebagai lapisan log on-chain Kura. Berbeda dari database terpusat, setiap record yang ditulis oleh KuraLogger bersifat **permanen, tidak dapat dimanipulasi, transparan secara publik, dan dapat diverifikasi secara independen** oleh siapapun melalui block explorer. Ini mengubah audit trail dari sebuah janji (database off-chain) menjadi sebuah bukti kriptografis (on-chain object).

#### Desain Data Struktur (Move Structs)

```rust
module kura::logger {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::TxContext;
    use sui::event;

    // --- Struct: GuardianReport ---
    // Dibuat oleh backend setelah Guardian AI selesai menganalisis
    struct GuardianReport has key, store {
        id: UID,
        user_address: address,  // Alamat wallet pengguna
        intent_hash: vector<u8>, // SHA3-256 dari teks intent mentah
        risk_level: u8,         // 0=Rendah, 1=Sedang, 2=Tinggi, 3=Kritis
        slippage_bps: u64,      // Slippage dalam basis points (1% = 100 bps)
        pool_liq_usd: u64,      // Estimasi likuiditas pool dalam USD (x 100)
        report_hash: vector<u8>, // SHA3-256 dari teks laporan Guardian lengkap
        timestamp_ms: u64,      // Unix timestamp dalam milidetik
        confirmed: bool,        // false saat dibuat; diubah ke true saat dikonfirmasi
    }

    // --- Struct: ExecutionLog ---
    // Dibuat setelah pengguna menandatangani dan transaksi berhasil
    struct ExecutionLog has key, store {
        id: UID,
        guardian_report_id: ID, // Referensi ke GuardianReport terkait
        user_address: address,
        tx_digest: vector<u8>,  // On-chain transaction digest (32 bytes)
        confirmed_at_ms: u64,   // Timestamp saat pengguna tekan "Eksekusi"
        executed_at_ms: u64,    // Timestamp saat tx on-chain dikonfirmasi
        success: bool,
    }

    // --- Events (di-emit, tidak disimpan sebagai object) ---
    struct GuardianReportCreatedEvent has copy, drop {
        report_id: ID,
        user_address: address,
        risk_level: u8,
        timestamp_ms: u64,
    }

    struct UserConfirmedEvent has copy, drop {
        report_id: ID,
        user_address: address,
        timestamp_ms: u64,
    }

    struct TransactionExecutedEvent has copy, drop {
        log_id: ID,
        tx_digest: vector<u8>,
        success: bool,
        timestamp_ms: u64,
    }
}
```

#### Entry Functions yang Dipanggil Backend

| Entry Function | Dipanggil Pada Fase | Parameter Utama | Efek On-Chain |
|---|---|---|---|
| `emit_guardian_report()` | Fase 3 – Langkah 3.6 (Setelah Guardian selesai analisis) | `user_address`, `intent_hash`, `risk_level`, `slippage_bps`, `pool_liq_usd`, `report_hash` | Membuat objek `GuardianReport` baru; emit `GuardianReportCreatedEvent` |
| `confirm_intent(report_id)` | Fase 4 – Langkah 4.4 (Saat pengguna tekan tombol Eksekusi) | `report_id` (ID objek `GuardianReport`), `user_address`, `timestamp_ms` | Mengubah field `confirmed` menjadi true; emit `UserConfirmedEvent` |
| `log_execution(report_id, tx_digest, success)` | Fase 5 – Langkah 5.6 (Setelah tx on-chain selesai) | `guardian_report_id`, `tx_digest` (32 bytes), `executed_at_ms`, `success` (bool) | Membuat objek `ExecutionLog` baru; emit `TransactionExecutedEvent` |

#### Pertimbangan Desain & Trade-off
* **Keunggulan vs Database Terpusat**: Log on-chain tidak dapat dihapus atau dimanipulasi oleh siapapun, termasuk tim Kura sendiri. Setiap pengguna dapat membuktikan riwayat transaksi mereka secara kriptografis kepada pihak ketiga tanpa perlu mempercayai Kura sebagai pihak penyimpan data.
* **Pengelolaan Gas untuk Logging**: Setiap pemanggilan entry function dikenakan biaya gas Sui. Untuk meminimalkan beban biaya pada pengguna, biaya gas untuk operasi KuraLogger ditanggung oleh Kura (gas sponsorship via Sui Sponsored Transactions). Pengguna hanya membayar gas untuk transaksi DeFi inti mereka, bukan untuk pencatatan log.
* **Context Memory untuk AI**: Riwayat percakapan untuk konteks AI Intent Parser dikelola dalam React state (in-memory) per sesi browser aktif. Ini adalah desain yang disengaja — menyimpan seluruh teks percakapan on-chain akan sangat mahal dalam gas dan tidak diperlukan untuk tujuan audit. Hanya *hash* dari intent yang disimpan on-chain, bukan teks penuh.
* **Akses Data (Querying)**: Data dari KuraLogger dapat dibaca oleh siapapun melalui Sui RPC (`sui_getObject`, `suix_queryEvents`). Frontend Kura menggunakan RPC calls ini untuk menampilkan riwayat transaksi pengguna dan memverifikasi status log.

---

## 9. Alur Kerja Sistem (System Workflow)

### FASE 1: Input & Pengiriman (Client-Side)
* **Langkah 1.1 – User Input**: Pengguna mengetik perintah di komponen Chat UI. Contoh: *"Tukar 100 USDC ke SUI"*. Input dapat dalam Bahasa Indonesia maupun Bahasa Inggris.
* **Langkah 1.2 – Data Preparation**: Komponen React mengambil teks input beserta riwayat chat sebelumnya dari React state (in-memory untuk sesi aktif). Data ini dikemas menjadi payload request beserta alamat wallet pengguna.
* **Langkah 1.3 – HTTP POST Request**: Frontend mengirimkan payload melalui HTTP POST ke endpoint `/api/chat` di Next.js API Routes yang berjalan di Vercel.
* **Langkah 1.4 – Loading State Activation**: UI segera menampilkan animasi loading berjenjang menggunakan Framer Motion, memberi tahu pengguna tahap apa yang sedang diproses (*"Memahami permintaan Anda..."*).

### FASE 2: Intent Parsing & Penyusunan PTB (Server-Side)
* **Langkah 2.1 – Request Reception**: File `/api/chat/route.ts` di server Vercel menerima permintaan beserta seluruh konteks percakapan.
* **Langkah 2.2 – Agent 1: Intent Parser**: Server meneruskan teks dan history ke Gemini Flash melalui Vercel AI SDK. Model diinstruksikan untuk membalas **hanya dalam format JSON**. Output yang diharapkan: `{action: 'swap', tokenIn: 'USDC', tokenOut: 'SUI', amount: 100, protocol: 'cetus'}`
* **Langkah 2.3 – JSON Validation**: Server memvalidasi JSON yang diterima dari AI. Jika format tidak valid atau parameter penting hilang, sistem mengirimkan permintaan klarifikasi ke pengguna tanpa melanjutkan proses.
* **Langkah 2.4 – PTB Builder Execution**: Server menggunakan `@mysten/sui.js` untuk merakit objek TransactionBlock berdasarkan JSON yang valid. PTB ini siap untuk disimulasikan, namun belum dikirim ke jaringan.

### FASE 3: Dry Run & Guardian QA (Server-Side)
* **Langkah 3.1 – Dry Run Call**: Server memanggil `dryRunTransactionBlock` via Sui Testnet RPC menggunakan PTB yang baru dirakit. Proses ini sepenuhnya off-chain dan tidak memerlukan gas riil.
* **Langkah 3.2 – Dry Run Response**: Sui RPC membalas dengan data mentah: estimasi gas, perubahan saldo koin (delta), state setelah eksekusi, dan informasi error jika PTB tidak valid.
* **Langkah 3.3 – Market Data Fetch**: Secara paralel (*concurrent*), server mengambil data harga pasar real-time dari price oracle API (misalnya: Birdeye, CoinGecko) untuk mendapatkan harga referensi.
* **Langkah 3.4 – Agent 2: Guardian Analysis**: Data dry run + data harga dikirim ke Guardian AI. Guardian menghitung: **Slippage % = (market_price - execution_price) / market_price x 100**, kedalaman pool, dan price impact.
* **Langkah 3.5 – Risk Report Generation**: Guardian menghasilkan laporan risiko terstruktur: tingkat risiko (Rendah/Sedang/Tinggi/Kritis), penjelasan dalam bahasa natural, dan rekomendasi tindakan.
* **Langkah 3.6 – On-Chain Log: GuardianReport**: Server memanggil entry function `emit_guardian_report()` dari KuraLogger Move module via Sui RPC. Ini menulis objek GuardianReport ke blockchain: user_address, intent_hash, risk_level, slippage_bps, pool_liq_usd, dan report_hash. Event `GuardianReportCreatedEvent` di-emit dan dapat dipantau secara publik.
* **Langkah 3.7 – Response Composition**: Server merakit respons final yang berisi: PTB human-readable details + Guardian report + ID objek GuardianReport on-chain, lalu mengirimkannya kembali ke frontend.

### FASE 4: Review & Konfirmasi (Client-Side)
* **Langkah 4.1 – Response Rendering**: Frontend menerima respons terstruktur dari server dan menonaktifkan loading state.
* **Langkah 4.2 – Transaction Card Animation**: Menggunakan Framer Motion, Transaction Card muncul di layar chat dengan animasi yang halus. Card menampilkan: rincian langkah PTB, estimasi output (dengan akurasi dari dry run), dan laporan risiko Guardian dengan indikator warna.
* **Langkah 4.3 – Human Review Phase**: Pengguna membaca seluruh konten Transaction Card: langkah-langkah eksekusi, nama protokol yang digunakan, jumlah token estimasi, biaya gas, dan peringatan risiko dari Guardian.
* **Langkah 4.4 – Keputusan Eksplisit & On-Chain Confirm**: Pengguna memiliki dua opsi: Tombol Hijau **'Saya Paham & Eksekusi'** untuk melanjutkan, atau Tombol Merah **'Batal'**. Jika setuju: server memanggil `confirm_intent(report_id)` pada KuraLogger — mencatat konfirmasi eksplisit pengguna secara permanen on-chain sebelum wallet popup muncul. Alur berhenti total jika dibatalkan.

### FASE 5: Eksekusi & Finalisasi (Client & Blockchain)
* **Langkah 5.1 – Wallet Trigger**: Setelah pengguna menekan 'Saya Paham & Eksekusi', Frontend memanggil `signAndExecuteTransactionBlock` menggunakan hook dari Sui dApp Kit.
* **Langkah 5.2 – Wallet/zkLogin Popup**: Ekstensi wallet pengguna (misalnya: Sui Wallet, Martian) atau popup zkLogin muncul untuk meminta persetujuan kriptografi akhir dari pengguna.
* **Langkah 5.3 – Cryptographic Signing**: Pengguna menandatangani transaksi menggunakan kunci privat mereka (secara lokal, kunci tidak pernah meninggalkan perangkat pengguna).
* **Langkah 5.4 – On-Chain Execution**: PTB yang telah ditandatangani dilemparkan ke jaringan Sui Testnet dan dieksekusi secara on-chain sesuai dengan logika smart contract protokol yang dipanggil.
* **Langkah 5.5 – Transaction Receipt**: Frontend menerima transaction digest (hash unik) dari jaringan. Sistem merender pesan sukses di layar chat beserta tautan langsung ke block explorer SuiVision agar pengguna dapat memverifikasi secara independen.
* **Langkah 5.6 – On-Chain Log: ExecutionLog**: Backend memanggil entry function `log_execution(report_id, tx_digest, success)` pada KuraLogger. Ini membuat objek ExecutionLog permanen on-chain yang menghubungkan GuardianReport dengan transaction digest akhir. Event `TransactionExecutedEvent` di-emit, melengkapi rantai audit trail kriptografis yang utuh.

---

## 10. Spesifikasi Fitur Detail

### 10.1 Chat Interface

| Atribut | Spesifikasi |
|---|---|
| Input Type | Text field multiline dengan support Bahasa Indonesia dan Inggris |
| Max Input Length | 500 karakter per pesan |
| Message History Display | Bubble chat dengan timestamp, dibedakan antara pesan pengguna (kanan) dan AI (kiri) |
| Loading States | 3 tahap animasi: (1) Parsing intent, (2) Simulasi transaksi, (3) Analisis risiko Guardian |
| Error Handling | Pesan error human-readable jika parsing gagal, dengan saran reformulasi perintah |
| Accessibility | Keyboard navigation support, ARIA labels, dan contrast ratio >= 4.5:1 |
| Responsive Design | Optimal di desktop (1280px+), tablet (768px+), dan mobile (375px+) |

### 10.2 Intent Parser Agent (Agent 1)
Intent Parser adalah agen AI pertama yang bertanggung jawab untuk memahami bahasa natural pengguna dan mengonversinya ke format data terstruktur yang dapat diproses oleh sistem. Agent ini menggunakan pendekatan few-shot prompting dengan contoh-contoh transaksi DeFi yang umum.

* **Model AI**: Google Gemini 1.5 Flash (atau Gemini 2.0 Flash Experimental) via Vercel AI SDK
* **Response Format**: JSON eksklusif — model dilarang menghasilkan teks biasa
* **Konteks yang Disertakan**: 10 pesan terakhir dari riwayat percakapan + wallet state (saldo token) pengguna
* **Intent Types yang Didukung**: `swap`, `provide_liquidity`, `remove_liquidity`, `stake`, `unstake`, `lend`, `borrow`
* **Fallback Behavior**: Jika intent tidak dikenal, kembalikan `{action: 'clarify', reason: '...'}` untuk meminta klarifikasi
* **Timeout**: 5 detik; jika melewati batas, return error dengan pesan pengguna yang ramah
* **Output JSON Schema**: `{action, tokenIn, tokenOut, amountIn, amountInType, protocol, slippageTolerance}`

### 10.3 PTB Builder Service
PTB Builder adalah modul TypeScript deterministik yang tidak menggunakan AI — ia mengikuti aturan yang telah didefinisikan secara eksplisit untuk merakit TransactionBlock yang valid. Pendekatan ini memastikan konsistensi dan keandalan tinggi dalam pembuatan transaksi.
* Mendukung rakit PTB untuk operasi: coin split, swap via Cetus/DeepBook, liquidity provision, dan staking.
* Validasi parameter input sebelum merakit PTB: jumlah token tidak boleh melebihi saldo, address harus valid format Sui.
* Optimasi gas: menggabungkan langkah-langkah yang dapat digabungkan dalam satu PTB untuk meminimalkan biaya.
* Menghasilkan human-readable representation dari setiap step PTB untuk ditampilkan di Preview Card.
* Pure TypeScript tanpa side effects — fungsi builder murni yang menghasilkan output deterministik.

### 10.4 Guardian AI Agent (Agent 2)
Guardian adalah lapisan kecerdasan kritis yang membedakan Kura dari solusi chatbot DeFi lainnya. Ia adalah 'Quality Assurance' dari sistem, bertugas memastikan bahwa tidak ada transaksi berbahaya yang lolos tanpa peringatan yang memadai.

| Level Risiko | Kondisi Trigger | Indikator UI | Tindakan Sistem |
|---|---|---|---|
| **RENDAH** | Slippage < 1%, Likuiditas Pool > $100K | Badge hijau, tombol konfirmasi langsung aktif | Lanjutkan normal |
| **SEDANG** | Slippage 1%-3%, Likuiditas Pool $10K-$100K | Badge kuning, peringatan inline di card | Tampilkan peringatan, konfirmasi tetap bisa dilakukan |
| **TINGGI** | Slippage 3%-5%, Likuiditas Pool $1K-$10K | Badge merah, modal peringatan wajib dibaca | Pengguna harus mencentang checkbox 'Saya mengerti risiko' sebelum tombol konfirmasi aktif |
| **KRITIS** | Slippage > 5%, Likuiditas Pool < $1K, atau Stale Pool | Full-screen warning overlay merah | Transaksi diblokir secara default; pengguna harus mengetik **KONFIRMASI** untuk meneruskan |

### 10.5 Human-Readable PTB Preview Card
* **Header**: Judul aksi (misalnya: *'Swap 100 USDC -> SUI'*) dengan estimasi output (*'≈ 48.2 SUI'*) yang diperoleh dari dry run.
* **Step-by-Step Breakdown**: Daftar langkah eksekusi yang diformat seperti: *'Langkah 1: Split 100 USDC dari dompet kamu. Langkah 2: Kirim ke Cetus Pool. Langkah 3: Terima 48.2 SUI ke dompet.'*
* **Guardian Report Section**: Kotak berwarna sesuai level risiko yang berisi penjelasan Guardian dalam bahasa natural.
* **Fee Breakdown**: Rincian biaya yang transparan: Gas Fee (SUI), Protocol Fee (%), dan Net Output yang akan diterima.
* **Exchange Rate Display**: Kurs efektif transaksi vs kurs pasar saat ini, disajikan dalam format yang mudah dibandingkan.
* **Confirmation Button**: Tombol aksi utama yang state-nya disesuaikan dengan level risiko (langsung aktif untuk risiko rendah, memerlukan acknowledgment untuk risiko tinggi).
* **Cancel Button**: Tombol batal yang selalu terlihat dan mudah diakses, memastikan pengguna selalu bisa keluar.

### 10.6 Sistem Autentikasi & Koneksi Wallet

| Metode Auth | Library/Provider | Keuntungan | Target Pengguna |
|---|---|---|---|
| Sui Wallet Extension | Sui dApp Kit (`@mysten/dapp-kit`) | Keamanan crypto-native penuh, kontrol kunci privat di tangan pengguna | DeFi enthusiast, pengguna crypto berpengalaman |
| zkLogin (Google) | Mysten Labs zkLogin + OpenID Connect | Tidak perlu seed phrase, masuk dengan akun Google yang sudah ada | Pengguna baru, onboarding mudah |
| zkLogin (Apple) | Mysten Labs zkLogin + Sign in with Apple | Privasi tinggi, familiar bagi pengguna iOS | Pengguna mobile, privacy-conscious |

---

## 11. Tech Stack & Dependensi

### Frontend
* **Framework**: Next.js 14+ (App Router) — Full-stack React framework dengan built-in API Routes dan Server Components
* **UI Library**: React 18+ — Komponen berbasis component untuk antarmuka interaktif
* **Styling**: Tailwind CSS — Utility-first CSS framework untuk pengembangan UI yang cepat dan konsisten
* **Animasi**: Framer Motion — Library animasi React untuk Transaction Card reveal dan loading state
* **Wallet**: Sui dApp Kit (`@mysten/dapp-kit`) — Official Sui wallet integration library dengan hooks React siap pakai

### Backend & AI
* **AI Framework**: Vercel AI SDK — Orkestrasi model AI, streaming, dan manajemen tool calls
* **AI Model**: Google Gemini 1.5 Flash / 2.0 Flash — Model fast-inference untuk Intent Parser dan Guardian Agent
* **Blockchain SDK**: `@mysten/sui.js` — Official TypeScript SDK untuk berinteraksi dengan Sui Network
* **Runtime**: Node.js 18+ (Edge Runtime) — Runtime JavaScript server-side via Vercel Edge Functions
* **API Style**: REST (Next.js API Routes) — Endpoint `/api/chat` sebagai entry point utama komunikasi client-server

### On-Chain Log Storage
* **Smart Contract Language**: Move (Sui) — Bahasa pemrograman native Sui untuk menulis KuraLogger module yang aman dan gas-efficient
* **Contract Deployment**: Sui CLI / `sui client publish` — Tool resmi untuk meng-compile Move module dan men-deploy ke Sui Testnet
* **Contract Interaction**: `@mysten/sui.js` (`TransactionBlock`) — Digunakan backend untuk merakit PTB yang memanggil entry functions KuraLogger
* **Event Indexing**: Sui RPC `suix_queryEvents` — Query events yang di-emit KuraLogger untuk menampilkan riwayat log di frontend
* **Context Memory (AI)**: React State (in-memory, per sesi) — Riwayat percakapan untuk konteks AI dikelola dalam state React; hanya hash intent yang disimpan on-chain

### Blockchain
* **Network**: Sui Testnet — Jaringan test Sui untuk eksekusi transaksi dan deployment KuraLogger smart contract
* **Smart Contract**: KuraLogger (Move Module) — Move module yang di-deploy on-chain sebagai lapisan log permanen: GuardianReport, ExecutionLog, Events
* **Gas Sponsorship**: Sui Sponsored Transactions — Biaya gas untuk operasi KuraLogger ditanggung Kura agar tidak membebani pengguna
* **DEX Protocol**: Cetus Protocol — AMM DEX utama di ekosistem Sui untuk operasi swap
* **CLOB DEX**: DeepBook — Central Limit Order Book DEX native di Sui untuk trading lebih efisien
* **Block Explorer**: SuiVision — Verifikasi transaksi dan inspeksi objek KuraLogger on-chain
* **RPC**: Sui Testnet RPC — `https://fullnode.testnet.sui.io:443` – Dry Run, contract calls, event queries

### Deployment & DevOps
* **Hosting**: Vercel — Platform deployment Next.js dengan edge network global dan CI/CD otomatis
* **Version Control**: GitHub — Repository management dan collaborative development
* **Environment Config**: Vercel Environment Variables — Penyimpanan aman untuk API keys dan konfigurasi sensitif
* **Monitoring**: Vercel Analytics + Logs — Monitoring performa dan error tracking built-in dari Vercel

---

## 12. Non-Functional Requirements (NFR)

### 12.1 Performa (Performance)

| Metrik | Target | Kondisi Pengukuran |
|---|---|---|
| Intent Parse Latency | <= 2 detik | Dari submit input hingga JSON intent diterima backend |
| PTB Build Time | <= 500ms | Dari JSON diterima hingga PTB object siap untuk dry run |
| Dry Run Latency | <= 3 detik | Dari PTB dikirim ke RPC hingga hasil dry run diterima |
| Guardian Analysis Time | <= 2 detik | Dari data dry run diterima hingga laporan risiko dihasilkan |
| Total End-to-End Latency | <= 10 detik | Dari user submit hingga Transaction Card muncul di UI |
| UI Frame Rate | 60fps | Animasi Framer Motion pada Transaction Card reveal |
| Time to First Byte (TTFB) | <= 200ms | Waktu server merespons permintaan pertama pengguna |

### 12.2 Keamanan (Security)
* Private keys pengguna **tidak pernah** meninggalkan perangkat klien dan tidak pernah dikirim ke server Kura.
* Semua komunikasi client-server menggunakan HTTPS dengan TLS 1.3 minimum.
* API keys (Gemini API Key, Sui RPC credentials) disimpan sebagai environment variables di Vercel, tidak pernah di-expose ke client.
* Audit trail log tersimpan on-chain di KuraLogger — tidak ada entitas terpusat (termasuk tim Kura) yang dapat mengubah atau menghapus catatan riwayat transaksi pengguna.
* Input sanitization pada semua field teks untuk mencegah injection attacks (XSS, prompt injection).
* Rate limiting pada endpoint `/api/chat` untuk mencegah abuse: maksimum 30 requests per menit per IP.
* Tidak ada aset yang dapat berpindah tanpa tanda tangan kriptografi aktif dari wallet pengguna.
* Entry function KuraLogger hanya dapat dipanggil oleh backend Kura (dibatasi melalui capability pattern Move) — pengguna tidak dapat langsung memanipulasi data log.

### 12.3 Keandalan (Reliability)

| Aspek | Requirement |
|---|---|
| Uptime Target | >= 99.5% uptime untuk layanan API backend (Vercel) |
| Graceful Degradation | Jika Dry Run RPC gagal, sistem memberikan pesan error yang jelas dan menyarankan pengguna untuk mencoba lagi |
| Retry Logic | Otomatis retry 3x dengan exponential backoff untuk RPC calls (Dry Run & KuraLogger writes) yang timeout |
| Log Write Failure Handling | Jika penulisan log ke KuraLogger gagal (RPC error), transaksi utama TIDAK dibatalkan; backend mencatat kegagalan log untuk reconciliation manual |
| AI Service Fallback | Jika Gemini API down, tampilkan pesan maintenance yang informatif |
| Transaction Atomicity | PTB DeFi yang dirakit menggunakan prinsip atomicity Sui — semua langkah berhasil atau semua dibatalkan |

### 12.4 Skalabilitas (Scalability)
* Arsitektur serverless via Vercel Edge Functions memungkinkan penskalaan otomatis sesuai volume traffic tanpa konfigurasi infrastruktur manual.
* Stateless API design memastikan setiap request dapat diproses oleh instance server manapun — tidak ada state server yang perlu disinkronkan.
* On-chain log via KuraLogger memanfaatkan skalabilitas jaringan Sui yang memiliki throughput tinggi (>100K TPS), menghilangkan bottleneck database terpusat untuk operasi log.
* Context percakapan AI dikelola per-sesi di React state, sehingga setiap sesi independent dan tidak menambah beban storage terpusat seiring bertambahnya pengguna.

---

## 13. Asumsi & Dependensi Eksternal

| No. | Asumsi | Implikasi jika Asumsi Salah |
|---|---|---|
| A-01 | Jaringan Sui Testnet beroperasi dengan uptime >= 99% selama periode pengembangan dan demo. | Simulasi dry run, pemanggilan KuraLogger, dan eksekusi akan gagal; perlu fallback ke mock data untuk demo. |
| A-02 | Cetus Protocol dan DeepBook beroperasi normal di Testnet dan memiliki likuiditas yang memadai untuk demo. | Tidak bisa mendemonstrasikan swap yang realistis; perlu token/pool test khusus. |
| A-03 | Google Gemini API (Flash tier) memiliki rate limit yang cukup untuk kebutuhan demo dan testing. | Perlu membatasi jumlah request atau beralih ke model alternatif yang kompatibel. |
| A-04 | Pengguna memiliki wallet Sui (Sui Wallet extension) atau dapat menggunakan zkLogin untuk testing. | Perlu menyediakan wallet testing pre-configured untuk keperluan demo. |
| A-05 | Data harga dari price oracle API (Birdeye/CoinGecko) tersedia real-time untuk kalkulasi slippage yang akurat. | Guardian AI harus menggunakan data harga dari Dry Run saja, tanpa perbandingan market price. |
| A-06 | KuraLogger Move module berhasil di-compile dan di-deploy ke Sui Testnet tanpa error; package_id tersedia untuk dipanggil oleh backend. | Fitur on-chain logging tidak dapat berjalan; perlu fallback logging sementara ke in-memory atau file log server. |
| A-07 | Tim memiliki akses ke akun Vercel Pro atau setara untuk deployment dengan performance yang memadai. | Deployment mungkin mengalami cold start yang lebih lama pada tier free. |

---

## 14. Risiko & Rencana Mitigasi

* **R-01 Halusinasi AI pada Intent Parsing (Tinggi / Sedang)**
  * *Deskripsi*: AI menghasilkan JSON dengan parameter yang salah (misalnya: token address yang tidak valid atau jumlah yang melewati saldo), yang dapat menyebabkan transaksi yang tidak diinginkan.
  * *Mitigasi*: Implementasi schema validation ketat (Zod) pada semua output AI sebelum masuk ke PTB Builder. Tambahkan test suite dengan 100+ edge case intent. Dry Run sebagai safety net terakhir sebelum eksekusi.
* **R-02 Downtime Sui Testnet (Sedang / Tinggi)**
  * *Deskripsi*: Jaringan Sui Testnet mengalami gangguan selama periode kritis (demo/hackathon), menyebabkan semua fitur utama tidak dapat didemonstrasikan.
  * *Mitigasi*: Siapkan mode 'demo mode' dengan mock responses yang realistis. Dokumentasikan fallback procedure. Pantau status jaringan melalui Sui Status Page.
* **R-03 Rate Limit AI Provider (Sedang / Sedang)**
  * *Deskripsi*: Volume request ke Gemini API melebihi batas free/paid tier, menyebabkan 429 errors yang mengganggu pengalaman pengguna.
  * *Mitigasi*: Implementasi caching hasil parsing untuk intent yang identik. Pasang circuit breaker yang gracefully degraded. Siapkan fallback ke model alternatif (Groq/Anthropic).
* **R-04 Kompleksitas PTB untuk Use Case Tertentu (Sedang / Rendah)**
  * *Deskripsi*: Beberapa skenario DeFi kompleks (misalnya: multi-hop swap dengan liquidity provision) menghasilkan PTB yang terlalu kompleks untuk diverifikasi secara visual oleh pengguna awam.
  * *Mitigasi*: Batasi complexity PTB pada MVP. Implementasi progressive disclosure — tampilkan ringkasan dulu, detail tersedia jika pengguna mau melihat.
* **R-05 Ketidakakuratan Data Harga Real-Time (Sedang / Sedang)**
  * *Deskripsi*: Data dari price oracle tidak akurat atau terlambat, menyebabkan kalkulasi slippage Guardian menjadi tidak tepat dan berpotensi memberikan false warning atau false clear.
  * *Mitigasi*: Gunakan multiple price sources dan ambil median. Tampilkan timestamp data harga di UI agar pengguna bisa menilai kebaruan data. Fallback ke data dari Dry Run jika oracle down.
* **R-06 Biaya Gas KuraLogger yang Tidak Terduga (Sedang / Sedang)**
  * *Deskripsi*: Gas costs untuk memanggil entry functions KuraLogger (emit_guardian_report, confirm_intent, log_execution) lebih tinggi dari estimasi, membebani gas sponsorship Kura atau memperlambat alur eksekusi secara keseluruhan.
  * *Mitigasi*: Lakukan gas benchmarking awal saat deploy KuraLogger ke Testnet. Optimalkan Move module dengan mengurangi ukuran data yang disimpan on-chain (simpan hash, bukan full text). Implementasi gas budget cap per operasi. Evaluasi Sui gas sponsorship API untuk biaya yang lebih terprediksi.
* **R-07 Kegagalan Deployment Move Module (Rendah / Tinggi)**
  * *Deskripsi*: KuraLogger Move module gagal di-compile atau di-deploy ke Sui Testnet karena error dalam kode Move (misalnya: type system violation, borrowing rules) yang memerlukan waktu debugging lebih lama dari estimasi.
  * *Mitigasi*: Mulai pengembangan dan testing KuraLogger di Minggu 1 bersamaan dengan setup proyek. Gunakan Move Prover untuk formal verification. Siapkan fallback: jika KuraLogger belum siap, log sementara ditulis ke in-memory server log dan dapat di-reconcile ke on-chain setelah contract ready.

---

## 15. Timeline & Milestones

Timeline ini dirancang untuk skenario hackathon/kompetisi dengan durasi pengembangan 3–4 minggu. Prioritas diberikan pada fitur core yang mendemonstrasikan filosofi unik Kura secara paling kuat.

| Minggu | Fase | Deliverables Utama | Kriteria Selesai |
|---|---|---|---|
| **Minggu 1** (Hari 1-7) | Foundation, Smart Contract & Backend Core | • Setup Next.js + Tailwind + Vercel<br>• Tulis & deploy KuraLogger Move module ke Sui Testnet<br>• Verifikasi package_id contract tersedia<br>• Endpoint /api/chat dasar<br>• Intent Parser Agent (Agent 1) fungsional | KuraLogger berhasil di-deploy; Agent 1 berhasil mem-parse 10 jenis intent umum dengan akurasi > 85% |
| **Minggu 2** (Hari 8-14) | PTB Builder & Dry Run Integration | • PTB Builder Service untuk operasi swap<br>• Integrasi @mysten/sui.js untuk PTB & contract calls<br>• Koneksi ke Sui Testnet RPC<br>• dryRunTransactionBlock fungsional<br>• emit_guardian_report() berhasil dipanggil | Dry Run berhasil untuk 3+ operasi; GuardianReport objek muncul on-chain setelah analisis Guardian |
| **Minggu 3** (Hari 15-21) | Guardian AI & Frontend UI | • Guardian Agent (Agent 2) fungsional<br>• Kalkulasi slippage dan risk level<br>• confirm_intent() dipanggil saat user setuju<br>• Chat Interface UI dengan animasi Framer Motion<br>• Transaction Preview Card dengan risk indicators | End-to-end flow dari input teks hingga Guardian report + on-chain log berhasil didemonstrasikan dalam satu sesi |
| **Minggu 4** (Hari 22-28) | Wallet Integration, ExecutionLog & Demo | • Integrasi Sui dApp Kit (koneksi wallet)<br>• zkLogin integration<br>• signAndExecuteTransactionBlock flow<br>• log_execution() dipanggil setelah tx on-chain<br>• UI polishing & bug fixing<br>• Demo preparation & testing | Full end-to-end demo: input -> parse -> dry run -> Guardian report -> konfirmasi -> eksekusi -> ExecutionLog on-chain -> receipt di SuiVision |

### Definisi Done (Definition of Done)
* Semua User Stories pada Epic yang dijanjikan telah diimplementasikan dan dapat didemonstrasikan secara langsung.
* Tidak ada transaksi yang dapat dieksekusi tanpa melalui Dry Run + Guardian Analysis + Explicit Confirmation.
* End-to-end latency (input -> Transaction Card) <= 10 detik dalam kondisi jaringan normal.
* Semua kode di-deploy ke Vercel dan dapat diakses via URL publik.
* KuraLogger Move module berhasil di-deploy; objek GuardianReport, ConfirmationEvent, dan ExecutionLog dapat dilihat on-chain di SuiVision setelah setiap transaksi.
* Setidaknya satu transaksi berhasil dieksekusi on-chain di Sui Testnet dan audit trail lengkapnya (3 objek log) dapat diverifikasi secara publik.

---

## 16. Glosarium

* **DeFi (Decentralized Finance)**: Ekosistem aplikasi keuangan yang berjalan di atas blockchain tanpa perantara terpusat seperti bank.
* **Intent Engine**: Sistem yang menerima 'niat' (*intent*) pengguna dalam bahasa natural dan mengubahnya menjadi transaksi blockchain yang dapat dieksekusi.
* **PTB (Programmable Transaction Block)**: Fitur unik Sui yang memungkinkan pengelompokan beberapa operasi blockchain ke dalam satu transaksi atomik yang efisien.
* **Dry Run**: Simulasi transaksi off-chain menggunakan RPC Sui yang menghitung hasil matematis tanpa memerlukan gas atau risiko eksekusi nyata.
* **Guardian AI**: Agen AI kedua dalam sistem Kura yang bertugas menganalisis risiko transaksi berdasarkan hasil Dry Run dan kondisi pasar.
* **Slippage**: Perbedaan antara harga yang diharapkan dan harga aktual yang terjadi saat transaksi dieksekusi, biasanya karena volatilitas atau likuiditas rendah.
* **Stale Pool**: Liquidity pool yang tidak aktif atau memiliki likuiditas sangat rendah, sehingga berpotensi menyebabkan slippage ekstrem jika digunakan.
* **zkLogin**: Metode autentikasi Sui yang menggunakan zero-knowledge proof untuk memungkinkan pengguna masuk dengan akun OAuth (Google, Apple) tanpa mengekspos data privat.
* **Explicit Confirmation**: Prinsip desain Kura yang mewajibkan tindakan sadar dari pengguna (menekan tombol konfirmasi setelah membaca laporan risiko) sebelum setiap eksekusi transaksi.
* **Human-Readable Preview**: Penyajian rincian transaksi dalam format bahasa natural yang mudah dipahami oleh pengguna awam, bukan dalam format teknis/hex.
* **KuraLogger**: Move module (smart contract) yang di-deploy di Sui Testnet oleh tim Kura sebagai lapisan log on-chain yang permanen dan tidak dapat dimanipulasi.
* **Move (Bahasa Pemrograman)**: Bahasa pemrograman smart contract yang dirancang untuk keamanan resource. Digunakan di ekosistem Sui; memiliki type system ketat yang mencegah double-spending dan bugs umum.
* **GuardianReport (On-chain Object)**: Objek Sui yang dibuat oleh KuraLogger setelah Guardian AI selesai menganalisis intent; menyimpan hash intent, risk level, slippage, dan likuiditas pool secara permanen.
* **ExecutionLog (On-chain Object)**: Objek Sui yang dibuat KuraLogger setelah transaksi DeFi berhasil dieksekusi; menghubungkan GuardianReport dengan transaction digest akhir.
* **Gas Sponsorship (Sui)**: Mekanisme di Sui yang memungkinkan pihak ketiga (dalam hal ini: Kura) membayar biaya gas atas nama pengguna untuk operasi tertentu, sehingga pengguna tidak perlu memiliki SUI untuk membayar log writes.
* **AMM (Automated Market Maker)**: Protokol DEX yang menggunakan rumus matematika untuk menentukan harga aset berdasarkan rasio token dalam liquidity pool.
* **CLOB (Central Limit Order Book)**: Model DEX yang menggunakan buku pesanan beli/jual seperti bursa saham konvensional, menawarkan efisiensi harga yang lebih tinggi.
* **Price Impact**: Dampak eksekusi transaksi terhadap harga pool; transaksi besar relatif terhadap ukuran pool dapat secara signifikan menggerakkan harga.
* **Transaction Digest**: Hash unik kriptografis yang mengidentifikasi sebuah transaksi di blockchain Sui; berfungsi seperti nomor resi transaksi.
* **RPC (Remote Procedure Call)**: Protokol komunikasi yang digunakan aplikasi untuk berinteraksi dengan node blockchain Sui; digunakan untuk Dry Run, contract calls, dan eksekusi.

---
*Dokumen ini merupakan landasan hidup (living document) yang akan diperbarui seiring berkembangnya pemahaman tim terhadap kebutuhan pengguna dan kemampuan teknis sistem. Setiap perubahan signifikan terhadap spesifikasi ini harus melalui proses review dan mendapatkan persetujuan dari Product Owner.*

**Tim Kura · Intent Engine for DeFi on Sui · Versi 1.0 · Juni 2025**

---

## 17. Smart Contract Development Log

**Developer**: Whit3knight  
**Role**: Smart Contract Engineer  
**Tanggal Pengerjaan**: 07 Juni 2026  
**Status**: ✅ Selesai & Siap Deploy

---

### 17.1 Overview

Modul smart contract KuraLogger telah berhasil dibangun menggunakan
bahasa Move dan di-deploy ke Sui Testnet. Modul ini berfungsi sebagai
lapisan audit trail on-chain yang permanen dan tidak dapat dimanipulasi
untuk seluruh aktivitas sistem Kura.

---

### 17.2 File yang Dibuat

| File | Lokasi | Deskripsi |
|---|---|---|
| logger.move | apps/smart-contracts/sources/ | Module utama KuraLogger |
| Move.toml | apps/smart-contracts/ | Konfigurasi project Move |
| security_tests.move | apps/smart-contracts/tests/ | Security test suite |
| TEST_SECURITY_REPORT.md | root project | Laporan hasil security test |
| INTEGRATION_STATUS.md | root project | Status integrasi ke backend/frontend |
| DEPLOYMENT_REPORT.md | root project | Laporan hasil deploy ke testnet |

---

### 17.3 Komponen Smart Contract yang Dibangun

**Structs (On-chain Objects)**

`GuardianReport` — objek on-chain yang dibuat setelah Guardian AI
selesai menganalisis intent pengguna. Fields:
- id, user_address, intent_hash, risk_level, slippage_bps
- pool_liq_usd, report_hash, intent_blob_id, report_blob_id
- timestamp_ms, confirmed

`ExecutionLog` — objek on-chain yang dibuat setelah transaksi DeFi
berhasil dieksekusi. Fields:
- id, guardian_report_id, user_address, tx_digest
- confirmed_at_ms, executed_at_ms, success

**Events (On-chain Signals)**

- `GuardianReportCreatedEvent` — di-emit saat laporan Guardian dibuat
- `UserConfirmedEvent` — di-emit saat pengguna konfirmasi eksplisit
- `TransactionExecutedEvent` — di-emit saat eksekusi DeFi selesai

**Entry Functions**

| Function | Dipanggil Saat | Parameter Kunci |
|---|---|---|
| emit_guardian_report() | Guardian AI selesai analisis | user_address, intent_hash, risk_level, slippage_bps, pool_liq_usd, report_hash, intent_blob_id, report_blob_id |
| confirm_intent() | User tekan "Saya Paham & Eksekusi" | report (mutable ref GuardianReport) |
| log_execution() | Transaksi DeFi selesai on-chain | report, tx_digest, confirmed_at_ms, success |

**Walrus Storage Integration**

Setiap GuardianReport menyimpan 2 referensi Walrus blob:
- `intent_blob_id` — pointer ke teks intent lengkap user di Walrus
- `report_blob_id` — pointer ke teks laporan Guardian lengkap di Walrus

Pola arsitektur: Sui menyimpan hash + metadata (source of truth),
Walrus menyimpan konten teks penuh (content addressable storage).
Hash di Sui memvalidasi integritas blob di Walrus.

**Error Constants & Validations**

| Constant | Nilai | Trigger |
|---|---|---|
| ENotAuthorized | 0 | Sender bukan owner report |
| EAlreadyConfirmed | 1 | Report sudah dikonfirmasi sebelumnya |
| EReportNotConfirmed | 2 | log_execution dipanggil sebelum confirm |
| EInvalidRiskLevel | 3 | risk_level lebih dari 3 |
| EInvalidDigestLength | 4 | tx_digest bukan tepat 32 bytes |

---

### 17.4 Security Test Summary

**Hasil**: 17/17 test passed — 0 failed

| Kategori | Jumlah Test | Status |
|---|---|---|
| Access Control | 3 | ✅ Semua Lulus |
| State Integrity | 3 | ✅ Semua Lulus |
| Input Validation | 4 | ✅ Semua Lulus |
| Object Ownership & Transfer | 2 | ✅ Semua Lulus |
| Event Emission | 3 | ✅ Semua Lulus |
| Walrus Field Integrity | 2 | ✅ Semua Lulus |

Vulnerability yang ditemukan dan sudah dipatch:
- Access control missing di confirm_intent dan log_execution
- Double confirmation tidak terblokir
- log_execution bisa dipanggil tanpa konfirmasi sebelumnya
- risk_level tidak divalidasi batasannya
- tx_digest tidak divalidasi panjang 32 bytes

Semua vulnerability telah dipatch di logger.move sebelum deploy.
Detail lengkap: lihat TEST_SECURITY_REPORT.md

---

### 17.5 Integrasi ke Tim

Backend perlu menyiapkan:
- Koneksi Sui client ke testnet menggunakan PACKAGE_ID
- Upload teks intent dan laporan Guardian ke Walrus publisher
  sebelum memanggil emit_guardian_report()
- PTB builder untuk 3 entry function
- Event listener untuk 3 event via Sui WebSocket RPC

Frontend perlu menyiapkan:
- useSignAndExecuteTransaction dari @mysten/dapp-kit untuk
  confirm_intent (harus di-sign user langsung)
- Fetch blob dari Walrus aggregator menggunakan blob_id
- Verifikasi hash lokal vs intent_hash on-chain untuk validasi
  integritas konten

---

### 17.6 Deployment Info
- Network: Sui Testnet
- Package ID: 0x3f22e83811b5e2c5069f0b51aeb2701ae534daade21592a377810581c6c0c064
- Deploy Date: 07 Juni 2026
- Explorer: https://suiscan.xyz/testnet/object/0x3f22e83811b5e2c5069f0b51aeb2701ae534daade21592a377810581c6c0c064

---

### 17.7 Kesimpulan Perubahan & Penyesuaian Integrasi (Juni 2026)

**Ringkasan Perubahan pada Smart Contract (logger.move & Move.toml)**:
1. **Perbaikan Konfigurasi Alamat (`Move.toml`)**: Konfigurasi nama alamat di dalam `Move.toml` telah diperbaiki menjadi `kura = "0x0"` untuk mensinkronisasikan penamaan namespace modul dengan kode sumber `logger.move` (menyelesaikan error kompilasi `E03001`).
2. **Penyediaan Getter Helper (`logger.move`)**: Menambahkan serangkaian fungsi pembaca (getter) beranotasi `#[test_only]` agar unit test eksternal dapat melakukan asersi terhadap properti internal struct `GuardianReport` dan `ExecutionLog` tanpa mengubah fungsionalitas produksi.
3. **Penyusunan & Validasi Security Test Suite**: Membuat file pengujian komprehensif `apps/smart-contracts/tests/security_tests.move` yang berisi 17 kasus uji (mencakup kontrol akses, integritas status, validasi input, kepemilikan objek, emisi event, dan integritas bidang Walrus). Seluruh pengujian ini berhasil lulus dengan status `17/17 passed`.
4. **Pembersihan Lingkungan Repositori**: Menghapus file pengujian lokal serta file log hasil test dari branch utama guna menjaga codebase produksi tetap bersih, lalu meng-commit dan mendorong perubahan ke branch `Smart-Contract`.

**Penyesuaian Integrasi (Bagaimana Backend dan Frontend Mengubahnya)**:
* **Backend**:
  * **Penyelarasan Address Binding**: Backend harus menggunakan nama alamat `kura` (bukan `kura_logger`) saat berinteraksi dengan API atau membangun Transaction Block.
  * **Pengiriman Parameter ke Entry Point**: Panggilan on-chain ke `emit_guardian_report` dan `log_execution` disesuaikan dengan skema parameter yang menyertakan pointer referensi Walrus blob (`intent_blob_id` dan `report_blob_id`).
* **Frontend**:
  * **Proses Konfirmasi On-Chain**: Saat pengguna memberikan persetujuan eksplisit, frontend memicu modul tanda tangan dompet (`signAndExecuteTransactionBlock`) untuk memanggil fungsi entry `confirm_intent` pada objek laporan Guardian terkait secara on-chain.
  * **Verifikasi Data Konten**: Frontend mengambil `intent_blob_id` dan `report_blob_id` dari objek laporan di blockchain, kemudian melakukan query ke Walrus aggregator untuk mengambil file mentah dan memverifikasinya terhadap data hash.



