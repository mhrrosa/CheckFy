-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: checkfy
-- ------------------------------------------------------
-- Server version	8.0.30

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
-- Table structure for table `atividade`
--

DROP TABLE IF EXISTS `atividade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atividade` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Descricao` varchar(100) NOT NULL,
  `ID_Responsavel` int NOT NULL,
  `ID_Corresponsavel` int DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `atividade_FK` (`ID_Responsavel`),
  KEY `atividade_FK_1` (`ID_Corresponsavel`),
  CONSTRAINT `atividade_FK` FOREIGN KEY (`ID_Responsavel`) REFERENCES `funcao_usuario` (`ID`),
  CONSTRAINT `atividade_FK_1` FOREIGN KEY (`ID_Corresponsavel`) REFERENCES `funcao_usuario` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `atividade`
--

LOCK TABLES `atividade` WRITE;
/*!40000 ALTER TABLE `atividade` DISABLE KEYS */;
INSERT INTO `atividade` VALUES (1,'Teste atividade',1,1),(2,'Atividade 2',1,1),(3,'Atividade 3',1,1);
/*!40000 ALTER TABLE `atividade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avaliacao`
--

DROP TABLE IF EXISTS `avaliacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacao` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(75) NOT NULL,
  `Descricao` varchar(150) NOT NULL,
  `ID_Avaliador_Lider` int DEFAULT NULL,
  `Status` varchar(15) NOT NULL,
  `ID_Atividade` int DEFAULT NULL,
  `ID_Empresa` int NOT NULL,
  `ID_Nivel_Solicitado` int NOT NULL,
  `ID_Nivel_Atribuido` int DEFAULT NULL,
  `Parecer_Nivel_Final` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `avaliacao_FK` (`ID_Atividade`),
  KEY `avaliacao_FK_1` (`ID_Avaliador_Lider`),
  KEY `avaliacao_FK_2` (`ID_Nivel_Atribuido`),
  KEY `projeto_empresa_FK` (`ID_Empresa`),
  KEY `projeto_nivel_FK` (`ID_Nivel_Solicitado`),
  CONSTRAINT `avaliacao_FK` FOREIGN KEY (`ID_Atividade`) REFERENCES `atividade` (`ID`),
  CONSTRAINT `avaliacao_FK_1` FOREIGN KEY (`ID_Avaliador_Lider`) REFERENCES `usuario` (`ID`),
  CONSTRAINT `avaliacao_FK_2` FOREIGN KEY (`ID_Nivel_Atribuido`) REFERENCES `nivel_maturidade_mpsbr` (`ID`),
  CONSTRAINT `projeto_empresa_FK` FOREIGN KEY (`ID_Empresa`) REFERENCES `empresa` (`ID`),
  CONSTRAINT `projeto_nivel_FK` FOREIGN KEY (`ID_Nivel_Solicitado`) REFERENCES `nivel_maturidade_mpsbr` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacao`
--

