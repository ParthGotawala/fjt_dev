/*
SQLyog Community v13.1.6 (64 bit)
MySQL - 8.0.14 : Database - fjt_identity_main
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`fjt_identity_main` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */;

USE `fjt_identity_main`;

/*Table structure for table `__efmigrationshistory` */

DROP TABLE IF EXISTS `__efmigrationshistory`;

CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(95) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `__efmigrationshistory` */

insert  into `__efmigrationshistory`(`MigrationId`,`ProductVersion`) values 
('20210119072727_InitialIdentityDbMigration','3.1.6'),
('20210128103049_AddTableMigration','3.1.6'),
('20210223095330_AddTable_systemconfigrations','3.1.6'),
('20210616043730_Add_changePasswordAt_aspnetusers','3.1.6'),
('20210715060059_InitialIdentityServerConfigurationDbMigration','3.1.6'),
('20210715060145_InitialPersistedGrantDbMigration','3.1.6');

/*Table structure for table `agreement` */

DROP TABLE IF EXISTS `agreement`;

CREATE TABLE `agreement` (
  `agreementID` int(11) NOT NULL AUTO_INCREMENT,
  `agreementTypeID` int(11) NOT NULL,
  `agreementContent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `version` int(11) DEFAULT NULL,
  `system_variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `isPublished` tinyint(1) DEFAULT NULL,
  `publishedDate` datetime(6) DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL,
  `createdBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updatedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `deletedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL,
  `updatedAt` datetime(6) DEFAULT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  `agreementSubject` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createByRole` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updateByRole` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `deleteByRole` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`agreementID`),
  KEY `IX_agreement_agreementTypeID` (`agreementTypeID`),
  CONSTRAINT `FK_agreement_agreement_type_agreementTypeID` FOREIGN KEY (`agreementTypeID`) REFERENCES `agreement_type` (`agreementTypeID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `agreement` */

/*Table structure for table `agreement_type` */

DROP TABLE IF EXISTS `agreement_type`;

CREATE TABLE `agreement_type` (
  `agreementTypeID` int(11) NOT NULL AUTO_INCREMENT,
  `agreementType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL,
  `createdBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updatedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `deletedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL,
  `updatedAt` datetime(6) DEFAULT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  `templateType` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createByRole` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updateByRole` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `deleteByRole` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `purpose` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `where_used` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `displayName` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`agreementTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `agreement_type` */

/*Table structure for table `apiresourceclaims` */

DROP TABLE IF EXISTS `apiresourceclaims`;

CREATE TABLE `apiresourceclaims` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Type` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ApiResourceId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ApiResourceClaims_ApiResourceId` (`ApiResourceId`),
  CONSTRAINT `FK_ApiResourceClaims_ApiResources_ApiResourceId` FOREIGN KEY (`ApiResourceId`) REFERENCES `apiresources` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `apiresourceclaims` */

/*Table structure for table `apiresourceproperties` */

DROP TABLE IF EXISTS `apiresourceproperties`;

CREATE TABLE `apiresourceproperties` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Key` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Value` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ApiResourceId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ApiResourceProperties_ApiResourceId` (`ApiResourceId`),
  CONSTRAINT `FK_ApiResourceProperties_ApiResources_ApiResourceId` FOREIGN KEY (`ApiResourceId`) REFERENCES `apiresources` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `apiresourceproperties` */

/*Table structure for table `apiresources` */

DROP TABLE IF EXISTS `apiresources`;

CREATE TABLE `apiresources` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Enabled` tinyint(1) NOT NULL,
  `Name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DisplayName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `AllowedAccessTokenSigningAlgorithms` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ShowInDiscoveryDocument` tinyint(1) NOT NULL,
  `Created` datetime(6) NOT NULL,
  `Updated` datetime(6) DEFAULT NULL,
  `LastAccessed` datetime(6) DEFAULT NULL,
  `NonEditable` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_ApiResources_Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `apiresources` */

insert  into `apiresources`(`Id`,`Enabled`,`Name`,`DisplayName`,`Description`,`AllowedAccessTokenSigningAlgorithms`,`ShowInDiscoveryDocument`,`Created`,`Updated`,`LastAccessed`,`NonEditable`) values 
(1,1,'Q2CAPI','Q2C API',NULL,NULL,1,'2021-07-20 07:34:50.116075',NULL,NULL,0),
(2,1,'IdentityServerAPI','Identity Server API',NULL,NULL,1,'2021-07-20 07:34:50.100646',NULL,NULL,0);

/*Table structure for table `apiresourcescopes` */

DROP TABLE IF EXISTS `apiresourcescopes`;

CREATE TABLE `apiresourcescopes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Scope` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ApiResourceId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ApiResourceScopes_ApiResourceId` (`ApiResourceId`),
  CONSTRAINT `FK_ApiResourceScopes_ApiResources_ApiResourceId` FOREIGN KEY (`ApiResourceId`) REFERENCES `apiresources` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `apiresourcescopes` */

insert  into `apiresourcescopes`(`Id`,`Scope`,`ApiResourceId`) values 
(1,'Q2CReportViewer',1),
(2,'Q2CReportDesigner',1),
(3,'Q2CFrontEnd',1),
(4,'IdentityServerAPI',2);

/*Table structure for table `apiresourcesecrets` */

DROP TABLE IF EXISTS `apiresourcesecrets`;

CREATE TABLE `apiresourcesecrets` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Expiration` datetime(6) DEFAULT NULL,
  `Type` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Created` datetime(6) NOT NULL,
  `ApiResourceId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ApiResourceSecrets_ApiResourceId` (`ApiResourceId`),
  CONSTRAINT `FK_ApiResourceSecrets_ApiResources_ApiResourceId` FOREIGN KEY (`ApiResourceId`) REFERENCES `apiresources` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `apiresourcesecrets` */

insert  into `apiresourcesecrets`(`Id`,`Description`,`Value`,`Expiration`,`Type`,`Created`,`ApiResourceId`) values 
(1,NULL,'z+sjS369nANuG0V5IvaJuKEBx9u+P9hzd3xGOFaek2Y=',NULL,'SharedSecret','2021-07-20 07:34:50.116107',1);

/*Table structure for table `apiscopeclaims` */

DROP TABLE IF EXISTS `apiscopeclaims`;

CREATE TABLE `apiscopeclaims` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Type` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ScopeId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ApiScopeClaims_ScopeId` (`ScopeId`),
  CONSTRAINT `FK_ApiScopeClaims_ApiScopes_ScopeId` FOREIGN KEY (`ScopeId`) REFERENCES `apiscopes` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `apiscopeclaims` */

/*Table structure for table `apiscopeproperties` */

DROP TABLE IF EXISTS `apiscopeproperties`;

CREATE TABLE `apiscopeproperties` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Key` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Value` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ScopeId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ApiScopeProperties_ScopeId` (`ScopeId`),
  CONSTRAINT `FK_ApiScopeProperties_ApiScopes_ScopeId` FOREIGN KEY (`ScopeId`) REFERENCES `apiscopes` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `apiscopeproperties` */

/*Table structure for table `apiscopes` */

DROP TABLE IF EXISTS `apiscopes`;

CREATE TABLE `apiscopes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Enabled` tinyint(1) NOT NULL,
  `Name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DisplayName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Required` tinyint(1) NOT NULL,
  `Emphasize` tinyint(1) NOT NULL,
  `ShowInDiscoveryDocument` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_ApiScopes_Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `apiscopes` */

insert  into `apiscopes`(`Id`,`Enabled`,`Name`,`DisplayName`,`Description`,`Required`,`Emphasize`,`ShowInDiscoveryDocument`) values 
(1,1,'IdentityServerAPI','Identity Server API',NULL,0,0,1),
(2,1,'Q2CFrontEnd','Q2C Front End',NULL,0,0,1),
(3,1,'Q2CReportDesigner','Q2C Report Designer',NULL,0,0,1),
(4,1,'Q2CReportViewer','Q2C Report Viewer',NULL,0,0,1);

/*Table structure for table `aspnetroleclaims` */

DROP TABLE IF EXISTS `aspnetroleclaims`;

CREATE TABLE `aspnetroleclaims` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `RoleId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClaimType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ClaimValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetRoleClaims_RoleId` (`RoleId`),
  CONSTRAINT `FK_AspNetRoleClaims_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `aspnetroleclaims` */

/*Table structure for table `aspnetroles` */

DROP TABLE IF EXISTS `aspnetroles`;

CREATE TABLE `aspnetroles` (
  `Id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `RoleNameIndex` (`NormalizedName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `aspnetroles` */

/*Table structure for table `aspnetuserclaims` */

DROP TABLE IF EXISTS `aspnetuserclaims`;

CREATE TABLE `aspnetuserclaims` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClaimType` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ClaimValue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  KEY `IX_AspNetUserClaims_UserId` (`UserId`),
  CONSTRAINT `FK_AspNetUserClaims_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `aspnetuserclaims` */

insert  into `aspnetuserclaims`(`Id`,`UserId`,`ClaimType`,`ClaimValue`) values 
(1,'0b9fcd7c-e0b4-4eb8-8a6c-816768497f3f','name','Alice Smith'),
(2,'0b9fcd7c-e0b4-4eb8-8a6c-816768497f3f','given_name','Alice'),
(3,'0b9fcd7c-e0b4-4eb8-8a6c-816768497f3f','family_name','Smith'),
(4,'0b9fcd7c-e0b4-4eb8-8a6c-816768497f3f','email','AliceSmith@email.com'),
(5,'0b9fcd7c-e0b4-4eb8-8a6c-816768497f3f','email_verified','true'),
(6,'0b9fcd7c-e0b4-4eb8-8a6c-816768497f3f','website','http://alice.com'),
(7,'0b9fcd7c-e0b4-4eb8-8a6c-816768497f3f','address','{ \'street_address\': \'One Hacker Way\', \'locality\': \'Heidelberg\', \'postal_code\': 69118, \'country\': \'Germany\' }'),
(8,'3d43c05b-7baa-461b-aff7-25d07d6c1b1a','address','{ \'street_address\': \'One Hacker Way\', \'locality\': \'Heidelberg\', \'postal_code\': 69118, \'country\': \'Germany\' }'),
(9,'3d43c05b-7baa-461b-aff7-25d07d6c1b1a','website','http://bob.com'),
(10,'3d43c05b-7baa-461b-aff7-25d07d6c1b1a','email_verified','true'),
(11,'3d43c05b-7baa-461b-aff7-25d07d6c1b1a','email','BobSmith@email.com'),
(12,'3d43c05b-7baa-461b-aff7-25d07d6c1b1a','family_name','Smith'),
(13,'3d43c05b-7baa-461b-aff7-25d07d6c1b1a','given_name','Bob'),
(14,'3d43c05b-7baa-461b-aff7-25d07d6c1b1a','name','Bob Smith'),
(15,'3d43c05b-7baa-461b-aff7-25d07d6c1b1a','location','somewhere');

/*Table structure for table `aspnetuserlogins` */

DROP TABLE IF EXISTS `aspnetuserlogins`;

CREATE TABLE `aspnetuserlogins` (
  `LoginProvider` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProviderKey` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProviderDisplayName` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`LoginProvider`,`ProviderKey`),
  KEY `IX_AspNetUserLogins_UserId` (`UserId`),
  CONSTRAINT `FK_AspNetUserLogins_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `aspnetuserlogins` */

/*Table structure for table `aspnetuserroles` */

DROP TABLE IF EXISTS `aspnetuserroles`;

CREATE TABLE `aspnetuserroles` (
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `RoleId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`UserId`,`RoleId`),
  KEY `IX_AspNetUserRoles_RoleId` (`RoleId`),
  CONSTRAINT `FK_AspNetUserRoles_AspNetRoles_RoleId` FOREIGN KEY (`RoleId`) REFERENCES `aspnetroles` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_AspNetUserRoles_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `aspnetuserroles` */

/*Table structure for table `aspnetusers` */

DROP TABLE IF EXISTS `aspnetusers`;

CREATE TABLE `aspnetusers` (
  `Id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `UserName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedUserName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Email` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedEmail` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `EmailConfirmed` tinyint(1) NOT NULL,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `SecurityStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PhoneNumber` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PhoneNumberConfirmed` tinyint(1) NOT NULL,
  `TwoFactorEnabled` tinyint(1) NOT NULL,
  `LockoutEnd` datetime(6) DEFAULT NULL,
  `LockoutEnabled` tinyint(1) NOT NULL,
  `AccessFailedCount` int(11) NOT NULL,
  `userPasswordDigest` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `passwordHashUpdated` tinyint(1) NOT NULL,
  `isDeleted` tinyint(1) NOT NULL,
  `isSuperAdmin` tinyint(1) DEFAULT NULL,
  `changePasswordAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UserNameIndex` (`NormalizedUserName`),
  KEY `EmailIndex` (`NormalizedEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `aspnetusers` */

insert  into `aspnetusers`(`Id`,`UserName`,`NormalizedUserName`,`Email`,`NormalizedEmail`,`EmailConfirmed`,`PasswordHash`,`SecurityStamp`,`ConcurrencyStamp`,`PhoneNumber`,`PhoneNumberConfirmed`,`TwoFactorEnabled`,`LockoutEnd`,`LockoutEnabled`,`AccessFailedCount`,`userPasswordDigest`,`passwordHashUpdated`,`isDeleted`,`isSuperAdmin`,`changePasswordAt`) values 
('0b9fcd7c-e0b4-4eb8-8a6c-816768497f3f','alice','ALICE','AliceSmith@email.com','ALICESMITH@EMAIL.COM',1,'AQAAAAEAACcQAAAAEOtAhb90an3/PkavXWK0l6gctQ9S7bHhp0P5AxT51/j5xaOhh0re2ZmhTCT8KLk8Sg==','CQFPOTABTAGHADGT5QLAJHBBPMHE372V','09df8a80-7a3e-4409-925f-c02162869bfe',NULL,0,0,NULL,1,0,NULL,0,0,0,NULL),
('3d43c05b-7baa-461b-aff7-25d07d6c1b1a','bob','BOB','BobSmith@email.com','BOBSMITH@EMAIL.COM',1,'AQAAAAEAACcQAAAAEEnaLDpTqI1C+Fv2FAVKoigaOzxkVoqQ+A+TDiOB+6I+llnCXjtLl4B0qAhq7scgvw==','X4CGS5XY7APQVZOOCUTHQJWQARPPLTYP','3ef45167-7c0a-42a4-a99d-8621bcd95653',NULL,0,0,NULL,1,0,NULL,0,0,0,NULL);

/*Table structure for table `aspnetusertokens` */

DROP TABLE IF EXISTS `aspnetusertokens`;

CREATE TABLE `aspnetusertokens` (
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `LoginProvider` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`UserId`,`LoginProvider`,`Name`),
  CONSTRAINT `FK_AspNetUserTokens_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `aspnetusertokens` */

/*Table structure for table `clientclaims` */

DROP TABLE IF EXISTS `clientclaims`;

CREATE TABLE `clientclaims` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Type` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Value` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClientId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientClaims_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientClaims_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `clientclaims` */

/*Table structure for table `clientcorsorigins` */

DROP TABLE IF EXISTS `clientcorsorigins`;

CREATE TABLE `clientcorsorigins` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Origin` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClientId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientCorsOrigins_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientCorsOrigins_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `clientcorsorigins` */

insert  into `clientcorsorigins`(`Id`,`Origin`,`ClientId`) values 
(1,'http://localhost:5003',4);

/*Table structure for table `clientgranttypes` */

DROP TABLE IF EXISTS `clientgranttypes`;

CREATE TABLE `clientgranttypes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `GrantType` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClientId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientGrantTypes_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientGrantTypes_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `clientgranttypes` */

insert  into `clientgranttypes`(`Id`,`GrantType`,`ClientId`) values 
(1,'client_credentials',1),
(2,'authorization_code',4),
(3,'password',2),
(4,'hybrid',3);

/*Table structure for table `clientidprestrictions` */

DROP TABLE IF EXISTS `clientidprestrictions`;

CREATE TABLE `clientidprestrictions` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Provider` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClientId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientIdPRestrictions_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientIdPRestrictions_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `clientidprestrictions` */

/*Table structure for table `clientpostlogoutredirecturis` */

DROP TABLE IF EXISTS `clientpostlogoutredirecturis`;

CREATE TABLE `clientpostlogoutredirecturis` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `PostLogoutRedirectUri` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClientId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientPostLogoutRedirectUris_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientPostLogoutRedirectUris_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `clientpostlogoutredirecturis` */

insert  into `clientpostlogoutredirecturis`(`Id`,`PostLogoutRedirectUri`,`ClientId`) values 
(1,'http://localhost:5002/signout-callback-oidc',3),
(2,'http://localhost:5003/index.html',4);

/*Table structure for table `clientproperties` */

DROP TABLE IF EXISTS `clientproperties`;

CREATE TABLE `clientproperties` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Key` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Value` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClientId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientProperties_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientProperties_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `clientproperties` */

/*Table structure for table `clientredirecturis` */

DROP TABLE IF EXISTS `clientredirecturis`;

CREATE TABLE `clientredirecturis` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `RedirectUri` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClientId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientRedirectUris_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientRedirectUris_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `clientredirecturis` */

insert  into `clientredirecturis`(`Id`,`RedirectUri`,`ClientId`) values 
(1,'http://localhost:5002/signin-oidc',3),
(2,'http://localhost:5003/callback.html',4);

/*Table structure for table `clients` */

DROP TABLE IF EXISTS `clients`;

CREATE TABLE `clients` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Enabled` tinyint(1) NOT NULL,
  `ClientId` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProtocolType` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `RequireClientSecret` tinyint(1) NOT NULL,
  `ClientName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ClientUri` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `LogoUri` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `RequireConsent` tinyint(1) NOT NULL,
  `AllowRememberConsent` tinyint(1) NOT NULL,
  `AlwaysIncludeUserClaimsInIdToken` tinyint(1) NOT NULL,
  `RequirePkce` tinyint(1) NOT NULL,
  `AllowPlainTextPkce` tinyint(1) NOT NULL,
  `RequireRequestObject` tinyint(1) NOT NULL,
  `AllowAccessTokensViaBrowser` tinyint(1) NOT NULL,
  `FrontChannelLogoutUri` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `FrontChannelLogoutSessionRequired` tinyint(1) NOT NULL,
  `BackChannelLogoutUri` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `BackChannelLogoutSessionRequired` tinyint(1) NOT NULL,
  `AllowOfflineAccess` tinyint(1) NOT NULL,
  `IdentityTokenLifetime` int(11) NOT NULL,
  `AllowedIdentityTokenSigningAlgorithms` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `AccessTokenLifetime` int(11) NOT NULL,
  `AuthorizationCodeLifetime` int(11) NOT NULL,
  `ConsentLifetime` int(11) DEFAULT NULL,
  `AbsoluteRefreshTokenLifetime` int(11) NOT NULL,
  `SlidingRefreshTokenLifetime` int(11) NOT NULL,
  `RefreshTokenUsage` int(11) NOT NULL,
  `UpdateAccessTokenClaimsOnRefresh` tinyint(1) NOT NULL,
  `RefreshTokenExpiration` int(11) NOT NULL,
  `AccessTokenType` int(11) NOT NULL,
  `EnableLocalLogin` tinyint(1) NOT NULL,
  `IncludeJwtId` tinyint(1) NOT NULL,
  `AlwaysSendClientClaims` tinyint(1) NOT NULL,
  `ClientClaimsPrefix` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `PairWiseSubjectSalt` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Created` datetime(6) NOT NULL,
  `Updated` datetime(6) DEFAULT NULL,
  `LastAccessed` datetime(6) DEFAULT NULL,
  `UserSsoLifetime` int(11) DEFAULT NULL,
  `UserCodeType` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `DeviceCodeLifetime` int(11) NOT NULL,
  `NonEditable` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_Clients_ClientId` (`ClientId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `clients` */

insert  into `clients`(`Id`,`Enabled`,`ClientId`,`ProtocolType`,`RequireClientSecret`,`ClientName`,`Description`,`ClientUri`,`LogoUri`,`RequireConsent`,`AllowRememberConsent`,`AlwaysIncludeUserClaimsInIdToken`,`RequirePkce`,`AllowPlainTextPkce`,`RequireRequestObject`,`AllowAccessTokensViaBrowser`,`FrontChannelLogoutUri`,`FrontChannelLogoutSessionRequired`,`BackChannelLogoutUri`,`BackChannelLogoutSessionRequired`,`AllowOfflineAccess`,`IdentityTokenLifetime`,`AllowedIdentityTokenSigningAlgorithms`,`AccessTokenLifetime`,`AuthorizationCodeLifetime`,`ConsentLifetime`,`AbsoluteRefreshTokenLifetime`,`SlidingRefreshTokenLifetime`,`RefreshTokenUsage`,`UpdateAccessTokenClaimsOnRefresh`,`RefreshTokenExpiration`,`AccessTokenType`,`EnableLocalLogin`,`IncludeJwtId`,`AlwaysSendClientClaims`,`ClientClaimsPrefix`,`PairWiseSubjectSalt`,`Created`,`Updated`,`LastAccessed`,`UserSsoLifetime`,`UserCodeType`,`DeviceCodeLifetime`,`NonEditable`) values 
(1,1,'client','oidc',1,NULL,NULL,NULL,NULL,0,1,0,1,0,0,0,NULL,1,NULL,1,0,300,NULL,3600,300,NULL,2592000,1296000,1,0,1,0,1,1,0,'client_',NULL,'2021-07-20 07:34:48.764575',NULL,NULL,NULL,NULL,300,0),
(2,1,'ro.client','oidc',1,NULL,NULL,NULL,NULL,0,1,0,1,0,0,0,NULL,1,NULL,1,0,300,NULL,3600,300,NULL,2592000,1296000,1,0,1,0,1,1,0,'client_',NULL,'2021-07-20 07:34:48.820017',NULL,NULL,NULL,NULL,300,0),
(3,1,'mvc','oidc',1,'MVC Client',NULL,NULL,NULL,0,1,0,1,0,0,0,NULL,1,NULL,1,1,300,NULL,3600,300,NULL,2592000,1296000,1,0,1,0,1,1,0,'client_',NULL,'2021-07-20 07:34:48.821190',NULL,NULL,NULL,NULL,300,0),
(4,1,'js','oidc',0,'JavaScript Client',NULL,NULL,NULL,0,1,0,1,0,0,0,'https://localhost:3000/#!/logoutresponse',1,NULL,1,0,300,NULL,3600,300,NULL,2592000,1296000,1,0,1,0,1,1,0,'client_',NULL,'2021-07-20 07:34:48.830462',NULL,NULL,NULL,NULL,300,0);

/*Table structure for table `clientscopes` */

DROP TABLE IF EXISTS `clientscopes`;

CREATE TABLE `clientscopes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Scope` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ClientId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientScopes_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientScopes_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `clientscopes` */

insert  into `clientscopes`(`Id`,`Scope`,`ClientId`) values 
(1,'openid',3),
(2,'web_api',2),
(3,'web_api',1),
(4,'openid',4),
(5,'profile',4),
(6,'web_api',4),
(7,'profile',3),
(8,'web_api',3);

/*Table structure for table `clientsecrets` */

DROP TABLE IF EXISTS `clientsecrets`;

CREATE TABLE `clientsecrets` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Description` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Expiration` datetime(6) DEFAULT NULL,
  `Type` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Created` datetime(6) NOT NULL,
  `ClientId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ClientSecrets_ClientId` (`ClientId`),
  CONSTRAINT `FK_ClientSecrets_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `clients` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `clientsecrets` */

insert  into `clientsecrets`(`Id`,`Description`,`Value`,`Expiration`,`Type`,`Created`,`ClientId`) values 
(1,NULL,'K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=',NULL,'SharedSecret','2021-07-20 07:34:48.821192',3),
(2,NULL,'K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=',NULL,'SharedSecret','2021-07-20 07:34:48.820020',2),
(3,NULL,'K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=',NULL,'SharedSecret','2021-07-20 07:34:48.765043',1);

/*Table structure for table `clientusersmapping` */

DROP TABLE IF EXISTS `clientusersmapping`;

CREATE TABLE `clientusersmapping` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `ClientId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_clientusersmapping_UserId` (`UserId`),
  CONSTRAINT `FK_clientusersmapping_AspNetUsers_UserId` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `clientusersmapping` */

/*Table structure for table `devicecodes` */

DROP TABLE IF EXISTS `devicecodes`;

CREATE TABLE `devicecodes` (
  `UserCode` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DeviceCode` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `SubjectId` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `SessionId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ClientId` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `CreationTime` datetime(6) NOT NULL,
  `Expiration` datetime(6) NOT NULL,
  `Data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`UserCode`),
  UNIQUE KEY `IX_DeviceCodes_DeviceCode` (`DeviceCode`),
  KEY `IX_DeviceCodes_Expiration` (`Expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `devicecodes` */

/*Table structure for table `features` */

DROP TABLE IF EXISTS `features`;

CREATE TABLE `features` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `DataType` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `DefaultValue` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `FeatureLevel` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `CreatedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UpdatedBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `features` */

/*Table structure for table `identityresourceclaims` */

DROP TABLE IF EXISTS `identityresourceclaims`;

CREATE TABLE `identityresourceclaims` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Type` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IdentityResourceId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_IdentityResourceClaims_IdentityResourceId` (`IdentityResourceId`),
  CONSTRAINT `FK_IdentityResourceClaims_IdentityResources_IdentityResourceId` FOREIGN KEY (`IdentityResourceId`) REFERENCES `identityresources` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `identityresourceclaims` */

insert  into `identityresourceclaims`(`Id`,`Type`,`IdentityResourceId`) values 
(1,'updated_at',1),
(2,'locale',1),
(3,'zoneinfo',1),
(4,'birthdate',1),
(5,'gender',1),
(6,'website',1),
(7,'picture',1),
(8,'profile',1),
(9,'preferred_username',1),
(10,'nickname',1),
(11,'middle_name',1),
(12,'given_name',1),
(13,'family_name',1),
(14,'name',1),
(15,'sub',2);

/*Table structure for table `identityresourceproperties` */

DROP TABLE IF EXISTS `identityresourceproperties`;

CREATE TABLE `identityresourceproperties` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Key` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Value` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IdentityResourceId` int(11) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_IdentityResourceProperties_IdentityResourceId` (`IdentityResourceId`),
  CONSTRAINT `FK_IdentityResourceProperties_IdentityResources_IdentityResourc~` FOREIGN KEY (`IdentityResourceId`) REFERENCES `identityresources` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `identityresourceproperties` */

/*Table structure for table `identityresources` */

DROP TABLE IF EXISTS `identityresources`;

CREATE TABLE `identityresources` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Enabled` tinyint(1) NOT NULL,
  `Name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DisplayName` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Description` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Required` tinyint(1) NOT NULL,
  `Emphasize` tinyint(1) NOT NULL,
  `ShowInDiscoveryDocument` tinyint(1) NOT NULL,
  `Created` datetime(6) NOT NULL,
  `Updated` datetime(6) DEFAULT NULL,
  `NonEditable` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_IdentityResources_Name` (`Name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `identityresources` */

insert  into `identityresources`(`Id`,`Enabled`,`Name`,`DisplayName`,`Description`,`Required`,`Emphasize`,`ShowInDiscoveryDocument`,`Created`,`Updated`,`NonEditable`) values 
(1,1,'profile','User profile','Your user profile information (first name, last name, etc.)',0,1,1,'2021-07-20 07:34:49.561883',NULL,0),
(2,1,'openid','Your user identifier',NULL,1,0,1,'2021-07-20 07:34:49.539354',NULL,0);

/*Table structure for table `persistedgrants` */

DROP TABLE IF EXISTS `persistedgrants`;

CREATE TABLE `persistedgrants` (
  `Key` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `SubjectId` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `SessionId` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ClientId` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `CreationTime` datetime(6) NOT NULL,
  `Expiration` datetime(6) DEFAULT NULL,
  `ConsumedTime` datetime(6) DEFAULT NULL,
  `Data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Key`),
  KEY `IX_PersistedGrants_Expiration` (`Expiration`),
  KEY `IX_PersistedGrants_SubjectId_ClientId_Type` (`SubjectId`,`ClientId`,`Type`),
  KEY `IX_PersistedGrants_SubjectId_SessionId_Type` (`SubjectId`,`SessionId`,`Type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `persistedgrants` */

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Price` decimal(65,30) DEFAULT NULL,
  `Category` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL,
  `IsDeleted` tinyint(1) NOT NULL,
  `CreatedAt` datetime(6) DEFAULT NULL,
  `CreatedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  `UpdatedBy` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `products` */

/*Table structure for table `systemconfigrations` */

DROP TABLE IF EXISTS `systemconfigrations`;

CREATE TABLE `systemconfigrations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `values` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `clusterName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `isEncrypted` tinyint(1) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT NULL,
  `createdBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL,
  `updatedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updatedAt` datetime(6) NOT NULL,
  `deletedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  `isEditable` tinyint(1) NOT NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `displayName` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createByRoleId` int(11) DEFAULT NULL,
  `updateByRoleId` int(11) DEFAULT NULL,
  `deleteByRoleId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IX_systemconfigrations_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `systemconfigrations` */

/*Table structure for table `user_agreement` */

DROP TABLE IF EXISTS `user_agreement`;

CREATE TABLE `user_agreement` (
  `userAgreementID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `agreementID` int(11) NOT NULL,
  `agreedDate` datetime(6) DEFAULT NULL,
  `isDeleted` tinyint(1) NOT NULL,
  `createdBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updatedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `deletedBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL,
  `updatedAt` datetime(6) DEFAULT NULL,
  `deletedAt` datetime(6) DEFAULT NULL,
  `createByRole` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `updateByRole` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `deleteByRole` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `signaturevalue` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`userAgreementID`),
  KEY `IX_user_agreement_agreementID` (`agreementID`),
  KEY `IX_user_agreement_userID` (`userID`),
  CONSTRAINT `FK_user_agreement_AspNetUsers_userID` FOREIGN KEY (`userID`) REFERENCES `aspnetusers` (`Id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_user_agreement_agreement_agreementID` FOREIGN KEY (`agreementID`) REFERENCES `agreement` (`agreementID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `user_agreement` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
