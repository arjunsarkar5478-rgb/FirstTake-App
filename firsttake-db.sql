-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: firsttake-mysql:3306
-- Generation Time: Apr 26, 2026 at 12:07 PM
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
-- Table structure for table `application`
--

CREATE TABLE `application` (
  `application_id` bigint NOT NULL,
  `opening_id` bigint DEFAULT NULL,
  `applicant_user_id` bigint DEFAULT NULL,
  `message` text,
  `status` enum('APPLIED','REJECTED','INVITED_TO_MEET','WITHDRAWN','ACCEPTED') DEFAULT NULL,
  `applied_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_reveal`
--

CREATE TABLE `contact_reveal` (
  `reveal_id` bigint NOT NULL,
  `booking_id` bigint DEFAULT NULL,
  `contacts_revealed` tinyint(1) DEFAULT NULL,
  `revealed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `interest`
--

CREATE TABLE `interest` (
  `interest_id` bigint NOT NULL,
  `project_id` bigint DEFAULT NULL,
  `interested_user_id` bigint DEFAULT NULL,
  `interest_status` enum('INTERESTED','WITHDRAWN') DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `meet_invite`
--

CREATE TABLE `meet_invite` (
  `invite_id` bigint NOT NULL,
  `application_id` bigint DEFAULT NULL,
  `inviter_user_id` bigint DEFAULT NULL,
  `invite_status` enum('SENT','DECLINED','ACCEPTED','EXPIRED') DEFAULT NULL,
  `sent_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `responded_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meet_verification`
--

CREATE TABLE `meet_verification` (
  `verification_id` bigint NOT NULL,
  `booking_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `verified` tinyint(1) DEFAULT NULL,
  `verified_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `project_id` bigint NOT NULL,
  `owner_user_id` bigint DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `project_type` enum('FILM_PROJECT','SCRIPT_CALL','SCENE_STUDY','GEAR_SHOWCASE') DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `description` text,
  `status` enum('DRAFT','OPEN','MEET_PENDING','ACTIVE','COMPLETED','CANCELLED') DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`project_id`, `owner_user_id`, `title`, `project_type`, `genre`, `location`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Weekend Horror Short', NULL, 'Horror', NULL, 'Shooting a short horror film in London over a weekend. No budget, but food and travel will be provided.', NULL, '2026-03-23 18:37:41', '2026-03-23 18:37:41'),
(2, 2, 'The Cafe Argument', NULL, 'Drama', NULL, 'Looking for a lead actor and one background extra for a tense dialogue scene.', NULL, '2026-03-23 18:37:41', '2026-03-23 18:37:41'),
(3, 3, 'Neon Nights', NULL, 'Sci-Fi', NULL, 'Looking for a lead actor and an editor for a cyberpunk short.', NULL, '2026-03-23 18:37:41', '2026-03-23 18:37:41'),
(4, 2, 'The Day', NULL, 'Comedy', 'London', 'Food will be provided\r\n3 days atleast', NULL, '2026-03-24 11:29:12', '2026-03-24 11:29:12');

-- --------------------------------------------------------

--
-- Table structure for table `project_coadmin`
--

CREATE TABLE `project_coadmin` (
  `project_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `added_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_requirement`
--

CREATE TABLE `project_requirement` (
  `requirement_id` bigint NOT NULL,
  `project_id` bigint DEFAULT NULL,
  `role_title` varchar(100) DEFAULT NULL,
  `role_requirements` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `project_requirement`
--

INSERT INTO `project_requirement` (`requirement_id`, `project_id`, `role_title`, `role_requirements`, `created_at`) VALUES
(1, 1, 'Cinematographer', 'Own camera equipment', '2026-03-23 18:57:03'),
(2, 1, 'Sound Engineer', 'Boom mic & recorder', '2026-03-23 18:57:03'),
(3, 2, 'Lead Actor', 'Experience with tense dialogue', '2026-03-23 18:57:03'),
(4, 2, 'Background Extra', 'Must own a realistic costume', '2026-03-23 18:57:03'),
(5, 3, 'Lead Actor', 'Comfortable with cyberpunk themes', '2026-03-23 18:57:03'),
(6, 3, 'VFX Editor', 'Experience with glowing/neon effects', '2026-03-23 18:57:03'),
(7, 4, 'Actor', 'must know English properly', '2026-03-24 11:29:12');

-- --------------------------------------------------------

--
-- Table structure for table `project_role_opening`
--

CREATE TABLE `project_role_opening` (
  `opening_id` bigint NOT NULL,
  `project_id` bigint DEFAULT NULL,
  `role_id` smallint DEFAULT NULL,
  `role_title` varchar(255) DEFAULT NULL,
  `role_description` text,
  `max_applicants` smallint DEFAULT '5',
  `opening_status` enum('OPEN','FULL','CLOSED') DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `report_id` bigint NOT NULL,
  `reporter_user_id` bigint DEFAULT NULL,
  `reported_user_id` bigint DEFAULT NULL,
  `project_id` bigint DEFAULT NULL,
  `reason` text,
  `status` enum('OPEN','IN_REVIEW','RESOLVED','DISMISSED') DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `review_id` bigint NOT NULL,
  `project_id` bigint DEFAULT NULL,
  `reviewer_user_id` bigint DEFAULT NULL,
  `reviewee_user_id` bigint DEFAULT NULL,
  `punctuality_rating` tinyint DEFAULT NULL,
  `behavior_rating` tinyint DEFAULT NULL,
  `skill_rating` tinyint DEFAULT NULL,
  `comment` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `role_id` smallint NOT NULL,
  `role_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `safe_zone`
--

CREATE TABLE `safe_zone` (
  `safe_zone_id` bigint NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `zone_type` enum('LIBRARY','CAFE','CAMPUS','CITY_CENTRE','OTHER') DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `phone_revealed_default` tinyint(1) DEFAULT '0',
  `bio` text,
  `profile_photo_url` varchar(255) DEFAULT NULL,
  `account_status` enum('ACTIVE','SUSPENDED','FLAGGED') DEFAULT 'ACTIVE',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `roles` varchar(255) DEFAULT NULL,
  `gdpr_consent` tinyint(1) DEFAULT '1',
  `location` varchar(255) DEFAULT NULL,
  `primary_link` varchar(255) DEFAULT NULL,
  `secondary_link` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password`, `phone`, `phone_revealed_default`, `bio`, `profile_photo_url`, `account_status`, `created_at`, `updated_at`, `roles`, `gdpr_consent`, `location`, `primary_link`, `secondary_link`, `profile_picture`) VALUES
(1, 'Alex', NULL, NULL, NULL, 0, 'Indie horror director based in London.', NULL, 'ACTIVE', '2026-03-23 18:37:27', '2026-03-23 18:37:27', NULL, 1, NULL, NULL, NULL, NULL),
(2, 'Sarah', NULL, NULL, NULL, 0, 'Student filmmaker focusing on drama.', NULL, 'ACTIVE', '2026-03-23 18:37:27', '2026-03-23 18:37:27', NULL, 1, NULL, NULL, NULL, NULL),
(3, 'Marcus', NULL, NULL, NULL, 0, 'Sci-Fi enthusiast and VFX artist.', NULL, 'ACTIVE', '2026-03-23 18:37:27', '2026-03-23 18:37:27', NULL, 1, NULL, NULL, NULL, NULL),
(4, 'Arjun Sarkar', 'arjunsarkar5478@gmail.com', '$2b$10$ZXZLoL9OLv5IZDn7sEXEUu7qTJqY60H8mxiLzRmov67VYvx.CMdCm', NULL, 0, 'I am an actor', NULL, 'ACTIVE', '2026-04-26 00:10:50', '2026-04-26 10:01:32', 'Director, Actor, Cinematographer', 1, 'London, Uk', 'https://www.instagram.com/sarkar54540/', 'https://www.facebook.com/?locale=en_GB', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

CREATE TABLE `user_role` (
  `user_id` bigint NOT NULL,
  `role_id` smallint NOT NULL,
  `assigned_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `application`
--
ALTER TABLE `application`
  ADD PRIMARY KEY (`application_id`),
  ADD UNIQUE KEY `opening_id` (`opening_id`,`applicant_user_id`),
  ADD KEY `applicant_user_id` (`applicant_user_id`);

--
-- Indexes for table `contact_reveal`
--
ALTER TABLE `contact_reveal`
  ADD PRIMARY KEY (`reveal_id`),
  ADD UNIQUE KEY `booking_id` (`booking_id`);

--
-- Indexes for table `interest`
--
ALTER TABLE `interest`
  ADD PRIMARY KEY (`interest_id`),
  ADD UNIQUE KEY `project_id` (`project_id`,`interested_user_id`),
  ADD KEY `interested_user_id` (`interested_user_id`);

--
-- Indexes for table `meet_booking`
--
ALTER TABLE `meet_booking`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `invite_id` (`invite_id`),
  ADD KEY `safe_zone_id` (`safe_zone_id`);

--
-- Indexes for table `meet_invite`
--
ALTER TABLE `meet_invite`
  ADD PRIMARY KEY (`invite_id`),
  ADD UNIQUE KEY `application_id` (`application_id`),
  ADD KEY `inviter_user_id` (`inviter_user_id`);

--
-- Indexes for table `meet_verification`
--
ALTER TABLE `meet_verification`
  ADD PRIMARY KEY (`verification_id`),
  ADD UNIQUE KEY `booking_id` (`booking_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `owner_user_id` (`owner_user_id`);

--
-- Indexes for table `project_coadmin`
--
ALTER TABLE `project_coadmin`
  ADD PRIMARY KEY (`project_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `project_requirement`
--
ALTER TABLE `project_requirement`
  ADD PRIMARY KEY (`requirement_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `project_role_opening`
--
ALTER TABLE `project_role_opening`
  ADD PRIMARY KEY (`opening_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `reporter_user_id` (`reporter_user_id`),
  ADD KEY `reported_user_id` (`reported_user_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`review_id`),
  ADD UNIQUE KEY `project_id` (`project_id`,`reviewer_user_id`,`reviewee_user_id`),
  ADD KEY `reviewer_user_id` (`reviewer_user_id`),
  ADD KEY `reviewee_user_id` (`reviewee_user_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `safe_zone`
--
ALTER TABLE `safe_zone`
  ADD PRIMARY KEY (`safe_zone_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_role`
--
ALTER TABLE `user_role`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `application`
--
ALTER TABLE `application`
  MODIFY `application_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_reveal`
--
ALTER TABLE `contact_reveal`
  MODIFY `reveal_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `interest`
--
ALTER TABLE `interest`
  MODIFY `interest_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meet_booking`
--
ALTER TABLE `meet_booking`
  MODIFY `booking_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meet_invite`
--
ALTER TABLE `meet_invite`
  MODIFY `invite_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meet_verification`
--
ALTER TABLE `meet_verification`
  MODIFY `verification_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `project_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `project_requirement`
--
ALTER TABLE `project_requirement`
  MODIFY `requirement_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `project_role_opening`
--
ALTER TABLE `project_role_opening`
  MODIFY `opening_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `report_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `review_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `role_id` smallint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `safe_zone`
--
ALTER TABLE `safe_zone`
  MODIFY `safe_zone_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `application`
--
ALTER TABLE `application`
  ADD CONSTRAINT `application_ibfk_1` FOREIGN KEY (`opening_id`) REFERENCES `project_role_opening` (`opening_id`),
  ADD CONSTRAINT `application_ibfk_2` FOREIGN KEY (`applicant_user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `contact_reveal`
--
ALTER TABLE `contact_reveal`
  ADD CONSTRAINT `contact_reveal_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `meet_booking` (`booking_id`);

--
-- Constraints for table `interest`
--
ALTER TABLE `interest`
  ADD CONSTRAINT `interest_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
  ADD CONSTRAINT `interest_ibfk_2` FOREIGN KEY (`interested_user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `meet_booking`
--
ALTER TABLE `meet_booking`
  ADD CONSTRAINT `meet_booking_ibfk_1` FOREIGN KEY (`invite_id`) REFERENCES `meet_invite` (`invite_id`),
  ADD CONSTRAINT `meet_booking_ibfk_2` FOREIGN KEY (`safe_zone_id`) REFERENCES `safe_zone` (`safe_zone_id`);

--
-- Constraints for table `meet_invite`
--
ALTER TABLE `meet_invite`
  ADD CONSTRAINT `meet_invite_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `application` (`application_id`),
  ADD CONSTRAINT `meet_invite_ibfk_2` FOREIGN KEY (`inviter_user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `meet_verification`
--
ALTER TABLE `meet_verification`
  ADD CONSTRAINT `meet_verification_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `meet_booking` (`booking_id`),
  ADD CONSTRAINT `meet_verification_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `project_ibfk_1` FOREIGN KEY (`owner_user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `project_coadmin`
--
ALTER TABLE `project_coadmin`
  ADD CONSTRAINT `project_coadmin_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
  ADD CONSTRAINT `project_coadmin_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `project_requirement`
--
ALTER TABLE `project_requirement`
  ADD CONSTRAINT `project_requirement_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`);

--
-- Constraints for table `project_role_opening`
--
ALTER TABLE `project_role_opening`
  ADD CONSTRAINT `project_role_opening_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
  ADD CONSTRAINT `project_role_opening_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`);

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `report_ibfk_1` FOREIGN KEY (`reporter_user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `report_ibfk_2` FOREIGN KEY (`reported_user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `report_ibfk_3` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`);

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`reviewer_user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `review_ibfk_3` FOREIGN KEY (`reviewee_user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `user_role`
--
ALTER TABLE `user_role`
  ADD CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
