-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 01 août 2025 à 14:06
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `iot_datachain`
--

-- --------------------------------------------------------

--
-- Structure de la table `commandes`
--

CREATE TABLE `commandes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `fournisseur` varchar(100) NOT NULL,
  `quantite` varchar(50) NOT NULL,
  `statut` varchar(50) DEFAULT 'En attente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `commandes`
--

INSERT INTO `commandes` (`id`, `user_id`, `fournisseur`, `quantite`, `statut`) VALUES
(4, 4, 'Amazon ', '5 To', 'En attente');

-- --------------------------------------------------------

--
-- Structure de la table `offres`
--

CREATE TABLE `offres` (
  `id` int(11) NOT NULL,
  `fournisseur` varchar(255) DEFAULT NULL,
  `quantite` varchar(255) DEFAULT NULL,
  `prix` float DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `offres`
--

INSERT INTO `offres` (`id`, `fournisseur`, `quantite`, `prix`, `date_creation`) VALUES
(3, 'Apple ', '1 To', 10, '2025-07-25 21:01:30'),
(5, 'Amazon ', '5 To', 50, '2025-07-25 21:39:39'),
(8, 'Samsung ', '20 ', 44, '2025-07-28 12:33:12');

-- --------------------------------------------------------

--
-- Structure de la table `stocks_fournisseur`
--

CREATE TABLE `stocks_fournisseur` (
  `id` int(11) NOT NULL,
  `fournisseur` varchar(100) NOT NULL,
  `quantite_disponible` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `stock_reel`
--

CREATE TABLE `stock_reel` (
  `id` int(11) NOT NULL,
  `fournisseur` varchar(100) DEFAULT NULL,
  `quantite` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('client','provider') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id`, `username`, `password`, `role`) VALUES
(1, 'Bryan ', '$2y$10$sTyzg4XpW1Gx.X39b5kApuDAbAZdzONDDDWLR7kpbk88uSSv3Qtcu', 'client'),
(2, 'Admin1', '$2y$10$MSQ6OiEbOjVhireUdEGheeNW0Ab7sHvVFeBjP7Ax3oOp3QVkEaHEG', 'provider'),
(3, 'Mehdi ', '$2y$10$ZjlPUzKQq3nE.SFTzsWcQOLnXp1IhSO983z6S3HYIUuX.8JIFPknW', 'client'),
(4, 'Chahinaz', '$2y$10$Ujo04w63deo1ORIyKu2BAulTxBXcnbVv7/PRjEDFiwkhYdlQOOzae', 'client'),
(5, 'ElMehdi', '$2y$10$hiJT0.t2UDFc/2BWeYYI4ulIe2utHFRxOwNbGKXmc6LjL2ISAfvSC', 'client');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `offres`
--
ALTER TABLE `offres`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `stocks_fournisseur`
--
ALTER TABLE `stocks_fournisseur`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `stock_reel`
--
ALTER TABLE `stock_reel`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `commandes`
--
ALTER TABLE `commandes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `offres`
--
ALTER TABLE `offres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `stocks_fournisseur`
--
ALTER TABLE `stocks_fournisseur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `stock_reel`
--
ALTER TABLE `stock_reel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD CONSTRAINT `commandes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
