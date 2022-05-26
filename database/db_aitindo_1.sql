-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 27 Bulan Mei 2022 pada 01.13
-- Versi server: 10.4.8-MariaDB
-- Versi PHP: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_aitindo_1`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `todo_list`
--

CREATE TABLE `todo_list` (
  `id` int(11) NOT NULL,
  `list_desc` text NOT NULL,
  `status` enum('1','0','','') NOT NULL,
  `create_at` varchar(100) NOT NULL,
  `update_at` varchar(100) NOT NULL,
  `delete_at` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `todo_list`
--

INSERT INTO `todo_list` (`id`, `list_desc`, `status`, `create_at`, `update_at`, `delete_at`) VALUES
(1, 'Ku tak bisa tuk memungkiri', '0', '1653597280', '1653582817', ''),
(2, 'Besok ke kantor imigrasi lagi, ', '0', '1653597412', '1653582759', '1653582802'),
(3, 'Adawdads', '1', '1653582795', '1653582814', '');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `todo_list`
--
ALTER TABLE `todo_list`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `todo_list`
--
ALTER TABLE `todo_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
