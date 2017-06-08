-- MySQL dump 10.13  Distrib 5.7.17, for osx10.12 (x86_64)
--
-- Host: localhost    Database: db_matcha
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blocked`
--

DROP TABLE IF EXISTS `blocked`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blocked` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_author` int(11) NOT NULL,
  `id_receiver` int(11) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_author` (`id_author`),
  KEY `id_receiver` (`id_receiver`),
  CONSTRAINT `blocked_ibfk_1` FOREIGN KEY (`id_author`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `blocked_ibfk_2` FOREIGN KEY (`id_receiver`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blocked`
--

LOCK TABLES `blocked` WRITE;
/*!40000 ALTER TABLE `blocked` DISABLE KEYS */;
INSERT INTO `blocked` VALUES (1,1,3,'06/08/2017 19:47:22');
/*!40000 ALTER TABLE `blocked` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat`
--

DROP TABLE IF EXISTS `chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_author` int(11) NOT NULL,
  `id_receiver` int(11) NOT NULL,
  `message` varchar(255) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_author` (`id_author`),
  KEY `id_receiver` (`id_receiver`),
  CONSTRAINT `chat_ibfk_1` FOREIGN KEY (`id_author`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chat_ibfk_2` FOREIGN KEY (`id_receiver`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat`
--

LOCK TABLES `chat` WRITE;
/*!40000 ALTER TABLE `chat` DISABLE KEYS */;
INSERT INTO `chat` VALUES (6,1,3,'hey','06/07/2017 01:05:46'),(7,1,12,'hey','06/07/2017 01:05:52'),(8,1,3,'hey','06/07/2017 01:05:58');
/*!40000 ALTER TABLE `chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interests`
--

DROP TABLE IF EXISTS `interests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `interests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `interest_name` varchar(255) NOT NULL,
  `created_at` date DEFAULT NULL,
  `updated_at` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interests`
--

LOCK TABLES `interests` WRITE;
/*!40000 ALTER TABLE `interests` DISABLE KEYS */;
INSERT INTO `interests` VALUES (1,'geek','2016-11-21','2016-11-21'),(2,'foot','2016-11-21','2016-11-21'),(3,'dwqqdwqw','2016-11-21','2016-11-21'),(4,'ddwqddqw','2016-11-21','2016-11-21'),(5,'dwqwd','2016-11-21','2016-11-21'),(6,'music','2016-11-21','2016-11-21'),(7,'design','2016-11-21','2016-11-21'),(8,'architecture','2016-11-21','2016-11-21'),(9,'cinema','2016-11-21','2016-11-21'),(10,'rugby','2016-11-21','2016-11-21'),(11,'tennis','2016-11-21','2016-11-21'),(12,'fraise','2016-11-21','2016-11-21'),(13,'nutella','2016-11-21','2016-11-21'),(14,'caviar','2016-11-21','2016-11-21'),(15,'food','2016-11-21','2016-11-21'),(16,'porn','2016-11-21','2016-11-21'),(17,'basket','2016-11-21','2016-11-21'),(18,'Television','2016-11-21','2016-11-21'),(19,'loto','2016-11-21','2016-11-21'),(20,'billard','2016-11-21','2016-11-21'),(21,'poker','2016-11-21','2016-11-21'),(22,'politic','2016-11-21','2016-11-21'),(23,'mexican','2016-11-21','2016-11-21'),(24,'america','2016-11-21','2016-11-21'),(25,'football','2016-11-21','2016-11-21'),(26,'sport','2016-11-21','2016-11-21'),(27,'google','2016-11-21','2016-11-21'),(28,'brad','2016-11-21','2016-11-21'),(29,'chocolat','2016-11-21','2016-11-21'),(30,'test',NULL,NULL),(31,'haha',NULL,NULL);
/*!40000 ALTER TABLE `interests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matched`
--

DROP TABLE IF EXISTS `matched`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `matched` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_author` int(11) NOT NULL,
  `id_receiver` int(11) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `connected` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_author` (`id_author`),
  KEY `id_receiver` (`id_receiver`),
  CONSTRAINT `matched_ibfk_1` FOREIGN KEY (`id_author`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `matched_ibfk_2` FOREIGN KEY (`id_receiver`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=186 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matched`
--

LOCK TABLES `matched` WRITE;
/*!40000 ALTER TABLE `matched` DISABLE KEYS */;
INSERT INTO `matched` VALUES (184,1,3,'06/08/2017 19:30:14',0);
/*!40000 ALTER TABLE `matched` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_author` int(11) NOT NULL,
  `id_receiver` int(11) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `seen` tinyint(1) NOT NULL DEFAULT '0',
  `action_type` enum('seen','message','matched','connected','deleted') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_author` (`id_author`),
  KEY `id_receiver` (`id_receiver`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`id_author`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `notification_ibfk_2` FOREIGN KEY (`id_receiver`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (134,1,1,'06/08/2017 19:29:47',1,'matched'),(135,1,3,'06/08/2017 19:30:14',1,'matched'),(136,3,1,'06/08/2017 19:30:25',1,'connected'),(137,3,1,'06/08/2017 19:30:57',1,'deleted');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photos`
--

DROP TABLE IF EXISTS `photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `photo_link` varchar(255) NOT NULL,
  `id_user` int(11) NOT NULL,
  `created_at` date DEFAULT NULL,
  `isProfil` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photos`
--

LOCK TABLES `photos` WRITE;
/*!40000 ALTER TABLE `photos` DISABLE KEYS */;
INSERT INTO `photos` VALUES (96,'content/1-1481203318750.AAEAAQAAAAAAAAWJAAAAJDgzOTI4Njg3LTU2ODYtNDk1YS1iNzAxLWUwMjY2ZjNkM2FlZg.jpg',1,NULL,1),(98,'content/3-1481039254194.1-1480487620292.alexa.jpg',3,NULL,0),(99,'content/3-1481039259352.1-1480519757931.nadege.jpg',3,NULL,0),(100,'content/3-1481039271162.1-1480601593854.mara.jpg',3,NULL,0),(101,'content/3-1481039278596.1-1480520161484.Helene.jpg',3,NULL,1),(102,'content/4-1481039427671.1-1480487620292.ophelie.jpg',4,NULL,1),(103,'content/4-1481039441424.1-1480487620292.ophelie.jpg',4,NULL,0),(104,'content/4-1481039441425.1-1480487620293.nadege.jpg',4,NULL,0),(105,'content/4-1481039441425.1-1480488050057.mara.jpg',4,NULL,0),(106,'content/4-1481039441426.1-1480488050060.alexa.jpg',4,NULL,0),(108,'content/5-1481039733897.1-1480512040862.Valerie.jpg',5,NULL,1),(109,'content/6-1481041073089.kobe-bryant-gma__oPt.jpg',6,NULL,1),(110,'content/8-1481041398115.25064768benjamin-castaldi-0005-benjamin-castaldi05-jpg.jpg',8,NULL,1),(111,'content/9-1481041476689.donald-trump.jpg',9,NULL,1),(112,'content/10-1481041616555.840727-zinedine-zidane-le-nouvel-entraineur-du-real-madrid-en-conference-de-presse-le-5-janvier-2016-au-sta.jpg',10,NULL,1),(113,'content/7-1481041701818.1250530894_brad_pitt_290x402.jpg',7,NULL,1),(114,'content/11-1481212944305.MTE5NDg0MDU1MDE2MDgwOTEx.jpg',11,NULL,1),(115,'content/11-1481212947624.rs_634x899-150924125002-634-angelina-jolie-beauty-092415.jpg',11,NULL,0),(116,'content/12-1481213054047.calvin-harris-defends-girlfriend-taylor-swift-in-twitter-feud-over-spotify-profits.jpg',12,NULL,1),(117,'content/12-1481213058603.calvin-harris-defends-girlfriend-taylor-swift-in-twitter-feud-over-spotify-profits.jpg',12,NULL,0);
/*!40000 ALTER TABLE `photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reported`
--

DROP TABLE IF EXISTS `reported`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reported` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_author` int(11) NOT NULL,
  `id_receiver` int(11) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_author` (`id_author`),
  KEY `id_receiver` (`id_receiver`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reported`
--

LOCK TABLES `reported` WRITE;
/*!40000 ALTER TABLE `reported` DISABLE KEYS */;
INSERT INTO `reported` VALUES (1,1,5,'06/01/2017 18:51:01'),(2,3,1,'06/03/2017 16:54:25');
/*!40000 ALTER TABLE `reported` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seen`
--

DROP TABLE IF EXISTS `seen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `seen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_author` int(11) NOT NULL,
  `id_receiver` int(11) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `seen` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id_author` (`id_author`),
  KEY `id_receiver` (`id_receiver`),
  CONSTRAINT `seen_ibfk_1` FOREIGN KEY (`id_author`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `seen_ibfk_2` FOREIGN KEY (`id_receiver`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=291 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seen`
--

LOCK TABLES `seen` WRITE;
/*!40000 ALTER TABLE `seen` DISABLE KEYS */;
INSERT INTO `seen` VALUES (153,12,1,'06/03/2017 14:37:28',0),(154,4,1,'06/03/2017 14:37:54',0),(155,3,1,'06/03/2017 14:39:19',0),(156,6,1,'06/03/2017 14:39:46',0),(157,10,1,'06/03/2017 14:40:46',0),(158,1,12,'06/03/2017 15:47:40',0),(159,1,5,'06/03/2017 15:54:36',0),(160,1,11,'06/03/2017 15:54:56',0),(161,1,4,'06/03/2017 15:55:00',0),(162,1,9,'06/03/2017 15:55:24',0),(163,3,1,'06/03/2017 16:54:18',0),(164,3,1,'06/03/2017 16:54:40',0),(165,4,1,'06/03/2017 16:55:29',0),(166,1,5,'06/03/2017 19:01:37',0),(167,1,5,'06/03/2017 19:02:12',0),(168,1,5,'06/03/2017 19:03:26',0),(169,1,5,'06/03/2017 19:04:54',0),(170,1,5,'06/03/2017 19:05:03',0),(171,1,5,'06/03/2017 19:05:06',0),(172,1,5,'06/03/2017 19:05:53',0),(173,1,5,'06/03/2017 19:07:20',0),(174,3,5,'06/03/2017 19:21:09',0),(175,3,5,'06/03/2017 19:21:15',0),(176,1,5,'06/03/2017 19:42:00',0),(177,1,5,'06/03/2017 19:46:51',0),(178,1,5,'06/03/2017 19:47:12',0),(179,1,5,'06/03/2017 19:47:51',0),(180,1,5,'06/03/2017 19:49:47',0),(181,1,5,'06/03/2017 19:50:28',0),(182,1,5,'06/03/2017 19:53:56',0),(183,1,5,'06/03/2017 19:56:51',0),(184,1,3,'06/03/2017 20:16:36',0),(185,1,3,'06/03/2017 20:21:04',0),(186,1,3,'06/03/2017 20:24:49',0),(187,1,3,'06/03/2017 20:28:30',0),(188,1,5,'06/03/2017 20:35:50',0),(189,1,5,'06/03/2017 20:38:06',0),(190,20,1,'06/04/2017 01:10:40',0),(191,1,4,'06/04/2017 01:14:22',0),(192,20,1,'06/04/2017 02:27:43',0),(193,1,4,'06/04/2017 02:34:18',0),(194,1,4,'06/04/2017 02:35:52',0),(195,1,3,'06/04/2017 15:46:52',0),(196,1,3,'06/04/2017 15:51:49',0),(197,1,3,'06/04/2017 15:53:21',0),(198,1,3,'06/04/2017 15:54:06',0),(199,1,3,'06/04/2017 15:54:25',0),(200,1,11,'06/04/2017 15:54:38',0),(201,1,11,'06/04/2017 15:54:45',0),(202,1,12,'06/04/2017 15:54:52',0),(203,1,12,'06/04/2017 15:54:58',0),(204,1,12,'06/04/2017 15:56:12',0),(205,1,3,'06/04/2017 15:56:19',0),(206,20,3,'06/04/2017 15:56:54',0),(207,20,3,'06/04/2017 15:59:10',0),(208,20,3,'06/04/2017 16:00:24',0),(209,20,3,'06/04/2017 16:00:40',0),(210,1,3,'06/04/2017 16:01:17',0),(211,1,3,'06/04/2017 16:01:33',0),(212,20,3,'06/04/2017 16:01:50',0),(213,20,3,'06/04/2017 16:02:02',0),(214,1,3,'06/04/2017 16:02:36',0),(215,20,3,'06/04/2017 16:02:48',0),(216,20,3,'06/04/2017 16:03:17',0),(217,20,3,'06/04/2017 16:04:06',0),(218,20,3,'06/04/2017 16:04:15',0),(219,20,3,'06/04/2017 16:04:36',0),(220,1,5,'06/07/2017 00:03:33',0),(221,1,9,'06/07/2017 00:18:09',0),(222,1,11,'06/07/2017 00:56:12',0),(223,1,11,'06/07/2017 01:06:15',0),(224,1,11,'06/08/2017 15:48:35',0),(225,1,11,'06/08/2017 15:48:38',0),(226,1,11,'06/08/2017 15:49:35',0),(227,1,11,'06/08/2017 15:49:50',0),(228,1,11,'06/08/2017 15:49:59',0),(229,1,11,'06/08/2017 15:55:05',0),(230,1,11,'06/08/2017 16:00:09',0),(231,1,11,'06/08/2017 16:00:14',0),(232,1,11,'06/08/2017 16:00:29',0),(233,1,11,'06/08/2017 16:02:06',0),(234,11,1,'06/08/2017 16:02:41',0),(235,11,1,'06/08/2017 16:02:45',0),(236,1,11,'06/08/2017 16:03:36',0),(237,1,11,'06/08/2017 16:04:09',0),(238,1,11,'06/08/2017 16:07:01',0),(239,11,1,'06/08/2017 16:07:05',0),(240,1,11,'06/08/2017 16:09:53',0),(241,1,11,'06/08/2017 16:10:24',0),(242,11,1,'06/08/2017 16:10:28',0),(243,3,1,'06/08/2017 16:12:35',0),(244,1,11,'06/08/2017 16:12:41',0),(245,1,11,'06/08/2017 16:15:15',0),(246,1,3,'06/08/2017 16:15:21',0),(247,3,1,'06/08/2017 16:15:32',0),(248,3,1,'06/08/2017 16:17:33',0),(249,3,1,'06/08/2017 16:19:14',0),(250,1,3,'06/08/2017 16:19:18',0),(251,3,1,'06/08/2017 16:20:30',0),(252,1,3,'06/08/2017 16:20:35',0),(253,1,3,'06/08/2017 16:22:34',0),(254,3,1,'06/08/2017 16:22:40',0),(255,1,3,'06/08/2017 16:24:54',0),(256,3,1,'06/08/2017 16:25:02',0),(257,1,3,'06/08/2017 16:25:21',0),(258,3,1,'06/08/2017 16:26:19',0),(259,3,1,'06/08/2017 16:26:30',0),(260,1,3,'06/08/2017 16:26:32',0),(261,3,1,'06/08/2017 17:53:48',0),(262,1,12,'06/08/2017 17:58:18',0),(263,3,1,'06/08/2017 18:44:09',0),(264,1,3,'06/08/2017 18:44:23',0),(265,3,1,'06/08/2017 18:45:28',0),(266,3,1,'06/08/2017 18:45:46',0),(267,1,3,'06/08/2017 18:45:50',0),(268,1,3,'06/08/2017 18:55:56',0),(269,3,1,'06/08/2017 18:56:00',0),(270,3,1,'06/08/2017 19:08:39',0),(271,3,1,'06/08/2017 19:08:52',0),(272,1,3,'06/08/2017 19:09:04',0),(273,1,3,'06/08/2017 19:09:06',0),(274,1,3,'06/08/2017 19:09:13',0),(275,1,3,'06/08/2017 19:09:51',0),(276,3,1,'06/08/2017 19:09:57',0),(277,3,1,'06/08/2017 19:11:49',0),(278,1,3,'06/08/2017 19:12:00',0),(279,1,3,'06/08/2017 19:13:04',0),(280,3,1,'06/08/2017 19:13:12',0),(281,3,1,'06/08/2017 19:30:23',0),(282,3,1,'06/08/2017 19:30:27',0),(283,1,3,'06/08/2017 19:47:19',0),(284,1,3,'06/08/2017 19:47:28',0),(285,1,3,'06/08/2017 19:47:52',0),(286,3,1,'06/08/2017 19:49:05',0),(287,1,3,'06/08/2017 19:49:14',0),(288,3,1,'06/08/2017 19:49:18',0),(289,3,1,'06/08/2017 19:49:19',0),(290,3,1,'06/08/2017 19:49:27',0);
/*!40000 ALTER TABLE `seen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `country` varchar(255) DEFAULT NULL,
  `popularity` int(11) DEFAULT '0',
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` varchar(255) DEFAULT NULL,
  `connected` tinyint(1) NOT NULL DEFAULT '0',
  `offline_since` varchar(255) DEFAULT NULL,
  `created_at` varchar(255) DEFAULT NULL,
  `active_since` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Googole@gmail.com','Zane','Anis','Titi','$2a$10$sgWlckIeEsn/G8yKeJ/lF.iULBfEfq6qViFVDi61sRKD2IW1v5lxq','m','Hetero','23/02/1994','ojdowdwqopjdwqopqwjdqwopdqwjdqw',48.8967,2.31828,'Paris',75017,'France',0,NULL,NULL,1,'NULL','05/21/2017 15:15:42','06/08/2017 20:23:35'),(3,'thelene@gmail.com','tamere','Helene','thelene','$2a$10$j6zhV5zc1S13Q1d1eX/bVOAObYY8IyaBcuv.u1vW2iHv3xI/AYhUK','f','Hetero','21/05/1996','Test est la vie',48.8967,2.31827,'Paris',75017,'France',0,NULL,NULL,0,'06/08/2017 20:15:05','05/21/2017 15:15:42','NULL'),(4,'tamandine@gmail.com','therese','amandine','tamandine','$2a$10$.OD.AzrNwtaQ/N.7s3I/6e94LleXdL9Tqd07MYqPDrcBAcafwLb5m','f','Homo','28/12/1995','la vie est chiante',48.892,2.31929,'Paris',75017,'France',0,NULL,NULL,0,'06/04/2017 02:35:40','05/21/2017 15:15:42','NULL'),(5,'tsarah@gmail.com','trista','sarah','tsarah','$2a$10$OBTcYk4WXgU6/Pxs9FgHkeQwwwEiA1F5WPWj6AW5AAMKf1CmF85He','f','Hetero','21/02/1995','j\'aime manger',48.8995,2.31762,'Clichy',92110,'France',0,NULL,NULL,0,'05/27/2017 14:45:21','05/21/2017 15:15:42','NULL'),(6,'bkobe@gmail.com','bryant','kobe','bkobe','$2a$10$3SyGtp/j6U8krupMyFqcueN/4nho4EKTSmjw3Q.zS4RdlVRV9j3pa','m','Homo','21/02/1980','basketball forever',48.8967,2.31833,'Paris',75017,'France',0,NULL,NULL,0,'06/03/2017 14:39:50','05/21/2017 15:15:42','NULL'),(7,'pbrad@gmail.com','pitt','brad','pbrad','$2a$10$ZuLeZj2Cax39/yPoeguTdOXUW7DRXCwT9eRHd533Oedc5UJc25Pae','m','Hetero','21/02/1992','Angelina m\'a quitté :(',48.8719,2.36617,'Paris',75010,'France',0,NULL,NULL,0,NULL,'05/21/2017 15:15:42',NULL),(8,'cbenjamin@gmail.com','castaldi','benjamin','cbenjamin','$2a$10$rliK954tjOi.MzddHAPqxuX1NMmS21l0FrBBCjNoSpqDU9NF0Z0Im','m','Hetero','21/02/1988','Tentez de remporter le jackpot tous les jours a 21h45 sur bravolot',48.8718,2.36618,'Paris',75010,'France',0,NULL,NULL,0,NULL,'05/21/2017 15:15:42',NULL),(9,'tdonald','trump','donald','tdonald','$2a$10$tO0ebRu7jGAw4kNhhY.STOIcxfopZLiaUS3nWHONGHbjkygdjY/vq','m','Homo','21/02/1945','make America great again',43.6122,4.88068,'Saint-Martin-de-Crau',13310,'France',0,NULL,NULL,0,NULL,'05/21/2017 15:15:42',NULL),(10,'zzineddine@gmail.com','zidane','zineddine','zizou','$2a$10$RWz/jZ1gMVXxs7vYatr.B.UvRYOB1/MzCZn9GwLz36ghTaaBlBKZm','m','Hetero','21/03/1994','Football is Football',48.8967,2.31843,'Paris',75017,'France',0,NULL,NULL,0,'06/03/2017 14:40:48','05/21/2017 15:15:42','NULL'),(11,'mzane@student.42.fr','jolie','angelina','jangelina','$2a$10$Bo3aXQlNuwhNXyCCO0EVZ.Xho7NyvXdLjVCanVyY.8VfL21Ammy/6','f','Hetero','14/12/1995','I\'m free',48.9068,2.31491,'Clichy',92110,'France',0,NULL,NULL,1,'NULL','05/21/2017 15:15:42','06/08/2017 16:12:02'),(12,'tsarah@gmail.com','swift','taylor','tswift','$2a$10$4SOA8OCFVYhU28LdJNV93umKXFlmdMrvXY87VQFLMQuWif4ZOIRIO','f','Hetero','30/12/1990',NULL,48.8967,2.31825,'Paris',75017,'France',0,NULL,NULL,0,'06/03/2017 14:37:32','05/21/2017 15:15:42','NULL'),(13,'hello','hello','hello','hello','$2a$10$IMuzBDaE8cNPnMsVKBWECe6uBZkb40j28MElA/yj4aQ6YTYqBaK.m',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,0,NULL,'05/21/2017 15:15:42',NULL),(14,'mzane@student.42.fr','Belaid','Ines','ibelaid','$2a$10$FDGJFbUzS3jjjmps0QTKX.3jyUgx2jO9zMDUu4U1sU6V.4Q106jh.',NULL,NULL,NULL,NULL,48.8967,2.31832,'Paris',75017,'France',0,NULL,NULL,0,'06/03/2017 16:55:08','05/21/2017 15:15:42','NULL'),(15,'dw','dodo','anis','fd','$2a$10$loH1mHOeyt5.oU5QRXjLKerO1GsD3yOsFug7rGu/t1YSTDPDtKGJ.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,50,NULL,NULL,0,NULL,'06/04/2017 00:32:59',NULL),(16,'anis@bubblz.net','zane','anis','mzane','$2a$10$y6a1.RVV0wgBI0iv6bSkPO01YAb0nsP9gLzHzhdayaWAilLFqEWOO',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,50,NULL,NULL,0,NULL,'06/04/2017 00:34:00',NULL),(17,'mzane@student.42.fr','zane','anis','dwjqjwqdoijqwijdwqojddqwjdqiowjqwdio','$2a$10$neJDG7VLsR2KNniZMlG4Feg3UWIknWd/PXQIEw.CetBDTmokCPMoW',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,50,NULL,NULL,0,NULL,'06/04/2017 00:42:09',NULL),(18,'anis@bubblz.net','Anis','Zane','anis','$2a$10$NdSVGYqFJTXaw3pllUDh9OcwCtn2mVnqbF..i75snb5goyNlnpIpe',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,50,NULL,NULL,0,NULL,'06/04/2017 00:42:41',NULL),(19,'mzane@student.42.fr','Anis','Zane','fofo','$2a$10$RybupV9xo1WttSkD.k68lueSLGAZDa81W61Z3T3zAmzwvWCCVrfD.',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,50,NULL,NULL,0,NULL,'06/04/2017 00:44:33',NULL),(20,'toto@toto.com','zane','anis','tototo','$2a$10$uW3xKk3ztfq0vSCFieWpU.8PtedZnxGKb6lgBaTQT69UvnhteWHQq',NULL,NULL,NULL,NULL,48.8967,2.31826,'Paris',75017,'France',50,NULL,NULL,1,'NULL','06/04/2017 00:47:03','06/04/2017 16:58:34');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersinterests`
--

DROP TABLE IF EXISTS `usersinterests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usersinterests` (
  `id_user` int(11) NOT NULL,
  `id_interest` int(11) NOT NULL,
  PRIMARY KEY (`id_user`,`id_interest`),
  KEY `id_interest` (`id_interest`),
  CONSTRAINT `usersinterests_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usersinterests_ibfk_2` FOREIGN KEY (`id_interest`) REFERENCES `interests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersinterests`
--

LOCK TABLES `usersinterests` WRITE;
/*!40000 ALTER TABLE `usersinterests` DISABLE KEYS */;
INSERT INTO `usersinterests` VALUES (3,6),(3,7),(4,7),(7,7),(10,7),(3,8),(3,9),(4,9),(7,9),(11,9),(12,9),(4,10),(10,10),(4,11),(6,11),(5,12),(12,12),(5,13),(5,14),(5,15),(6,15),(5,16),(6,16),(9,16),(12,16),(6,17),(8,18),(8,19),(8,20),(8,21),(9,22),(9,23),(9,24),(10,25),(11,25),(10,26),(11,27),(11,28),(12,29),(1,30),(1,31);
/*!40000 ALTER TABLE `usersinterests` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-06-08 20:31:28
