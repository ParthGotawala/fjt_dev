using FJT.IdentityServer.Appsettings;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FJT.IdentityServer.Data
{
    public static class DbInitialize
    {
        private static FJTIdentityDbContext _db;

        private static string FJTMainDBName = string.Empty;
        private static string IdentityDBName = string.Empty;

        public static void Initialize(FJTIdentityDbContext context, IConfigurationSection databaseNames)
        {
            FJTMainDBName = databaseNames.GetValue(typeof(string), "FJTMainDB").ToString();
            IdentityDBName = databaseNames.GetValue(typeof(string), "IdentityDB").ToString();

            _db = context;
            _db.Database.EnsureCreated();

            Seed_fun_ApplyCommonDateFormat();
            Seed_fun_ApplyLongDateTimeFormatByParaValue();
            Seed_fun_ApplyCommonDateTimeFormatByParaValue();
            Seed_fun_getLastAgreementPublishedVersion();
            Seed_fun_getDraftAgreementPublishedVersion();
            Seed_fun_getDateTimeFormat();
            Seed_fun_getTimeZone();
            Seed_fun_getAgreementTypeNameById();
            Seed_fun_getLastAgreementPublishedDate();
            Seed_fun_getEmpployeeNameByUserID();
            Seed_Sproc_getAgreedUserList();
            Seed_Sproc_GetAgreementDetails();
            Seed_Sproc_GetDownloadAgreementDetails();
            Seed_Sproc_RetrieveAgreementList();
            Seed_Sproc_RetrieveArchieveVesrionDetails();
            Seed_Sproc_RetrieveUserSignUpAgreementList();

            Seed_AgreementType_Records();
            Seed_Agreement_Records();
            // Seed_UserAgreement_Records();
            Seed_Systemconfigrations_Records();
        }

        private static void Seed_AgreementType_Records()
        {
            var script = @"use `#FJTMainDBName#`;
drop temporary table if exists temp_agreementType;
create temporary table if not exists temp_agreementType
select agreementTypeID, agreementType, isDeleted, 
fun_getUserNameByID(createdBy) createdBy, fun_getUserNameByID(updatedBy) updatedBy, fun_getUserNameByID(deletedBy) deletedBy, 
createdAt, updatedAt, deletedAt, templateType, 
fun_getRoleByID(createByRoleId) createByRole, fun_getRoleByID(updateByRoleId) updateByRole, fun_getRoleByID(deleteByRoleId) deleteByRole, 
purpose, where_used, displayName
from `agreement_type`;

use `#IdentityDBName#`;
DELETE FROM `agreement_type`;
insert into `agreement_type`
(agreementTypeID, agreementType, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt, deletedAt, templateType, createByRole, updateByRole, deleteByRole, purpose, where_used, displayName )
select agreementTypeID, agreementType, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt, deletedAt, templateType, createByRole, updateByRole, deleteByRole, purpose, where_used, displayName
from `#FJTMainDBName#`.temp_agreementType;";
            _db.ExecuteSqlCommand(script.Replace("#FJTMainDBName#", FJTMainDBName).Replace("#IdentityDBName#", IdentityDBName));
        }

        private static void Seed_Agreement_Records()
        {
            var script = @"use `#FJTMainDBName#`;
drop temporary table if exists temp_agreement;
create temporary table if not exists temp_agreement
select agreementID, agreementTypeID, agreementContent, version, system_variables, isPublished,
publishedDate, isDeleted,
fun_getUserNameByID(createdBy) createdBy, fun_getUserNameByID(updatedBy) updatedBy, fun_getUserNameByID(deletedBy) deletedBy,
createdAt, updatedAt, deletedAt,
agreementSubject,
fun_getRoleByID(createByRoleId) createByRole, fun_getRoleByID(updateByRoleId) updateByRole, fun_getRoleByID(deleteByRoleId) deleteByRole
from agreement;

use `#IdentityDBName#`;
DELETE FROM `agreement`;
insert into agreement
( agreementID, agreementTypeID, agreementContent, version, system_variables, isPublished, publishedDate, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt, deletedAt, agreementSubject, createByRole, updateByRole, deleteByRole)
select agreementID, agreementTypeID, agreementContent, version, system_variables, isPublished, publishedDate, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt, deletedAt, agreementSubject, createByRole, updateByRole, deleteByRole
from `#FJTMainDBName#`.temp_agreement;";
            _db.ExecuteSqlCommand(script.Replace("#FJTMainDBName#",FJTMainDBName).Replace("#IdentityDBName#", IdentityDBName));
        }

        private static void Seed_UserAgreement_Records()
        {
            var script = @"use `#FJTMainDBName#`;
drop temporary table if exists temp_userAgreement;
create temporary table if not exists temp_userAgreement
select ua.userAgreementID, 
(u.IdentityUserId) userID, 
ua.agreementID, ua.agreedDate, ua.isDeleted, 
fun_getUserNameByID(ua.createdBy) createdBy, fun_getUserNameByID(ua.updatedBy) updatedBy, fun_getUserNameByID(ua.deletedBy) deletedBy, 
ua.createdAt, ua.updatedAt, ua.deletedAt, 
fun_getRoleByID(ua.createByRoleId) createByRole, fun_getRoleByID(ua.updateByRoleId) updateByRole, fun_getRoleByID(ua.deleteByRoleId) deleteByRole, 
ua.signaturevalue
from `user_agreement` ua
inner join users u on ua.userID = u.id;

use `#IdentityDBName#`;
DELETE FROM `user_agreement`;
insert into `user_agreement`
(userAgreementID, userID, agreementID, agreedDate, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt, deletedAt, createByRole, updateByRole, deleteByRole, signaturevalue)
select userAgreementID, userID, agreementID, agreedDate, isDeleted, createdBy, updatedBy, deletedBy, createdAt, updatedAt, deletedAt, createByRole, updateByRole, deleteByRole, signaturevalue
from `#FJTMainDBName#`.temp_userAgreement;";
            _db.ExecuteSqlCommand(script.Replace("#FJTMainDBName#", FJTMainDBName).Replace("#IdentityDBName#", IdentityDBName));
        }

        private static void Seed_Systemconfigrations_Records()
        {
            var script = @"use `#FJTMainDBName#`;
drop temporary table if exists temp_systemconfigrations;
create temporary table if not exists temp_systemconfigrations
select *
from `systemconfigrations` sys where 
sys.key = 'CompanyLogo' OR 
sys.key = 'DatePickerDateFormat' 
OR sys.key = 'DateTimePickerDateTimeFormat' 
OR sys.key = 'TimeZone' 
OR sys.key = 'TextAngularKeyCode';

use `#IdentityDBName#`;
DELETE FROM `systemconfigrations`;
insert into `systemconfigrations`
select *
from `#FJTMainDBName#`.temp_systemconfigrations;
";
            _db.ExecuteSqlCommand(script.Replace("#FJTMainDBName#", FJTMainDBName).Replace("#IdentityDBName#", IdentityDBName));
        }

        private static void Seed_fun_ApplyLongDateTimeFormatByParaValue()
        {
            _db.ExecuteSqlCommand(@"DROP FUNCTION IF EXISTS `fun_ApplyLongDateTimeFormatByParaValue`;");

            _db.ExecuteSqlCommand(@"CREATE FUNCTION `fun_ApplyLongDateTimeFormatByParaValue`(        
	pDateTime DATETIME,    
    pTimezoneOffset VARCHAR(50)    
    ) RETURNS varchar(50) CHARSET utf8mb4
BEGIN      	    
    RETURN DATE_FORMAT(CONVERT_TZ(pDateTime ,'UTC',pTimezoneOffset), '%M %e, %Y');      
END");
        }

        private static void Seed_fun_ApplyCommonDateFormat()
        {
            _db.ExecuteSqlCommand(@"DROP FUNCTION IF EXISTS `fun_ApplyCommonDateFormat`;");

            _db.ExecuteSqlCommand(@"CREATE FUNCTION `fun_ApplyCommonDateFormat`(    
pDateTime DATETIME    
    ) RETURNS varchar(50) CHARSET utf8mb4
BEGIN        
	DECLARE vDateDisplayFormat VARCHAR(100);    
	SELECT `values`->>'$.MySQLFormat' INTO vDateDisplayFormat FROM systemconfigrations WHERE `key`='DatePickerDateFormat';    

    RETURN DATE_FORMAT(pDateTime, vDateDisplayFormat);
            END");
        }

        private static void Seed_fun_ApplyCommonDateTimeFormatByParaValue()
        {
            _db.ExecuteSqlCommand(@"DROP FUNCTION IF EXISTS `fun_ApplyCommonDateTimeFormatByParaValue`;");

            _db.ExecuteSqlCommand(@"CREATE FUNCTION `fun_ApplyCommonDateTimeFormatByParaValue`(      
	pDateTime DATETIME,    
    pTimezoneOffset VARCHAR(50),    
    pDateTimeDisplayFormat VARCHAR(50)    
    ) RETURNS varchar(50) CHARSET utf8mb4
BEGIN    
    RETURN DATE_FORMAT(CONVERT_TZ(pDateTime ,'UTC',pTimezoneOffset), pDateTimeDisplayFormat);    
END");
        }

        private static void Seed_fun_getLastAgreementPublishedVersion()
        {
            _db.ExecuteSqlCommand(@"DROP FUNCTION IF EXISTS `fun_getLastAgreementPublishedVersion`;");

            _db.ExecuteSqlCommand(@"CREATE FUNCTION `fun_getLastAgreementPublishedVersion`(              
	pAgreementTypeID INT(11)            
) RETURNS longtext CHARSET utf8mb4
BEGIN              
	DECLARE pLastPublishedVersion INT;  
  
	SELECT a.version  
		INTO pLastPublishedVersion FROM agreement a   
		WHERE a.agreementTypeID =pAgreementTypeID and a.isDeleted = 0 and isPublished=1   
			ORDER BY publishedDate DESC LIMIT 1;  
  
	RETURN pLastPublishedVersion;      
END");
        }

        private static void Seed_fun_getDraftAgreementPublishedVersion()
        {
            _db.ExecuteSqlCommand(@"DROP FUNCTION IF EXISTS `fun_getDraftAgreementPublishedVersion`;");

            _db.ExecuteSqlCommand(@"CREATE FUNCTION `fun_getDraftAgreementPublishedVersion`(                  
	pAgreementTypeID INT              
) RETURNS varchar(50) CHARSET utf8mb4
BEGIN                  
	DECLARE pDraftPublishedVersion INT;      
	DECLARE v_DraftVersion VARCHAR(50);           
	SELECT a.version      
		INTO pDraftPublishedVersion FROM agreement a       
		WHERE a.agreementTypeID =pAgreementTypeID and a.isDeleted = 0 and isPublished=0      
			ORDER BY publishedDate DESC LIMIT 1;      
  
	IF(pDraftPublishedVersion IS NOT NULL OR pDraftPublishedVersion > 0)THEN         
		SET v_DraftVersion = pDraftPublishedVersion;    
	ELSE      
		SET v_DraftVersion = 'None';    
	END IF;      
  
	RETURN v_DraftVersion;          
END");
        }

        private static void Seed_fun_getDateTimeFormat()
        {
            _db.ExecuteSqlCommand(@"DROP FUNCTION IF EXISTS `fun_getDateTimeFormat`;");

            _db.ExecuteSqlCommand(@"CREATE FUNCTION `fun_getDateTimeFormat`(  
    ) RETURNS varchar(100) CHARSET utf8mb4
BEGIN    
 DECLARE vDateTimeDisplayFormat VARCHAR(100);        
 SELECT `values`->>'$.MySQLFormat' INTO vDateTimeDisplayFormat FROM systemconfigrations WHERE `key`='DateTimePickerDateTimeFormat';  
RETURN vDateTimeDisplayFormat;
            END");
        }

        private static void Seed_fun_getTimeZone()
        {
            _db.ExecuteSqlCommand(@"DROP FUNCTION IF EXISTS `fun_getTimeZone`;");

            _db.ExecuteSqlCommand(@"CREATE FUNCTION `fun_getTimeZone`(  
    ) RETURNS varchar(50) CHARSET utf8mb4
BEGIN    
 DECLARE vTimeZone VARCHAR(50);       
  SELECT `values` INTO vTimeZone FROM systemconfigrations WHERE `key` = 'TimeZone';        
RETURN vTimeZone;    
END");
        }

        private static void Seed_fun_getAgreementTypeNameById()
        {
            _db.ExecuteSqlCommand(@"DROP FUNCTION IF EXISTS `fun_getAgreementTypeNameById`;");

            _db.ExecuteSqlCommand(@"CREATE FUNCTION `fun_getAgreementTypeNameById`(                  
	pAgreementTypeID INT              
) RETURNS longtext CHARSET utf8mb4
BEGIN        
	DECLARE pAgreementName VARCHAR(250);                 
	SELECT at.displayName INTO pAgreementName FROM agreement_type at WHERE at.agreementTypeID=pAgreementTypeID ;          
  
	RETURN pAgreementName;          
END");
        }

        private static void Seed_fun_getLastAgreementPublishedDate()
        {
            _db.ExecuteSqlCommand(@"DROP FUNCTION IF EXISTS `fun_getLastAgreementPublishedDate`;");

            _db.ExecuteSqlCommand(@"CREATE FUNCTION `fun_getLastAgreementPublishedDate`(                  
	pAgreementTypeID INT            
) RETURNS date
BEGIN                      
	DECLARE pLastPublisheDate DATE;          
	SELECT a.publishedDate      
		INTO pLastPublisheDate FROM agreement a       
		WHERE a.agreementTypeID =pAgreementTypeID and a.isDeleted = 0 and isPublished=1       
			ORDER BY publishedDate DESC LIMIT 1;      
	RETURN pLastPublisheDate;          
END");
        }

        private static void Seed_fun_getEmpployeeNameByUserID()
        {
            _db.ExecuteSqlCommand(@"DROP FUNCTION IF EXISTS `fun_getEmpployeeNameByUserID`;");

            _db.ExecuteSqlCommand(@"CREATE FUNCTION `fun_getEmpployeeNameByUserID`(            
	pUserID varchar(255)          
) RETURNS longtext CHARSET utf8mb4
BEGIN            
	DECLARE vUserName VARCHAR(50);           
    if pUserID = 'Auto' then    
		set vUserName = pUserID;    
    else    
		SELECT u.UserName INTO vUserName       
		FROM aspnetusers u      
		WHERE u.id = pUserID;           
	end if;    
	RETURN vUserName;        
END");
        }

        private static void Seed_Sproc_getAgreedUserList()
        {
            _db.ExecuteSqlCommand(@"DROP PROCEDURE IF EXISTS `Sproc_getAgreedUserList`;");

            _db.ExecuteSqlCommand("CREATE PROCEDURE `Sproc_getAgreedUserList`(                    \n" +
"	IN pPageIndex INT,                                                  \n" +
"	IN pRecordPerPage INT,                                                  \n" +
"	IN pOrderBy VARCHAR(255),                                                  \n" +
"	IN pWhereClause VARCHAR(16383),                  \n" +
"    IN pAgreementTypeID INT,                  \n" +
"    IN pUserID VARCHAR(255)                 \n" +
")  \n" +
"BEGIN                  \n" +
"	DECLARE pOffset INT;                                      \n" +
"	DECLARE rowNumWhere VARCHAR(255);       	                    \n" +
"	DECLARE v_DateTimeDisplayFormat VARCHAR(100);                                   \n" +
"	DECLARE v_TimeZone VARCHAR(50);                      \n" +
"  \n" +
"	SELECT fun_getTimeZone() INTO v_TimeZone;                          \n" +
"	SELECT fun_getDateTimeFormat() INTO v_DateTimeDisplayFormat;                  \n" +
"	SET @temp_Sproc_getAgreedUserList = CONCAT(\"select                  \n" +
"		ua.userAgreementID,                  \n" +
"        ua.signaturevalue as imageURL,                        \n" +
"		at.version,           \n" +
"        at.isPublished,          \n" +
"        at.agreementContent,            \n" +
"        ua.agreementID,            \n" +
"        ua.userID from_userID,                          \n" +
"        (ua.createdBy) createdBy,             \n" +
"        (ua.createdBy) userName,            \n" +
"        fun_ApplyLongDateTimeFormatByParaValue(at.publishedDate,'\",v_TimeZone,\"') newpublishedDate,            \n" +
"        fun_ApplyLongDateTimeFormatByParaValue(ua.agreedDate,'\",v_TimeZone,\"') newagreedDate,            \n" +
"        fun_ApplyCommonDateTimeFormatByParaValue(at.publishedDate,'\",v_TimeZone,\"', '\",v_DateTimeDisplayFormat,\"') publishedDate,                                                \n" +
"        fun_ApplyCommonDateTimeFormatByParaValue(ua.agreedDate,'\",v_TimeZone,\"', '\",v_DateTimeDisplayFormat,\"') agreedDate                   \n" +
"        from user_agreement ua                   \n" +
"			inner join agreement at on ua.agreementID = at.agreementID                  \n" +
"       where ua.isDeleted = 0 and                   \n" +
"       ua.agreementID in (select agreementID from agreement where agreementTypeID = '\",pAgreementTypeID,\"' and isDeleted = 0)              \n" +
"	\");                          \n" +
"  \n" +
"	IF (pOrderBy IS NULL OR pOrderBy = '') THEN                                                                    \n" +
"		SET pOrderBy = CONCAT(\" ORDER BY version DESC, agreedDate DESC\") ;                                                                    \n" +
"	ELSE                                                                    \n" +
"		SET pOrderBy = CONCAT(\" ORDER BY \" , pOrderBy) ;                                                                    \n" +
"	END IF;	                                                                    \n" +
"  \n" +
"	IF(pWhereClause IS NULL OR pWhereClause = '') THEN                                      \n" +
"		SET pWhereClause = ' 1=1 ' ;                                      \n" +
"	END IF;             \n" +
"  \n" +
"	IF(pUserID IS NOT NULL AND pUserID != '')THEN      \n" +
"    		SET pWhereClause = CONCAT(pWhereClause, \" AND from_userID = '\", pUserID ,\"' \");        \n" +
"	END IF;              \n" +
"  \n" +
"	IF(ppageIndex <> 0 AND precordPerPage <> 0) THEN                                                                     \n" +
"		SET pOffset = (ppageIndex -1) * precordPerPage; 		                                                                    \n" +
"		SET rowNumWhere = CONCAT(\" LIMIT \" , pRecordPerPage , \" OFFSET \" , pOffset) ;                                                                    \n" +
"	ELSE	                                                                    \n" +
"		SET rowNumWhere = '';                                                                    \n" +
"	END IF;                          \n" +
"  \n" +
"	SET @SQLStatement1 = CONCAT(\" SELECT COUNT(1) as TotalRecord from ( \",@temp_Sproc_getAgreedUserList,\" ) c where 1=1 and \", pWhereClause);                              \n" +
"	PREPARE query1 FROM @SQLStatement1;                                                      \n" +
"	EXECUTE query1;                                                      \n" +
"	DEALLOCATE PREPARE query1;                          \n" +
"  \n" +
"	SET @SQLStatement2 = CONCAT(\"SELECT a.* FROM ( \", @temp_Sproc_getAgreedUserList,\" ) a WHERE \", pWhereClause , \" \" , pOrderBy , rowNumWhere);    \n" +
"	PREPARE query2 FROM @SQLStatement2;                                                      \n" +
"	EXECUTE query2;                                           \n" +
"	DEALLOCATE PREPARE query2;                          \n" +
"  \n" +
"END;  \n");
        }

        private static void Seed_Sproc_GetAgreementDetails()
        {
            _db.ExecuteSqlCommand(@"DROP PROCEDURE IF EXISTS `Sproc_GetAgreementDetails`;");

            _db.ExecuteSqlCommand("CREATE PROCEDURE `Sproc_GetAgreementDetails`(        \n" +
"agreementTypeID INT      \n" +
")  \n" +
"BEGIN        \n" +
"  \n" +
"(SELECT        \n" +
"	fun_getAgreementTypeNameById(agreementTypeID) AgreementName,        \n" +
"	fun_ApplyCommonDateFormat(fun_getLastAgreementPublishedDate(agreementTypeID)) LastPublishedDate,        \n" +
"	fun_getLastAgreementPublishedVersion(agreementTypeID) LastPublishversion,        \n" +
"	fun_getDraftAgreementPublishedVersion(agreementTypeID) draftversion        \n" +
"FROM agreement_type at        \n" +
"WHERE at.agreementTypeID = agreementTypeID and at.isDeleted = 0 );        \n" +
"END;  \n");
        }

        private static void Seed_Sproc_GetDownloadAgreementDetails()
        {
            _db.ExecuteSqlCommand(@"DROP PROCEDURE IF EXISTS `Sproc_GetDownloadAgreementDetails`;");

            _db.ExecuteSqlCommand("CREATE PROCEDURE `Sproc_GetDownloadAgreementDetails`(      \n" +
"	IN puserAgreementID varchar(250),      \n" +
"    IN pagreementTypeID INT      \n" +
")  \n" +
"BEGIN      \n" +
"	DECLARE pWhereClause VARCHAR(16383);      \n" +
"    DECLARE pOrderBy VARCHAR(255);      \n" +
"	DECLARE v_TimeZone VARCHAR(50);                  \n" +
"	SELECT fun_getTimeZone() INTO v_TimeZone;      \n" +
"  \n" +
"    IF(puserAgreementID IS NOT NULL OR puserAgreementID !='') AND (pagreementTypeID IS NULL OR pagreementTypeID ='')THEN       \n" +
"	SET @SQLStatement2 = CONCAT(\"select         \n" +
"		ua.userAgreementID,        \n" +
"		(Select sc.`values` compLogo From systemconfigrations sc Where sc.`key` ='CompanyLogo') as compLogo,              \n" +
"        (SELECT at.displayName FROM agreement_type at WHERE at.agreementTypeID = a.agreementTypeID) as agreementName,		      \n" +
"        ua.signaturevalue ,                   \n" +
"		a.version,         \n" +
"        ua.createdAt,      \n" +
"        a.agreementContent,      \n" +
"        ua.createdBy agreedBy,      \n" +
"        fun_ApplyLongDateTimeFormatByParaValue(a.publishedDate,'\",v_TimeZone,\"') publishedDate,      \n" +
"        fun_ApplyLongDateTimeFormatByParaValue(ua.agreedDate,'\",v_TimeZone,\"') agreedDate      \n" +
"        from user_agreement ua             \n" +
"			inner join agreement a on ua.agreementID = a.agreementID            \n" +
"       where ua.isDeleted = 0 and ua.userAgreementID in (\",puserAgreementID,\") ORDER BY a.version DESC, ua.agreedDate DESC\");       \n" +
"	ELSE      \n" +
"    SET @SQLStatement2 = CONCAT(\"select       \n" +
"		at.agreementTypeID,      \n" +
"		(Select sc.`values` compLogo From systemconfigrations sc Where sc.`key` ='CompanyLogo') as compLogo,              \n" +
"        (SELECT at.displayName FROM agreement_type at WHERE at.agreementTypeID = a.agreementTypeID) as agreementName,				      \n" +
"		a.version,          \n" +
"        a.createdAt,      \n" +
"        a.agreementContent,              \n" +
"        fun_ApplyLongDateTimeFormatByParaValue(a.publishedDate,'\",v_TimeZone,\"') publishedDate      \n" +
"        from agreement_type at             \n" +
"			inner join agreement a on at.agreementTypeID = a.agreementTypeID            \n" +
"       where at.isDeleted = 0 and at.agreementTypeID = \",pagreementTypeID,\" order by a.createdAt desc limit 1\");      \n" +
"    END IF;      \n" +
"  \n" +
"    PREPARE query2 FROM @SQLStatement2;                                                \n" +
"	EXECUTE query2;                                     \n" +
"	DEALLOCATE PREPARE query2;                    \n" +
"  \n" +
"END;  \n");
        }

        private static void Seed_Sproc_RetrieveAgreementList()
        {
            _db.ExecuteSqlCommand(@"DROP PROCEDURE IF EXISTS `Sproc_RetrieveAgreementList`;");

            _db.ExecuteSqlCommand("CREATE PROCEDURE `Sproc_RetrieveAgreementList`(              \n" +
"	IN pPageIndex INT,                                            \n" +
"	IN pRecordPerPage INT,                                            \n" +
"	IN pOrderBy VARCHAR(255),                                            \n" +
"	IN pWhereClause VARCHAR(16383),            \n" +
"    IN pTemplateType VARCHAR(100),          \n" +
"    IN pUserID  varchar(255)         \n" +
")  \n" +
"BEGIN       		      \n" +
"  \n" +
"	DECLARE pOffset INT;                                \n" +
"	DECLARE rowNumWhere VARCHAR(255);       	              \n" +
"	DECLARE v_DateTimeDisplayFormat VARCHAR(100);                             \n" +
"	DECLARE v_TimeZone VARCHAR(50);                \n" +
"  \n" +
"    SELECT fun_getTimeZone() INTO v_TimeZone;                    \n" +
"	SELECT fun_getDateTimeFormat() INTO v_DateTimeDisplayFormat;                    \n" +
"  \n" +
"	SET @temp_Sproc_RetrieveAgreementList = CONCAT(\"                     \n" +
"		SELECT 	at.agreementTypeID id,          \n" +
"				at.displayName as agreementType,              \n" +
"                at.templateType from_templateType,            \n" +
"                at.where_used,            \n" +
"                at.purpose,            \n" +
"				a.isPublished,          \n" +
"                a.agreementContent,          \n" +
"                fun_ApplyCommonDateFormat(a.publishedDate) headerpublishedDate,        \n" +
"                fun_ApplyLongDateTimeFormatByParaValue(a.publishedDate,'\",v_TimeZone,\"') newpublishedDate,          \n" +
"                fun_ApplyCommonDateTimeFormatByParaValue(a.publishedDate,'\",v_TimeZone,\"', '\",v_DateTimeDisplayFormat,\"') publishedDate,            \n" +
"				fun_getLastAgreementPublishedVersion(at.agreementTypeID) version,            \n" +
"                fun_getDraftAgreementPublishedVersion(at.agreementTypeID) draftversion,            \n" +
"                a.agreementID,            \n" +
"                (                                            \n" +
"				CASE  	WHEN (a.isPublished = 0) THEN                                             \n" +
"						'Draft'                                                                                 \n" +
"					WHEN (a.isPublished = 1) THEN                                             \n" +
"						'Published'                                                                                \n" +
"					ELSE                                             \n" +
"						''                                             \n" +
"				END                                            \n" +
"			) AS statusConvertedValue,            \n" +
"				(a.updatedBy) updatedby ,                                        \n" +
"				(at.createdBy) createdby,                                        \n" +
"				 (at.createByRole) createdbyRole,                                        \n" +
"				 (a.updateByRole) updatedbyRole,                            \n" +
"				fun_ApplyCommonDateTimeFormatByParaValue(at.createdAt,'\",v_TimeZone,\"', '\",v_DateTimeDisplayFormat,\"') createdAt,                                        \n" +
"				fun_ApplyCommonDateTimeFormatByParaValue(a.UpdatedAt,'\",v_TimeZone,\"', '\",v_DateTimeDisplayFormat,\"') updatedAt             \n" +
"		FROM 	agreement_type at              \n" +
"        INNER JOIN (select * from (select isPublished,agreementID,createdAt,agreementTypeID,isDeleted,version,updatedBy,updateByRole,updatedAt, agreementContent, publishedDate,          \n" +
"			rank() over(partition by agreementTypeID order by createdAt desc) as rnk from agreement) a             \n" +
"				where a.rnk=1 and a.isDeleted = 0) a             \n" +
"			ON a.agreementTypeID = at.agreementTypeID  			          \n" +
"		WHERE   at.isDeleted = 0            \n" +
"	\");                    \n" +
"  \n" +
"	IF (pOrderBy IS NULL OR pOrderBy = '') THEN                                                              \n" +
"		SET pOrderBy = CONCAT(\" ORDER BY  agreementType ASC \") ;                                                              \n" +
"	ELSE                                                              \n" +
"		SET pOrderBy = CONCAT(\" ORDER BY \" , pOrderBy) ;                                                              \n" +
"	END IF;	                                                              \n" +
"  \n" +
"	IF(pWhereClause IS NULL OR pWhereClause = '') THEN                                \n" +
"		SET pWhereClause = ' 1=1 ' ;                                \n" +
"	END IF;             \n" +
"  \n" +
"    IF(pTemplateType IS NOT NULL OR pTemplateType!='')THEN                \n" +
"		SET pWhereClause = CONCAT(pWhereClause, \" AND from_templateType = '\", pTemplateType ,\"' \");                \n" +
"	END IF;             \n" +
"  \n" +
"	IF(ppageIndex <> 0 AND precordPerPage <> 0) THEN                                                               \n" +
"		SET pOffset = (ppageIndex -1) * precordPerPage; 		                                                              \n" +
"		SET rowNumWhere = CONCAT(\" LIMIT \" , pRecordPerPage , \" OFFSET \" , pOffset) ;                                                              \n" +
"	ELSE	                                                              \n" +
"		SET rowNumWhere = '';                                                              \n" +
"	END IF;                    \n" +
"  \n" +
"	  SET @SQLStatement1 = CONCAT(\" SELECT COUNT(1) as TotalRecord from ( \",@temp_Sproc_RetrieveAgreementList,\" ) c where 1=1 and \", pWhereClause);                        \n" +
"	  PREPARE query1 FROM @SQLStatement1;                                                \n" +
"	 EXECUTE query1;                                                \n" +
"	 DEALLOCATE PREPARE query1;                    \n" +
"  \n" +
"	SET @SQLStatement2 = CONCAT(\"SELECT a.* FROM ( \", @temp_Sproc_RetrieveAgreementList,\" ) a WHERE \", pWhereClause , \" \" , pOrderBy , rowNumWhere);                                                \n" +
"	PREPARE query2 FROM @SQLStatement2;                                                \n" +
"	EXECUTE query2;                                     \n" +
"	DEALLOCATE PREPARE query2;                    \n" +
"  \n" +
"END;  \n");
        }

        private static void Seed_Sproc_RetrieveArchieveVesrionDetails()
        {
            _db.ExecuteSqlCommand(@"DROP PROCEDURE IF EXISTS `Sproc_RetrieveArchieveVesrionDetails`;");

            _db.ExecuteSqlCommand("CREATE PROCEDURE `Sproc_RetrieveArchieveVesrionDetails`(                  \n" +
"	IN pPageIndex INT,                                                \n" +
"	IN pRecordPerPage INT,                                                \n" +
"	IN pOrderBy VARCHAR(255),                                                \n" +
"	IN pWhereClause VARCHAR(16383),                    \n" +
"	IN pAgreementTypeId INT,              \n" +
"	IN pUserID VARCHAR(255)                \n" +
")  \n" +
"BEGIN                  \n" +
"	DECLARE pOffset INT;                                    \n" +
"	DECLARE rowNumWhere VARCHAR(255);       	                  \n" +
"	DECLARE v_DateTimeDisplayFormat VARCHAR(100);                                 \n" +
"	DECLARE v_TimeZone VARCHAR(50);                    \n" +
"	SELECT fun_getTimeZone() INTO v_TimeZone;                        \n" +
"	SELECT fun_getDateTimeFormat() INTO v_DateTimeDisplayFormat;          \n" +
"  \n" +
"	SET @temp_RetrieveArchieveVesrionDetails = CONCAT(\"                   \n" +
"            SELECT  (at.updatedBy) updatedby,    \n" +
"            at.createdBy,    \n" +
"            at.isPublished,      \n" +
"			fun_getAgreementTypeNameById(agreementTypeID) agreementName,        \n" +
"            fun_ApplyLongDateTimeFormatByParaValue(at.publishedDate,'\",v_TimeZone,\"') newpublishedDate,        \n" +
"			fun_ApplyCommonDateTimeFormatByParaValue(at.publishedDate,'\",v_TimeZone,\"', '\",v_DateTimeDisplayFormat,\"') publishedDate,                                            \n" +
"            agreementContent,                \n" +
"            agreementTypeID,             \n" +
"			version,                \n" +
"            at.agreementID                 \n" +
"		FROM 	agreement at                  \n" +
"		WHERE   at.isDeleted = 0 and at.isPublished = 1 and at.agreementTypeID = '\",pAgreementTypeId,\"'           \n" +
"        \");  	        \n" +
"  \n" +
"	IF (pOrderBy IS NULL OR pOrderBy = '') THEN                                                                  \n" +
"		SET pOrderBy = CONCAT(\" ORDER BY version DESC \") ;                                                                  \n" +
"	ELSE                                                                  \n" +
"		SET pOrderBy = CONCAT(\" ORDER BY \" , pOrderBy) ;                                                                  \n" +
"	END IF;	                                                                  \n" +
"  \n" +
"	IF(pWhereClause IS NULL OR pWhereClause = '') THEN                                    \n" +
"		SET pWhereClause = ' 1=1 ' ;                                    \n" +
"	END IF;         	        \n" +
"  \n" +
"	IF(ppageIndex <> 0 AND precordPerPage <> 0) THEN                                                                   \n" +
"		SET pOffset = (ppageIndex -1) * precordPerPage; 		                                                                  \n" +
"		SET rowNumWhere = CONCAT(\" LIMIT \" , pRecordPerPage , \" OFFSET \" , pOffset) ;                                                                  \n" +
"	ELSE	                                                                  \n" +
"		SET rowNumWhere = '';                                                                  \n" +
"	END IF;                        \n" +
"  \n" +
"	SET @SQLStatement1 = CONCAT(\" SELECT COUNT(1) as TotalRecord from ( \",@temp_RetrieveArchieveVesrionDetails,\" ) c where 1=1 and \", pWhereClause);                            \n" +
"	PREPARE query1 FROM @SQLStatement1;                                                    \n" +
"	EXECUTE query1;                                                    \n" +
"	DEALLOCATE PREPARE query1;                        \n" +
"	SET @SQLStatement2 = CONCAT(\"SELECT a.* FROM ( \", @temp_RetrieveArchieveVesrionDetails,\" ) a WHERE \", pWhereClause , \" \" , pOrderBy , rowNumWhere);                                                    \n" +
"	PREPARE query2 FROM @SQLStatement2;                                                    \n" +
"	EXECUTE query2;                                         \n" +
"	DEALLOCATE PREPARE query2;                        \n" +
"  \n" +
"END;  \n");
        }

        private static void Seed_Sproc_RetrieveUserSignUpAgreementList()
        {
            _db.ExecuteSqlCommand(@"DROP PROCEDURE IF EXISTS `Sproc_RetrieveUserSignUpAgreementList`;");

            _db.ExecuteSqlCommand("CREATE PROCEDURE `Sproc_RetrieveUserSignUpAgreementList`(                     \n" +
"IN pPageIndex INT,                     \n" +
"IN pRecordPerPage INT,                     \n" +
"IN pOrderBy VARCHAR(255),                     \n" +
"IN pWhereClause VARCHAR(16383),                     \n" +
"IN pUserID VARCHAR(255)                    \n" +
")  \n" +
"BEGIN                    \n" +
"  \n" +
"	DECLARE pOffset INT;                     \n" +
"	DECLARE rowNumWhere VARCHAR(255);                     \n" +
"	DECLARE v_DateTimeDisplayFormat VARCHAR(100);                     \n" +
"	DECLARE v_TimeZone VARCHAR(50);                     \n" +
"	SELECT fun_getTimeZone() INTO v_TimeZone;                     \n" +
"	SELECT fun_getDateTimeFormat() INTO v_DateTimeDisplayFormat;                     \n" +
"	SET @temp_Sproc_RetrieveUserSignUpAgreementList = CONCAT(\"                     \n" +
"			select * from (select               \n" +
"            ag.isPublished,            \n" +
"            ua.userAgreementID,          \n" +
"			ag.agreementID,                     \n" +
"			ag.agreementTypeID ,       			              \n" +
"			fun_ApplyCommonDateTimeFormatByParaValue(ua.agreedDate,'\",v_TimeZone,\"', '\",v_DateTimeDisplayFormat,\"') agreedDate,                     \n" +
"			agreementContent,                   \n" +
"			ua.signaturevalue as imageURL,                  \n" +
"            version,              \n" +
"            (select templateType from agreement_type where agreementTypeID = ag.agreementTypeID and isDeleted= 0) as templateType,              \n" +
"            fun_ApplyLongDateTimeFormatByParaValue(ag.publishedDate,'\",v_TimeZone,\"') newpublishedDate,              \n" +
"			fun_getLastAgreementPublishedVersion(ag.agreementTypeID) latestversion,                           \n" +
"            fun_ApplyCommonDateFormat(ag.publishedDate) headerpublishedDate,        \n" +
"			fun_getAgreementTypeNameById(ag.agreementTypeID) agreementName, 	         \n" +
"			ua.createdBy createdby,           \n" +
"			rank() over(partition by ag.agreementTypeID order by publishedDate desc) as rnk                     \n" +
"			from agreement ag                     \n" +
"			inner join user_agreement ua on ua.agreementID = ag.agreementID                     \n" +
"			where ag.isDeleted = 0 and                     \n" +
"			ua.userID = '\",pUserID,\"' ) ar where ar.rnk = 1      	               \n" +
"			\");                     \n" +
"	IF (pOrderBy IS NULL OR pOrderBy = '') THEN                     \n" +
"		SET pOrderBy = CONCAT(\" ORDER BY agreementID ASC \") ;                \n" +
"	ELSE                     \n" +
"		SET pOrderBy = CONCAT(\" ORDER BY \" , pOrderBy) ;                     \n" +
"	END IF;                     \n" +
"	IF(pWhereClause IS NULL OR pWhereClause = '') THEN                     \n" +
"		SET pWhereClause = ' 1=1 ' ;                     \n" +
"	END IF;                     \n" +
"	IF(ppageIndex <> 0 AND precordPerPage <> 0) THEN                     \n" +
"		SET pOffset = (ppageIndex -1) * precordPerPage;                     \n" +
"		SET rowNumWhere = CONCAT(\" LIMIT \" , pRecordPerPage , \" OFFSET \" , pOffset) ;                     \n" +
"	ELSE                     \n" +
"		SET rowNumWhere = '';                     \n" +
"	END IF;                     \n" +
"		SET @SQLStatement1 = CONCAT(\" SELECT COUNT(1) as TotalRecord from ( \",@temp_Sproc_RetrieveUserSignUpAgreementList,\" ) c where 1=1 and \", pWhereClause);                     \n" +
"		PREPARE query1 FROM @SQLStatement1;                     \n" +
"		EXECUTE query1;                     \n" +
"		DEALLOCATE PREPARE query1;                  \n" +
"  \n" +
"	SET @SQLStatement2 = CONCAT(\"SELECT a.* FROM ( \", @temp_Sproc_RetrieveUserSignUpAgreementList,\" ) a WHERE \", pWhereClause , \" \" , pOrderBy , rowNumWhere);                     \n" +
"	PREPARE query2 FROM @SQLStatement2;                     \n" +
"	EXECUTE query2;                     \n" +
"	DEALLOCATE PREPARE query2;                     \n" +
"END;  \n");
        }
    }
}
