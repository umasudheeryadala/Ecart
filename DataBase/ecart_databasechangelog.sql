-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: ecart
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `databasechangelog`
--

DROP TABLE IF EXISTS `databasechangelog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `databasechangelog` (
  `ID` varchar(255) NOT NULL,
  `AUTHOR` varchar(255) NOT NULL,
  `FILENAME` varchar(255) NOT NULL,
  `DATEEXECUTED` datetime NOT NULL,
  `ORDEREXECUTED` int NOT NULL,
  `EXECTYPE` varchar(10) NOT NULL,
  `MD5SUM` varchar(35) DEFAULT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `COMMENTS` varchar(255) DEFAULT NULL,
  `TAG` varchar(255) DEFAULT NULL,
  `LIQUIBASE` varchar(20) DEFAULT NULL,
  `CONTEXTS` varchar(255) DEFAULT NULL,
  `LABELS` varchar(255) DEFAULT NULL,
  `DEPLOYMENT_ID` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `databasechangelog`
--

LOCK TABLES `databasechangelog` WRITE;
/*!40000 ALTER TABLE `databasechangelog` DISABLE KEYS */;
INSERT INTO `databasechangelog` VALUES ('00000000000001','jhipster','config/liquibase/changelog/00000000000000_initial_schema.xml','2023-05-01 12:25:14',1,'EXECUTED','8:1a5f32270e664dee65256c5fff5c0e33','createTable tableName=jhi_user; createTable tableName=jhi_authority; createTable tableName=jhi_user_authority; addPrimaryKey tableName=jhi_user_authority; addForeignKeyConstraint baseTableName=jhi_user_authority, constraintName=fk_authority_name, ...','',NULL,'4.15.0',NULL,NULL,'2924113754'),('20230501062831-1','jhipster','config/liquibase/changelog/20230501062831_added_entity_Order.xml','2023-05-01 12:25:14',2,'EXECUTED','8:1fd5b4710982c4cb9357131431dc4dd2','createTable tableName=jhi_order','',NULL,'4.15.0',NULL,NULL,'2924113754'),('20230501062831-1-data','jhipster','config/liquibase/changelog/20230501062831_added_entity_Order.xml','2023-05-01 12:25:14',3,'EXECUTED','8:ccc16fa7bf01f0b15aa531aefebecacf','loadData tableName=jhi_order','',NULL,'4.15.0','faker',NULL,'2924113754'),('20230501062832-1','jhipster','config/liquibase/changelog/20230501062832_added_entity_OrderItem.xml','2023-05-01 12:25:14',4,'EXECUTED','8:509cc98dbc57cb9bceb0eb016cee9a0f','createTable tableName=order_item','',NULL,'4.15.0',NULL,NULL,'2924113754'),('20230501062832-1-data','jhipster','config/liquibase/changelog/20230501062832_added_entity_OrderItem.xml','2023-05-01 12:25:14',5,'EXECUTED','8:f25d736cf4f2d7fcbf7671a62d2fe05f','loadData tableName=order_item','',NULL,'4.15.0','faker',NULL,'2924113754'),('20230501062833-1','jhipster','config/liquibase/changelog/20230501062833_added_entity_OrderData.xml','2023-05-01 12:25:14',6,'EXECUTED','8:16fdc6e568591e5e2883fc3e03bab008','createTable tableName=order_data','',NULL,'4.15.0',NULL,NULL,'2924113754'),('20230501062833-1-data','jhipster','config/liquibase/changelog/20230501062833_added_entity_OrderData.xml','2023-05-01 12:25:14',7,'EXECUTED','8:6532eaad20e0a6c5a0b80ae6b6420a18','loadData tableName=order_data','',NULL,'4.15.0','faker',NULL,'2924113754'),('20230501062834-1','jhipster','config/liquibase/changelog/20230501062834_added_entity_CartItem.xml','2023-05-01 12:25:14',8,'EXECUTED','8:b4144ff8d199a236ea7b0158cbecc5e1','createTable tableName=cart_item','',NULL,'4.15.0',NULL,NULL,'2924113754'),('20230501062834-1-data','jhipster','config/liquibase/changelog/20230501062834_added_entity_CartItem.xml','2023-05-01 12:25:14',9,'EXECUTED','8:b40cc8e766a99d0afa585156cc81e316','loadData tableName=cart_item','',NULL,'4.15.0','faker',NULL,'2924113754'),('20230501062831-2','jhipster','config/liquibase/changelog/20230501062831_added_entity_constraints_Order.xml','2023-05-01 12:25:14',10,'EXECUTED','8:89a757c4fbd88f1986d9aeb2ff235ce9','addForeignKeyConstraint baseTableName=jhi_order, constraintName=fk_jhi_order__user_id, referencedTableName=jhi_user','',NULL,'4.15.0',NULL,NULL,'2924113754'),('20230501062833-2','jhipster','config/liquibase/changelog/20230501062833_added_entity_constraints_OrderData.xml','2023-05-01 12:25:14',11,'EXECUTED','8:39a887d18ce1f3e56a4f3bb40a995641','addForeignKeyConstraint baseTableName=order_data, constraintName=fk_order_data__order_id, referencedTableName=jhi_order','',NULL,'4.15.0',NULL,NULL,'2924113754'),('20230501062834-2','jhipster','config/liquibase/changelog/20230501062834_added_entity_constraints_CartItem.xml','2023-05-01 12:25:14',12,'EXECUTED','8:0e311f18db5ade9a43fe67016dd03865','addForeignKeyConstraint baseTableName=cart_item, constraintName=fk_cart_item__user_id, referencedTableName=jhi_user','',NULL,'4.15.0',NULL,NULL,'2924113754');
/*!40000 ALTER TABLE `databasechangelog` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-02 11:29:29
