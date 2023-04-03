-- phpMyAdmin SQL Dump

-- version 5.2.0

-- https://www.phpmyadmin.net/

--

-- Host: 127.0.0.1

-- Generation Time: Jan 30, 2023 at 06:37 PM

-- Server version: 10.4.27-MariaDB

-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */

;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */

;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */

;

/*!40101 SET NAMES utf8mb4 */

;

--

-- Database: `writer`

--

-- --------------------------------------------------------

--

-- Table structure for table `category`

--

CREATE TABLE
    `category` (
        `id` varchar(36) NOT NULL,
        `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
        `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
        `deleted_at` datetime(6) DEFAULT NULL,
        `category` varchar(255) NOT NULL
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------

--

-- Table structure for table `category_post`

--

CREATE TABLE
    `category_post` (
        `id` varchar(36) NOT NULL,
        `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
        `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
        `deleted_at` datetime(6) DEFAULT NULL,
        `category` varchar(36) NOT NULL,
        `post` varchar(36) NOT NULL
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------

--

-- Table structure for table `comment`

--

CREATE TABLE
    `comment` (
        `id` varchar(36) NOT NULL,
        `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
        `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
        `deleted_at` datetime(6) DEFAULT NULL,
        `post` varchar(36) NOT NULL,
        `user` varchar(36) NOT NULL,
        `content` text NOT NULL
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------

--

-- Table structure for table `like_post`

--

CREATE TABLE
    `like_post` (
        `id` varchar(36) NOT NULL,
        `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
        `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
        `deleted_at` datetime(6) DEFAULT NULL,
        `user` varchar(36) NOT NULL,
        `post` varchar(36) NOT NULL
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------

--

-- Table structure for table `post`

--

CREATE TABLE
    `post` (
        `id` varchar(36) NOT NULL,
        `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
        `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
        `deleted_at` datetime(6) DEFAULT NULL,
        `title` varchar(255) NOT NULL DEFAULT 'text',
        `description` text NOT NULL,
        `content` text NOT NULL,
        `totalLikes` int(11) NOT NULL DEFAULT 0,
        `totalComments` int(11) NOT NULL DEFAULT 0,
        `owner` varchar(255) NOT NULL,
        `status` varchar(255) NOT NULL DEFAULT 'pending'
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------

--

-- Table structure for table `sub_comment`

--

CREATE TABLE
    `sub_comment` (
        `id` varchar(36) NOT NULL,
        `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
        `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
        `deleted_at` datetime(6) DEFAULT NULL,
        `comment` varchar(36) NOT NULL,
        `user` varchar(36) NOT NULL,
        `content` text NOT NULL
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- --------------------------------------------------------

--

-- Table structure for table `user`

--

CREATE TABLE
    `user` (
        `id` varchar(36) NOT NULL,
        `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
        `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
        `deleted_at` datetime(6) DEFAULT NULL,
        `firstName` varchar(255) NOT NULL,
        `lastName` varchar(255) NOT NULL,
        `email` varchar(255) NOT NULL,
        `username` varchar(255) NOT NULL,
        `password` varchar(255) NOT NULL,
        `gender` varchar(255) NOT NULL,
        `nationalId` varchar(255) NOT NULL,
        `phone` varchar(255) NOT NULL,
        `education` varchar(255) DEFAULT NULL,
        `currentJob` varchar(255) DEFAULT NULL,
        `hometown` varchar(255) DEFAULT NULL,
        `livingIn` varchar(255) DEFAULT NULL,
        `premium` tinyint(4) NOT NULL DEFAULT 0,
        `isActivate` tinyint(4) NOT NULL DEFAULT 0,
        `avatar` varchar(255) DEFAULT NULL,
        `bio` varchar(255) DEFAULT NULL,
        `dob` datetime NOT NULL,
        `totalPosts` int(11) NOT NULL DEFAULT 0,
        `totalFollowing` int(11) NOT NULL DEFAULT 0,
        `totalFollower` int(11) NOT NULL DEFAULT 0,
        `links` text NOT NULL,
        `linkedIn` varchar(255) DEFAULT NULL,
        `facebook` varchar(255) DEFAULT NULL,
        `instagram` varchar(255) DEFAULT NULL,
        `twitter` varchar(255) DEFAULT NULL,
        `snapChat` varchar(255) DEFAULT NULL,
        `following` text NOT NULL,
        `follower` text NOT NULL,
        `banned` tinyint(4) NOT NULL DEFAULT 0,
        `role` varchar(255) NOT NULL DEFAULT 'user'
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--

-- Indexes for dumped tables

--

--

-- Indexes for table `category`

--

ALTER TABLE `category` ADD PRIMARY KEY (`id`);

--

-- Indexes for table `category_post`

--

ALTER TABLE `category_post`
ADD PRIMARY KEY (`id`),
ADD
    KEY `category` (`category`),
ADD KEY `post` (`post`);

--

-- Indexes for table `comment`

--

ALTER TABLE `comment`
ADD PRIMARY KEY (`id`),
ADD KEY `post` (`post`),
ADD KEY `user` (`user`);

--

-- Indexes for table `like_post`

--

ALTER TABLE `like_post`
ADD PRIMARY KEY (`id`),
ADD KEY `user` (`user`),
ADD KEY `post` (`post`);

--

-- Indexes for table `post`

--

ALTER TABLE `post` ADD PRIMARY KEY (`id`);

--

-- Indexes for table `sub_comment`

--

ALTER TABLE `sub_comment`
ADD PRIMARY KEY (`id`),
ADD KEY `comment` (`comment`),
ADD KEY `user` (`user`);

--

-- Indexes for table `user`

--

ALTER TABLE `user` ADD PRIMARY KEY (`id`);

--

-- Constraints for dumped tables

--

--

-- Constraints for table `category_post`

--

ALTER TABLE `category_post`
ADD
    CONSTRAINT `category_post_ibfk_1` FOREIGN KEY (`category`) REFERENCES `category` (`id`),
ADD
    CONSTRAINT `category_post_ibfk_2` FOREIGN KEY (`post`) REFERENCES `post` (`id`);

--

-- Constraints for table `comment`

--

ALTER TABLE `comment`
ADD
    CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`post`) REFERENCES `post` (`id`),
ADD
    CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`user`) REFERENCES `user` (`id`);

--

-- Constraints for table `like_post`

--

ALTER TABLE `like_post`
ADD
    CONSTRAINT `like_post_ibfk_1` FOREIGN KEY (`user`) REFERENCES `user` (`id`),
ADD
    CONSTRAINT `like_post_ibfk_2` FOREIGN KEY (`post`) REFERENCES `post` (`id`);

--

-- Constraints for table `sub_comment`

--

ALTER TABLE `sub_comment`
ADD
    CONSTRAINT `sub_comment_ibfk_1` FOREIGN KEY (`comment`) REFERENCES `comment` (`id`),
ADD
    CONSTRAINT `sub_comment_ibfk_2` FOREIGN KEY (`user`) REFERENCES `user` (`id`);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */

;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */

;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */

;