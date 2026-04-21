-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: firsttake-mysql:3306
-- Generation Time: Apr 21, 2026 at 02:33 PM
-- Server version: 8.4.8
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `firsttake`
--

-- --------------------------------------------------------

--
-- Table structure for table `meet_booking`
--

CREATE TABLE `meet_booking` (
  `booking_id` bigint NOT NULL,
  `invite_id` bigint DEFAULT NULL,
  `safe_zone_id` bigint DEFAULT NULL,
  `scheduled_time` datetime DEFAULT NULL,
  `booking_status` enum('PROPOSED','CONFIRMED','CANCELLED','NO_SHOW') DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `meet_booking`
--
ALTER TABLE `meet_booking`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `invite_id` (`invite_id`),
  ADD KEY `safe_zone_id` (`safe_zone_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `meet_booking`
--
ALTER TABLE `meet_booking`
  MODIFY `booking_id` bigint NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `meet_booking`
--
ALTER TABLE `meet_booking`
  ADD CONSTRAINT `meet_booking_ibfk_1` FOREIGN KEY (`invite_id`) REFERENCES `meet_invite` (`invite_id`),
  ADD CONSTRAINT `meet_booking_ibfk_2` FOREIGN KEY (`safe_zone_id`) REFERENCES `safe_zone` (`safe_zone_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