LOCK TABLES `avaliacao` WRITE;
/*!40000 ALTER TABLE `avaliacao` DISABLE KEYS */;
INSERT INTO `avaliacao` VALUES (9,'Avaliação de teste 1','Primeiro Teste de Inserção',1,'Em andamento',3,1,49,NULL,NULL),(12,'aa','bb',1,'Em andamento',1,1,43,NULL,NULL),(13,'aa','bb',1,'Em andamento',1,1,43,NULL,NULL);
/*!40000 ALTER TABLE `avaliacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documento`
--

DROP TABLE IF EXISTS `documento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documento` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Caminho_Arquivo` varchar(100) NOT NULL,
  `Nome_Arquivo` varchar(100) DEFAULT NULL,
  `ID_Projeto` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `documento_FK` (`ID_Projeto`),
  CONSTRAINT `documento_FK` FOREIGN KEY (`ID_Projeto`) REFERENCES `projeto` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documento`
--

LOCK TABLES `documento` WRITE;
/*!40000 ALTER TABLE `documento` DISABLE KEYS */;
INSERT INTO `documento` VALUES (27,'Tabela em Pontos - AT.pdf','Projeto 1',57),(28,'Guia-Geral-MPS-de-Software-2023.pdf','Projeto 2',59);
/*!40000 ALTER TABLE `documento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresa`
--

DROP TABLE IF EXISTS `empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresa` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(100) NOT NULL,
  `Cnpj` varchar(14) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresa`
--

LOCK TABLES `empresa` WRITE;
/*!40000 ALTER TABLE `empresa` DISABLE KEYS */;
INSERT INTO `empresa` VALUES (1,'Realiza','0745213568');
/*!40000 ALTER TABLE `empresa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcao_usuario`
--

DROP TABLE IF EXISTS `funcao_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcao_usuario` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Funcao_Usuario` varchar(100) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcao_usuario`
--

LOCK TABLES `funcao_usuario` WRITE;
/*!40000 ALTER TABLE `funcao_usuario` DISABLE KEYS */;
INSERT INTO `funcao_usuario` VALUES (1,'A');
/*!40000 ALTER TABLE `funcao_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grau_implementacao_processo_projeto`
--

DROP TABLE IF EXISTS `grau_implementacao_processo_projeto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grau_implementacao_processo_projeto` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Nota` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ID_Resultado_Esperado` int NOT NULL,
  `ID_Projeto` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `grau_implementacao_processo_projeto_FK` (`ID_Projeto`),
  KEY `grau_implementacao_processo_projeto_FK_1` (`ID_Resultado_Esperado`),
  CONSTRAINT `grau_implementacao_processo_projeto_FK` FOREIGN KEY (`ID_Projeto`) REFERENCES `projeto` (`ID`),
  CONSTRAINT `grau_implementacao_processo_projeto_FK_1` FOREIGN KEY (`ID_Resultado_Esperado`) REFERENCES `resultado_esperado_mpsbr` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grau_implementacao_processo_projeto`
--

LOCK TABLES `grau_implementacao_processo_projeto` WRITE;
/*!40000 ALTER TABLE `grau_implementacao_processo_projeto` DISABLE KEYS */;
/*!40000 ALTER TABLE `grau_implementacao_processo_projeto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grau_implementacao_unidade_organizacional`
--

DROP TABLE IF EXISTS `grau_implementacao_unidade_organizacional`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grau_implementacao_unidade_organizacional` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ID_Resultado_Esperado` int NOT NULL,
  `Nota` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ID_Projeto` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `grau_implementacao_unidade_organizacional_FK` (`ID_Projeto`),
  KEY `grau_implementacao_unidade_organizacional_FK_1` (`ID_Resultado_Esperado`),
  CONSTRAINT `grau_implementacao_unidade_organizacional_FK` FOREIGN KEY (`ID_Projeto`) REFERENCES `projeto` (`ID`),
  CONSTRAINT `grau_implementacao_unidade_organizacional_FK_1` FOREIGN KEY (`ID_Resultado_Esperado`) REFERENCES `resultado_esperado_mpsbr` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grau_implementacao_unidade_organizacional`
--

LOCK TABLES `grau_implementacao_unidade_organizacional` WRITE;
/*!40000 ALTER TABLE `grau_implementacao_unidade_organizacional` DISABLE KEYS */;
/*!40000 ALTER TABLE `grau_implementacao_unidade_organizacional` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `indicador`
--

DROP TABLE IF EXISTS `indicador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `indicador` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ID_Resultado_Esperado` int NOT NULL,
  `ID_Documento` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `indicador_FK` (`ID_Documento`),
  KEY `indicador_FK_1` (`ID_Resultado_Esperado`),
  CONSTRAINT `indicador_FK` FOREIGN KEY (`ID_Documento`) REFERENCES `documento` (`ID`),
  CONSTRAINT `indicador_FK_1` FOREIGN KEY (`ID_Resultado_Esperado`) REFERENCES `resultado_esperado_mpsbr` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `indicador`
--

LOCK TABLES `indicador` WRITE;
/*!40000 ALTER TABLE `indicador` DISABLE KEYS */;
INSERT INTO `indicador` VALUES (5,8,27),(6,10,28);
/*!40000 ALTER TABLE `indicador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nivel_maturidade_mpsbr`
--

DROP TABLE IF EXISTS `nivel_maturidade_mpsbr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nivel_maturidade_mpsbr` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Nivel` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nivel_maturidade_mpsbr`
--

LOCK TABLES `nivel_maturidade_mpsbr` WRITE;
/*!40000 ALTER TABLE `nivel_maturidade_mpsbr` DISABLE KEYS */;
INSERT INTO `nivel_maturidade_mpsbr` VALUES (43,'A'),(44,'B'),(45,'C'),(46,'D'),(49,'E'),(51,'G'),(52,'F');
/*!40000 ALTER TABLE `nivel_maturidade_mpsbr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `processo`
--

DROP TABLE IF EXISTS `processo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `processo` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Descricao` varchar(100) NOT NULL,
  `Tipo` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `processo`
--

LOCK TABLES `processo` WRITE;
/*!40000 ALTER TABLE `processo` DISABLE KEYS */;
INSERT INTO `processo` VALUES (23,'Processo','REQ'),(24,'teste','AQU'),(25,'Processo','Abs');
/*!40000 ALTER TABLE `processo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projeto`
--

DROP TABLE IF EXISTS `projeto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projeto` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ID_Avaliacao` int NOT NULL,
  `Projeto_Habilitado` tinyint(1) NOT NULL,
  `Numero_Projeto` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `projeto_avaliacao_FK` (`ID_Avaliacao`),
  CONSTRAINT `projeto_avaliacao_FK` FOREIGN KEY (`ID_Avaliacao`) REFERENCES `avaliacao` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projeto`
--

LOCK TABLES `projeto` WRITE;
/*!40000 ALTER TABLE `projeto` DISABLE KEYS */;
INSERT INTO `projeto` VALUES (57,9,1,1),(59,9,1,2);
/*!40000 ALTER TABLE `projeto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resultado_esperado_mpsbr`
--

DROP TABLE IF EXISTS `resultado_esperado_mpsbr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resultado_esperado_mpsbr` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Descricao` varchar(100) NOT NULL,
  `ID_Nivel_Intervalo_Fim` int NOT NULL,
  `ID_Nivel_Intervalo_Inicio` int NOT NULL,
  `ID_Processo` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `resultado_esperado_mpsbr_FK` (`ID_Processo`),
  KEY `resultado_esperado_mpsbr_FK_1` (`ID_Nivel_Intervalo_Inicio`),
  KEY `resultado_esperado_mpsbr_FK_2` (`ID_Nivel_Intervalo_Fim`),
  CONSTRAINT `resultado_esperado_mpsbr_FK` FOREIGN KEY (`ID_Processo`) REFERENCES `processo` (`ID`),
  CONSTRAINT `resultado_esperado_mpsbr_FK_1` FOREIGN KEY (`ID_Nivel_Intervalo_Inicio`) REFERENCES `nivel_maturidade_mpsbr` (`ID`),
  CONSTRAINT `resultado_esperado_mpsbr_FK_2` FOREIGN KEY (`ID_Nivel_Intervalo_Fim`) REFERENCES `nivel_maturidade_mpsbr` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resultado_esperado_mpsbr`
--

LOCK TABLES `resultado_esperado_mpsbr` WRITE;
/*!40000 ALTER TABLE `resultado_esperado_mpsbr` DISABLE KEYS */;
INSERT INTO `resultado_esperado_mpsbr` VALUES (8,'Teste 1',43,51,23),(9,'GCO 1 - Itens de configuração são identificados e seus níveis de controle são estabelecidos',43,51,23),(10,'Aquisição de sistema',43,51,24);
/*!40000 ALTER TABLE `resultado_esperado_mpsbr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_usuario`
--

DROP TABLE IF EXISTS `tipo_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_usuario` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Descricao` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_usuario`
--

LOCK TABLES `tipo_usuario` WRITE;
/*!40000 ALTER TABLE `tipo_usuario` DISABLE KEYS */;
INSERT INTO `tipo_usuario` VALUES (1,'teste');
/*!40000 ALTER TABLE `tipo_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(75) NOT NULL,
  `ID_Tipo` int NOT NULL,
  `Senha` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `usuario_FK` (`ID_Tipo`),
  CONSTRAINT `usuario_FK` FOREIGN KEY (`ID_Tipo`) REFERENCES `tipo_usuario` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Avaliador teste',1,'teste','teste');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios_projeto`
--

DROP TABLE IF EXISTS `usuarios_projeto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_projeto` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `ID_Projeto` int DEFAULT NULL,
  `ID_Usuario` int NOT NULL,
  `ID_Funcao` int NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `usuarios_projeto_FK` (`ID_Usuario`),
  KEY `usuarios_projeto_FK_1` (`ID_Funcao`),
  KEY `usuarios_projeto_FK_2` (`ID_Projeto`),
  CONSTRAINT `usuarios_projeto_FK` FOREIGN KEY (`ID_Usuario`) REFERENCES `usuario` (`ID`),
  CONSTRAINT `usuarios_projeto_FK_1` FOREIGN KEY (`ID_Funcao`) REFERENCES `funcao_usuario` (`ID`),
  CONSTRAINT `usuarios_projeto_FK_2` FOREIGN KEY (`ID_Projeto`) REFERENCES `avaliacao` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios_projeto`
--

LOCK TABLES `usuarios_projeto` WRITE;
/*!40000 ALTER TABLE `usuarios_projeto` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios_projeto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'checkfy'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-28  0:53:07
