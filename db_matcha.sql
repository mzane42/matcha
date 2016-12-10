-- phpMyAdmin SQL Dump
-- version 4.6.0
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 10, 2016 at 02:17 AM
-- Server version: 5.7.11
-- PHP Version: 7.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_matcha`
--

-- --------------------------------------------------------

--
-- Table structure for table `interests`
--

CREATE TABLE `interests` (
  `id` int(11) NOT NULL,
  `interest_name` varchar(255) NOT NULL,
  `created_at` date DEFAULT NULL,
  `updated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `interests`
--

INSERT INTO `interests` (`id`, `interest_name`, `created_at`, `updated_at`) VALUES
(1, 'geek', '2016-11-21', '2016-11-21'),
(2, 'foot', '2016-11-21', '2016-11-21'),
(3, 'dwqqdwqw', NULL, NULL),
(4, 'ddwqddqw', NULL, NULL),
(5, 'dwqwd', NULL, NULL),
(6, 'music', NULL, NULL),
(7, 'design', NULL, NULL),
(8, 'architecture', NULL, NULL),
(9, 'cinema', NULL, NULL),
(10, 'rugby', NULL, NULL),
(11, 'tennis', NULL, NULL),
(12, 'fraise', NULL, NULL),
(13, 'nutella', NULL, NULL),
(14, 'caviar', NULL, NULL),
(15, 'food', NULL, NULL),
(16, 'porn', NULL, NULL),
(17, 'basket', NULL, NULL),
(18, 'Television', NULL, NULL),
(19, 'loto', NULL, NULL),
(20, 'billard', NULL, NULL),
(21, 'poker', NULL, NULL),
(22, 'politic', NULL, NULL),
(23, 'mexican', NULL, NULL),
(24, 'america', NULL, NULL),
(25, 'football', NULL, NULL),
(26, 'sport', NULL, NULL),
(27, 'google', NULL, NULL),
(28, 'brad', NULL, NULL),
(29, 'chocolat', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `photos`
--

CREATE TABLE `photos` (
  `id` int(11) NOT NULL,
  `photo_link` varchar(255) NOT NULL,
  `id_user` int(11) NOT NULL,
  `created_at` date DEFAULT NULL,
  `isProfil` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `photos`
--

INSERT INTO `photos` (`id`, `photo_link`, `id_user`, `created_at`, `isProfil`) VALUES
(93, 'content/1-1480619825998.alexa.jpg', 1, NULL, 0),
(95, 'content/1-1480627570921.Helene.jpg', 1, NULL, 0),
(96, 'content/1-1481203318750.AAEAAQAAAAAAAAWJAAAAJDgzOTI4Njg3LTU2ODYtNDk1YS1iNzAxLWUwMjY2ZjNkM2FlZg.jpg', 1, NULL, 1),
(97, 'content/1-1480686865115.Helene.jpg', 1, NULL, 0),
(98, 'content/3-1481039254194.1-1480487620292.alexa.jpg', 3, NULL, 0),
(99, 'content/3-1481039259352.1-1480519757931.nadege.jpg', 3, NULL, 0),
(100, 'content/3-1481039271162.1-1480601593854.mara.jpg', 3, NULL, 0),
(101, 'content/3-1481039278596.1-1480520161484.Helene.jpg', 3, NULL, 1),
(102, 'content/4-1481039427671.1-1480487620292.ophelie.jpg', 4, NULL, 1),
(103, 'content/4-1481039441424.1-1480487620292.ophelie.jpg', 4, NULL, 0),
(104, 'content/4-1481039441425.1-1480487620293.nadege.jpg', 4, NULL, 0),
(105, 'content/4-1481039441425.1-1480488050057.mara.jpg', 4, NULL, 0),
(106, 'content/4-1481039441426.1-1480488050060.alexa.jpg', 4, NULL, 0),
(108, 'content/5-1481039733897.1-1480512040862.Valerie.jpg', 5, NULL, 1),
(109, 'content/6-1481041073089.kobe-bryant-gma__oPt.jpg', 6, NULL, 1),
(110, 'content/8-1481041398115.25064768benjamin-castaldi-0005-benjamin-castaldi05-jpg.jpg', 8, NULL, 1),
(111, 'content/9-1481041476689.donald-trump.jpg', 9, NULL, 1),
(112, 'content/10-1481041616555.840727-zinedine-zidane-le-nouvel-entraineur-du-real-madrid-en-conference-de-presse-le-5-janvier-2016-au-sta.jpg', 10, NULL, 1),
(113, 'content/7-1481041701818.1250530894_brad_pitt_290x402.jpg', 7, NULL, 1),
(114, 'content/11-1481212944305.MTE5NDg0MDU1MDE2MDgwOTEx.jpg', 11, NULL, 1),
(115, 'content/11-1481212947624.rs_634x899-150924125002-634-angelina-jolie-beauty-092415.jpg', 11, NULL, 0),
(116, 'content/12-1481213054047.calvin-harris-defends-girlfriend-taylor-swift-in-twitter-feud-over-spotify-profits.jpg', 12, NULL, 1),
(117, 'content/12-1481213058603.calvin-harris-defends-girlfriend-taylor-swift-in-twitter-feud-over-spotify-profits.jpg', 12, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `login` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `orientation` varchar(255) DEFAULT NULL,
  `birth_date` varchar(255) DEFAULT NULL,
  `bio` text,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `zip` int(11) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `last_name`, `first_name`, `login`, `password`, `gender`, `orientation`, `birth_date`, `bio`, `lat`, `lng`, `city`, `zip`, `country`) VALUES
(1, 'Googole@gmail.com', 'Zane', 'Anis', 'Titi', '$2a$10$sgWlckIeEsn/G8yKeJ/lF.iULBfEfq6qViFVDi61sRKD2IW1v5lxq', 'm', 'Hetero', '23/02/1994', 'ojdowdwqopjdwqopqwjdqwopdqwjdqw', 48.8967, 2.31843, 'Paris', 75017, 'France'),
(3, 'thelene@gmail.com', 'tamere', 'Helene', 'thelene', '$2a$10$j6zhV5zc1S13Q1d1eX/bVOAObYY8IyaBcuv.u1vW2iHv3xI/AYhUK', 'f', 'Hetero', '21/05/1996', 'Test est la vie', 48.8864, 2.3291, 'Paris', 75018, 'France'),
(4, 'tamandine@gmail.com', 'therese', 'amandine', 'tamandine', '$2a$10$.OD.AzrNwtaQ/N.7s3I/6e94LleXdL9Tqd07MYqPDrcBAcafwLb5m', 'f', 'Homo', '28/12/1995', 'la vie est chiante', 48.8317, 2.34421, 'Paris', 75013, 'France'),
(5, 'tsarah@gmail.com', 'trista', 'sarah', 'tsarah', '$2a$10$OBTcYk4WXgU6/Pxs9FgHkeQwwwEiA1F5WPWj6AW5AAMKf1CmF85He', 'f', 'Hetero', '21/02/1995', 'j\'aime manger', 48.8792, 2.33459, 'Paris', 75009, 'France'),
(6, 'bkobe@gmail.com', 'bryant', 'kobe', 'bkobe', '$2a$10$3SyGtp/j6U8krupMyFqcueN/4nho4EKTSmjw3Q.zS4RdlVRV9j3pa', 'm', 'Homo', '21/02/1980', 'basketball forever', 48.8967, 2.31843, 'Paris', 75017, 'France'),
(7, 'pbrad@gmail.com', 'pitt', 'brad', 'pbrad', '$2a$10$ZuLeZj2Cax39/yPoeguTdOXUW7DRXCwT9eRHd533Oedc5UJc25Pae', 'm', 'Hetero', '21/02/1992', 'Angelina m\'a quitté :(', 48.8968, 2.31846, 'Paris', 75017, 'France'),
(8, 'cbenjamin@gmail.com', 'castaldi', 'benjamin', 'cbenjamin', '$2a$10$rliK954tjOi.MzddHAPqxuX1NMmS21l0FrBBCjNoSpqDU9NF0Z0Im', 'm', 'Hetero', '21/02/1988', 'Tentez de remporter le jackpot tous les jours a 21h45 sur bravolot', 48.8967, 2.31841, 'Paris', 75017, 'France'),
(9, 'tdonald', 'trump', 'donald', 'tdonald', '$2a$10$tO0ebRu7jGAw4kNhhY.STOIcxfopZLiaUS3nWHONGHbjkygdjY/vq', 'm', 'Homo', '21/02/1945', 'make America great again', 43.6122, 4.88068, 'Saint-Martin-de-Crau', 13310, 'France'),
(10, 'zzineddine@gmail.com', 'zidane', 'zineddine', 'zizou', '$2a$10$RWz/jZ1gMVXxs7vYatr.B.UvRYOB1/MzCZn9GwLz36ghTaaBlBKZm', 'm', 'Hetero', '21/03/1994', 'Football is Football', 48.8967, 2.31843, 'Paris', 75017, 'France'),
(11, 'mzane@student.42.fr', 'jolie', 'angelina', 'jangelina', '$2a$10$Fmiwxu9PRdxaTDCmZNEiWOBg77.0FLDURc56LK49evVgWTd.Bi4qC', 'f', 'Hetero', '14/12/1995', 'I\'m free', 48.892, 2.31929, 'Clichy', 92110, 'France'),
(12, 'tsarah@gmail.com', 'swift', 'taylor', 'tswift', '$2a$10$4SOA8OCFVYhU28LdJNV93umKXFlmdMrvXY87VQFLMQuWif4ZOIRIO', 'f', 'Hetero', '30/12/1990', NULL, 48.892, 2.31929, 'Paris', 75017, 'France');

-- --------------------------------------------------------

--
-- Table structure for table `usersInterests`
--

CREATE TABLE `usersInterests` (
  `id_user` int(11) NOT NULL,
  `id_interest` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `usersInterests`
--

INSERT INTO `usersInterests` (`id_user`, `id_interest`) VALUES
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(3, 6),
(3, 7),
(4, 7),
(7, 7),
(10, 7),
(1, 8),
(3, 8),
(1, 9),
(3, 9),
(4, 9),
(7, 9),
(11, 9),
(12, 9),
(4, 10),
(10, 10),
(4, 11),
(6, 11),
(5, 12),
(12, 12),
(1, 13),
(5, 13),
(5, 14),
(5, 15),
(6, 15),
(5, 16),
(6, 16),
(9, 16),
(12, 16),
(1, 17),
(6, 17),
(8, 18),
(1, 19),
(8, 19),
(8, 20),
(1, 21),
(8, 21),
(9, 22),
(9, 23),
(9, 24),
(10, 25),
(11, 25),
(10, 26),
(1, 27),
(11, 27),
(1, 28),
(11, 28),
(1, 29),
(12, 29);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `interests`
--
ALTER TABLE `interests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `usersInterests`
--
ALTER TABLE `usersInterests`
  ADD PRIMARY KEY (`id_user`,`id_interest`),
  ADD KEY `id_interest` (`id_interest`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `interests`
--
ALTER TABLE `interests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT for table `photos`
--
ALTER TABLE `photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `photos`
--
ALTER TABLE `photos`
  ADD CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `usersInterests`
--
ALTER TABLE `usersInterests`
  ADD CONSTRAINT `usersinterests_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usersinterests_ibfk_2` FOREIGN KEY (`id_interest`) REFERENCES `interests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
