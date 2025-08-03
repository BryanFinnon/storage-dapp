-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 03, 2025 at 09:49 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `iot_datachain`
--

-- --------------------------------------------------------

--
-- Table structure for table `commandes`
--

CREATE TABLE `commandes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `fournisseur` varchar(100) NOT NULL,
  `quantite` varchar(50) NOT NULL,
  `statut` varchar(50) DEFAULT 'En attente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `commandes`
--

INSERT INTO `commandes` (`id`, `user_id`, `fournisseur`, `quantite`, `statut`) VALUES
(4, 4, 'Amazon ', '5 To', 'Livrée'),
(5, 5, 'Samsung ', '20 To', 'Livrée'),
(6, 6, 'Apple ', '1 To', 'Livrée');

-- --------------------------------------------------------

--
-- Table structure for table `offres`
--

CREATE TABLE `offres` (
  `id` int(11) NOT NULL,
  `fournisseur` varchar(255) DEFAULT NULL,
  `quantite` varchar(255) DEFAULT NULL,
  `prix` float DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `offres`
--

INSERT INTO `offres` (`id`, `fournisseur`, `quantite`, `prix`, `date_creation`) VALUES
(3, 'Apple ', '1 To', 10, '2025-07-25 21:01:30'),
(5, 'Amazon ', '5 To', 50, '2025-07-25 21:39:39'),
(9, 'Samsung ', '20 To', 40, '2025-08-02 13:22:02');

-- --------------------------------------------------------

--
-- Table structure for table `stocks_fournisseur`
--

CREATE TABLE `stocks_fournisseur` (
  `id` int(11) NOT NULL,
  `fournisseur` varchar(100) NOT NULL,
  `quantite_disponible` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stock_client`
--

CREATE TABLE `stock_client` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `fournisseur` varchar(100) DEFAULT NULL,
  `quantite` int(11) DEFAULT NULL,
  `date_reception` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_client`
--

INSERT INTO `stock_client` (`id`, `user_id`, `fournisseur`, `quantite`, `date_reception`) VALUES
(1, 4, 'Amazon', 5, '2025-08-03 07:33:20'),
(2, 5, 'Samsung', 15, '2025-08-03 07:35:41'),
(3, 6, 'Apple', 1, '2025-08-03 07:46:18');

-- --------------------------------------------------------

--
-- Table structure for table `stock_reel`
--

CREATE TABLE `stock_reel` (
  `id` int(11) NOT NULL,
  `fournisseur` varchar(100) DEFAULT NULL,
  `quantite` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_reel`
--

INSERT INTO `stock_reel` (`id`, `fournisseur`, `quantite`) VALUES
(1, 'Apple', 20),
(2, 'Amazon', 15),
(3, 'Samsung', 25);

-- --------------------------------------------------------

--
-- Table structure for table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('client','provider') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `username`, `password`, `role`) VALUES
(2, 'Admin1', '$2y$10$MSQ6OiEbOjVhireUdEGheeNW0Ab7sHvVFeBjP7Ax3oOp3QVkEaHEG', 'provider'),
(4, 'Chahinaz', '$2y$10$Ujo04w63deo1ORIyKu2BAulTxBXcnbVv7/PRjEDFiwkhYdlQOOzae', 'client'),
(5, 'ElMehdi', '$2y$10$hiJT0.t2UDFc/2BWeYYI4ulIe2utHFRxOwNbGKXmc6LjL2ISAfvSC', 'client'),
(6, 'Bryan ', '$2y$10$OTL54dV1fSbsovY.8zPON.dpo6pttc98AnHZFc0VxGth5We6.uhnK', 'client');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `commandes`
--
ALTER TABLE `commandes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `offres`
--
ALTER TABLE `offres`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stocks_fournisseur`
--
ALTER TABLE `stocks_fournisseur`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stock_client`
--
ALTER TABLE `stock_client`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `stock_reel`
--
ALTER TABLE `stock_reel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `commandes`
--
ALTER TABLE `commandes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `offres`
--
ALTER TABLE `offres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `stocks_fournisseur`
--
ALTER TABLE `stocks_fournisseur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stock_client`
--
ALTER TABLE `stock_client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stock_reel`
--
ALTER TABLE `stock_reel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `commandes`
--
ALTER TABLE `commandes`
  ADD CONSTRAINT `commandes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_client`
--
ALTER TABLE `stock_client`
  ADD CONSTRAINT `stock_client_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
