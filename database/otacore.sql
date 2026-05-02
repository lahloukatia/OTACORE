-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: otacore
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `contenus`
--

DROP TABLE IF EXISTS `contenus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contenus` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `titre` varchar(200) NOT NULL,
  `type` enum('ANIME','MANGA') NOT NULL,
  `synopsis` text,
  `image_url` varchar(500) DEFAULT NULL,
  `trailer_url` varchar(500) DEFAULT NULL,
  `auteur` varchar(100) DEFAULT NULL,
  `note` decimal(3,1) DEFAULT '0.0',
  `date_sortie` year DEFAULT NULL,
  `statut` enum('EN_COURS','TERMINE') NOT NULL DEFAULT 'EN_COURS',
  `nb_saisons` int DEFAULT NULL,
  `nb_chapitres` int DEFAULT NULL,
  `duree_episode` int DEFAULT NULL,
  `age_recommande` int DEFAULT '0',
  `classification` enum('TOUT_PUBLIC','ADULTE') DEFAULT 'TOUT_PUBLIC',
  `date_ajout` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

CREATE TABLE `password_resets` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `used` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_reset_email` (`email`),
  INDEX `idx_reset_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--
-- Dumping data for table `contenus`
--

LOCK TABLES `contenus` WRITE;
/*!40000 ALTER TABLE `contenus` DISABLE KEYS */;
INSERT INTO `contenus` VALUES (1,'Demon Slayer','ANIME','Tanjiro Kamado devient chasseur de démons après que sa famille est massacrée et sa sœur transformée en démon.','https://cdn.myanimelist.net/images/anime/1286/99889.jpg','https://www.youtube.com/watch?v=VQGCKyvzIM4','Koyoharu Gotouge',4.8,2019,'EN_COURS',4,NULL,23,13,'TOUT_PUBLIC','2026-04-09 20:51:49'),(2,'Attack on Titan','ANIME','L\'humanité survit derrière des murs gigantesques pour se protéger des Titans dévastateurs.','https://cdn.myanimelist.net/images/anime/10/47347.jpg',NULL,'Hajime Isayama',5.0,2013,'TERMINE',4,NULL,24,16,'TOUT_PUBLIC','2026-04-09 20:51:49'),(3,'Jujutsu Kaisen','ANIME','Yuji Itadori avale un doigt maudit et devient l\'hôte d\'un puissant démon.','https://cdn.myanimelist.net/images/anime/1171/109222.jpg',NULL,'Gege Akutami',4.7,2020,'EN_COURS',2,NULL,24,16,'TOUT_PUBLIC','2026-04-09 20:51:49'),(4,'Death Note','ANIME','Un lycéen trouve un carnet magique qui tue toute personne dont il écrit le nom.','https://cdn.myanimelist.net/images/anime/9/9453.jpg',NULL,'Tsugumi Ohba',4.9,2006,'TERMINE',1,NULL,23,16,'TOUT_PUBLIC','2026-04-09 20:51:49'),(5,'Fullmetal Alchemist','ANIME','Deux frères alchimistes cherchent la Pierre Philosophale pour retrouver leurs corps perdus.','https://cdn.myanimelist.net/images/anime/1223/96541.jpg',NULL,'Hiromu Arakawa',4.9,2009,'TERMINE',1,NULL,24,13,'TOUT_PUBLIC','2026-04-09 20:51:49'),(6,'One Punch Man','ANIME','Saitama est un héros si puissant qu\'il vainc tous ses ennemis d\'un seul coup de poing.','https://cdn.myanimelist.net/images/anime/12/76049.jpg',NULL,'ONE',4.6,2015,'EN_COURS',2,NULL,24,13,'TOUT_PUBLIC','2026-04-09 20:51:49'),(7,'Hunter x Hunter','ANIME','Gon Freecss part à la recherche de son père, un légendaire Chasseur.','https://cdn.myanimelist.net/images/anime/11/33657.jpg',NULL,'Yoshihiro Togashi',4.8,2011,'TERMINE',1,NULL,23,13,'TOUT_PUBLIC','2026-04-09 20:51:49'),(8,'Chainsaw Man','ANIME','Denji fusionne avec son chien-démon pour devenir le Chainsaw Man et chasser les démons.','https://cdn.myanimelist.net/images/anime/1806/126216.jpg',NULL,'Tatsuki Fujimoto',4.6,2022,'EN_COURS',1,NULL,24,18,'ADULTE','2026-04-09 20:51:49'),(9,'Naruto','ANIME','Un jeune ninja rêve de devenir Hokage pour être reconnu par son village.','https://cdn.myanimelist.net/images/anime/13/17405.jpg',NULL,'Masashi Kishimoto',4.5,2002,'TERMINE',5,NULL,23,10,'TOUT_PUBLIC','2026-04-09 20:51:49'),(10,'Dragon Ball Z','ANIME','Goku et ses amis défendent la Terre contre des ennemis de plus en plus puissants.','https://cdn.myanimelist.net/images/anime/1277/142809.jpg',NULL,'Akira Toriyama',4.7,1989,'TERMINE',9,NULL,24,10,'TOUT_PUBLIC','2026-04-09 20:51:49'),(11,'One Piece','MANGA','Monkey D. Luffy part en mer pour devenir le Roi des Pirates et trouver le légendaire trésor One Piece.','https://cdn.myanimelist.net/images/manga/2/253146.jpg',NULL,'Eiichiro Oda',4.9,1997,'EN_COURS',NULL,1110,NULL,10,'TOUT_PUBLIC','2026-04-09 20:51:49'),(12,'Vinland Saga','MANGA','Thorfinn cherche à venger son père dans la Scandinavie médiévale viking.','https://cdn.myanimelist.net/images/manga/2/188925.jpg',NULL,'Makoto Yukimura',4.9,2005,'EN_COURS',NULL,200,NULL,16,'TOUT_PUBLIC','2026-04-09 20:51:49'),(13,'Berserk','MANGA','Guts, un guerrier solitaire, combat des démons dans un monde médiéval sombre.','https://cdn.myanimelist.net/images/manga/1/157897.jpg',NULL,'Kentaro Miura',5.0,1989,'EN_COURS',NULL,374,NULL,18,'ADULTE','2026-04-09 20:51:49'),(14,'Vagabond','MANGA','L\'histoire romancée de Miyamoto Musashi, le plus grand samouraï du Japon.','https://cdn.myanimelist.net/images/manga/1/259070.jpg',NULL,'Takehiko Inoue',4.9,1998,'EN_COURS',NULL,327,NULL,16,'TOUT_PUBLIC','2026-04-09 20:51:49'),(15,'Tokyo Ghoul','MANGA','Ken Kaneki devient mi-humain mi-goule après une rencontre mortelle.','https://cdn.myanimelist.net/images/manga/3/114345.jpg',NULL,'Sui Ishida',4.5,2011,'TERMINE',NULL,144,NULL,16,'TOUT_PUBLIC','2026-04-09 20:51:49'),(16,'Slam Dunk','MANGA','Hanamichi Sakuragi découvre le basketball pour impressionner une fille.','https://cdn.myanimelist.net/images/manga/3/264199.jpg',NULL,'Takehiko Inoue',4.8,1990,'TERMINE',NULL,276,NULL,10,'TOUT_PUBLIC','2026-04-09 20:51:49'),(17,'Bleach','MANGA','Ichigo Kurosaki devient Shinigami pour protéger les humains des esprits maléfiques.','https://cdn.myanimelist.net/images/manga/3/234872.jpg',NULL,'Tite Kubo',4.5,2001,'TERMINE',NULL,686,NULL,13,'TOUT_PUBLIC','2026-04-09 20:51:49'),(18,'Fairy Tail','MANGA','Lucy rejoint la guilde de mages Fairy Tail et vit des aventures magiques.','https://cdn.myanimelist.net/images/manga/3/188896.jpg',NULL,'Hiro Mashima',4.3,2006,'TERMINE',NULL,545,NULL,10,'TOUT_PUBLIC','2026-04-09 20:51:49');
/*!40000 ALTER TABLE `contenus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `libelle` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `libelle` (`libelle`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (1,'Action'),(2,'Adventure'),(3,'Comedy'),(4,'Drama'),(5,'Fantasy'),(13,'Historical'),(6,'Horror'),(15,'Mecha'),(17,'Music'),(7,'Mystery'),(14,'Psychological'),(8,'Romance'),(9,'Sci-Fi'),(19,'Seinen'),(20,'Shoujo'),(18,'Shounen'),(10,'Slice of Life'),(16,'Sports'),(11,'Supernatural'),(12,'Thriller');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contenus_genres`
--

DROP TABLE IF EXISTS `contenus_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contenus_genres` (
  `contenu_id` int unsigned NOT NULL,
  `genre_id` int unsigned NOT NULL,
  PRIMARY KEY (`contenu_id`,`genre_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `contenus_genres_ibfk_1` FOREIGN KEY (`contenu_id`) REFERENCES `contenus` (`id`) ON DELETE CASCADE,
  CONSTRAINT `contenus_genres_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contenus_genres`
--

LOCK TABLES `contenus_genres` WRITE;
/*!40000 ALTER TABLE `contenus_genres` DISABLE KEYS */;
INSERT INTO `contenus_genres` VALUES (1,1),(2,1),(3,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(15,1),(17,1),(18,1),(5,2),(7,2),(9,2),(10,2),(11,2),(17,2),(18,2),(6,3),(11,3),(16,3),(1,4),(2,4),(5,4),(12,4),(16,4),(1,5),(7,5),(13,5),(18,5),(3,6),(8,6),(15,6),(2,7),(4,7),(6,9),(3,11),(8,11),(17,11),(4,12),(12,13),(14,13),(4,14),(13,14),(14,14),(15,14),(16,17),(9,18),(10,18);
/*!40000 ALTER TABLE `contenus_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateurs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `date_naissance` date NOT NULL,
  `bio` text,
  `statut` enum('MINEUR','ADULTE') NOT NULL DEFAULT 'ADULTE',
  `compte_statut` enum('ACTIF','SUSPENDU') NOT NULL DEFAULT 'ACTIF',
  `date_inscription` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateurs`
--

LOCK TABLES `utilisateurs` WRITE;
/*!40000 ALTER TABLE `utilisateurs` DISABLE KEYS */;
/*!40000 ALTER TABLE `utilisateurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification_codes`
--

DROP TABLE IF EXISTS `verification_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification_codes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `code` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification_codes`
--

LOCK TABLES `verification_codes` WRITE;
/*!40000 ALTER TABLE `verification_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `verification_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historique`
--

DROP TABLE IF EXISTS `historique`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historique` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `contenu_id` int unsigned NOT NULL,
  `date_consultation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `contenu_id` (`contenu_id`),
  CONSTRAINT `historique_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `historique_ibfk_2` FOREIGN KEY (`contenu_id`) REFERENCES `contenus` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historique`
--

LOCK TABLES `historique` WRITE;
/*!40000 ALTER TABLE `historique` DISABLE KEYS */;
/*!40000 ALTER TABLE `historique` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watch_later`
--

DROP TABLE IF EXISTS `watch_later`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watch_later` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `contenu_id` int unsigned NOT NULL,
  `statut_suivi` enum('PLANIFIE','EN_COURS','TERMINE') DEFAULT 'PLANIFIE',
  `date_ajout` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_watchlater` (`user_id`,`contenu_id`),
  KEY `contenu_id` (`contenu_id`),
  CONSTRAINT `watch_later_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `watch_later_ibfk_2` FOREIGN KEY (`contenu_id`) REFERENCES `contenus` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Dumping data for table `watch_later`
--

LOCK TABLES `watch_later` WRITE;
/*!40000 ALTER TABLE `watch_later` DISABLE KEYS */;
/*!40000 ALTER TABLE `watch_later` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-10 22:27:38