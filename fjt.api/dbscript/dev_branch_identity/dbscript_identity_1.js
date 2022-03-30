(function (maxBuildNumber, userid, requiredDet) {
    let allDbChangesArray = [];
    switch (maxBuildNumber) {
        case 0:
            allDbChangesArray.push(
                /* **************************** New Script -> 20-07-2021 *********************************** */
                /* **************************** Add Script Version -> 20-07-2021 *********************************** */
                "INSERT INTO dbversion(`buildNumber`,`schemaVersion`,`releaseName`,`description`,`createdBy`,`executedFromIPAddress`) " +
                "VALUES (1,'2.00','V1','Sample entry - Bhavik'," + userid + " , '" + requiredDet.ipAddress + "');"
            );
            break;
        case 1:
            allDbChangesArray.push(
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "DROP FUNCTION IF EXISTS `fun_ApplyCommonDateFormat`;  \n" +
                "CREATE FUNCTION `fun_ApplyCommonDateFormat`(      \n" +
                "pDateTime DATETIME      \n" +
                "    ) RETURNS varchar(100)  \n" +
                "BEGIN          \n" +
                "	DECLARE vDateDisplayFormat VARCHAR(100);      \n" +
                "	SELECT `values`->>\"$.MySQLFormat\" INTO vDateDisplayFormat FROM systemconfigrations WHERE `key`=\"DatePickerDateFormat\";      \n" +
                "	RETURN DATE_FORMAT(pDateTime, vDateDisplayFormat);          \n" +
                "END;  \n" +
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "DROP FUNCTION IF EXISTS `fun_ApplyLongDateTimeFormatByParaValue`;  \n" +
                "CREATE FUNCTION `fun_ApplyLongDateTimeFormatByParaValue`(          \n" +
                "	pDateTime DATETIME,      \n" +
                "    pTimezoneOffset VARCHAR(50)      \n" +
                "    ) RETURNS varchar(50)  \n" +
                "BEGIN      	      \n" +
                "    RETURN DATE_FORMAT(CONVERT_TZ(pDateTime ,'UTC',pTimezoneOffset), '%M %e, %Y');        \n" +
                "END;  \n" +
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "DROP FUNCTION IF EXISTS `fun_ApplyCommonDateTimeFormatByParaValue`;  \n" +
                "CREATE FUNCTION `fun_ApplyCommonDateTimeFormatByParaValue`(        \n" +
                "	pDateTime DATETIME,      \n" +
                "    pTimezoneOffset VARCHAR(50),      \n" +
                "    pDateTimeDisplayFormat VARCHAR(50)      \n" +
                "    ) RETURNS varchar(50)  \n" +
                "BEGIN      \n" +
                "    RETURN DATE_FORMAT(CONVERT_TZ(pDateTime ,'UTC',pTimezoneOffset), pDateTimeDisplayFormat);      \n" +
                "END;  \n" +
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "DROP FUNCTION IF EXISTS `fun_getLastAgreementPublishedVersion`;  \n" +
                "CREATE FUNCTION `fun_getLastAgreementPublishedVersion`(                \n" +
                "	pAgreementTypeID INT(11)              \n" +
                ") RETURNS INT   \n" +
                "BEGIN                \n" +
                "	DECLARE pLastPublishedVersion INT;    \n" +
                "  \n" +
                "	SELECT a.version    \n" +
                "		INTO pLastPublishedVersion FROM agreement a     \n" +
                "		WHERE a.agreementTypeID =pAgreementTypeID and a.isDeleted = 0 and isPublished=1     \n" +
                "			ORDER BY publishedDate DESC LIMIT 1;    \n" +
                "  \n" +
                "	RETURN pLastPublishedVersion;        \n" +
                "END;  \n" +
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "DROP FUNCTION IF EXISTS `fun_getDraftAgreementPublishedVersion`;  \n" +
                "CREATE FUNCTION `fun_getDraftAgreementPublishedVersion`(                    \n" +
                "	pAgreementTypeID INT                \n" +
                ") RETURNS varchar(50) \n" +
                "BEGIN                    \n" +
                "	DECLARE pDraftPublishedVersion INT;        \n" +
                "	DECLARE v_DraftVersion VARCHAR(50);             \n" +
                "	SELECT a.version        \n" +
                "		INTO pDraftPublishedVersion FROM agreement a         \n" +
                "		WHERE a.agreementTypeID =pAgreementTypeID and a.isDeleted = 0 and isPublished=0        \n" +
                "			ORDER BY publishedDate DESC LIMIT 1;        \n" +
                "  \n" +
                "	IF(pDraftPublishedVersion IS NOT NULL OR pDraftPublishedVersion > 0)THEN           \n" +
                "		SET v_DraftVersion = pDraftPublishedVersion;      \n" +
                "	ELSE        \n" +
                "		SET v_DraftVersion = 'None';      \n" +
                "	END IF;        \n" +
                "  \n" +
                "	RETURN v_DraftVersion;            \n" +
                "END;  \n" +
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "DROP FUNCTION IF EXISTS `fun_getDateTimeFormat`;  \n" +
                "CREATE FUNCTION `fun_getDateTimeFormat`(    \n" +
                "    ) RETURNS varchar(100)  \n" +
                "BEGIN      \n" +
                " DECLARE vDateTimeDisplayFormat VARCHAR(100);          \n" +
                " SELECT `values`->>\"$.MySQLFormat\" INTO vDateTimeDisplayFormat FROM systemconfigrations WHERE `key`=\"DateTimePickerDateTimeFormat\";    \n" +
                "RETURN vDateTimeDisplayFormat;      \n" +
                "END;  \n" +
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "DROP FUNCTION IF EXISTS `fun_getTimeZone`;  \n" +
                "CREATE FUNCTION `fun_getTimeZone`(    \n" +
                "    ) RETURNS varchar(50)   \n" +
                "BEGIN      \n" +
                " DECLARE vTimeZone VARCHAR(50);         \n" +
                "  SELECT `values` INTO vTimeZone FROM systemconfigrations WHERE `key` = 'TimeZone';          \n" +
                "RETURN vTimeZone;      \n" +
                "END;  \n" +
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "DROP FUNCTION IF EXISTS `fun_getAgreementTypeNameById`;  \n" +
                "CREATE FUNCTION `fun_getAgreementTypeNameById`(                    \n" +
                "	pAgreementTypeID INT                \n" +
                ") RETURNS VARCHAR(250)  \n" +
                "BEGIN          \n" +
                "	DECLARE pAgreementName VARCHAR(250);                   \n" +
                "	SELECT at.displayName INTO pAgreementName FROM agreement_type at WHERE at.agreementTypeID=pAgreementTypeID ;            \n" +
                "  \n" +
                "	RETURN pAgreementName;            \n" +
                "END;  \n" +
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "DROP FUNCTION IF EXISTS `fun_getLastAgreementPublishedDate`;  \n" +
                "CREATE FUNCTION `fun_getLastAgreementPublishedDate`(                    \n" +
                "	pAgreementTypeID INT              \n" +
                ") RETURNS date  \n" +
                "BEGIN                        \n" +
                "	DECLARE pLastPublisheDate DATE;            \n" +
                "	SELECT a.publishedDate        \n" +
                "		INTO pLastPublisheDate FROM agreement a         \n" +
                "		WHERE a.agreementTypeID =pAgreementTypeID and a.isDeleted = 0 and isPublished=1         \n" +
                "			ORDER BY publishedDate DESC LIMIT 1;        \n" +
                "	RETURN pLastPublisheDate;            \n" +
                "END;  \n" +
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "DROP FUNCTION IF EXISTS `fun_getEmpployeeNameByUserID`;  \n" +
                "CREATE FUNCTION `fun_getEmpployeeNameByUserID`(              \n" +
                "	pUserID varchar(255)            \n" +
                ") RETURNS VARCHAR(256)   \n" +
                "BEGIN              \n" +
                "	DECLARE vUserName VARCHAR(256);             \n" +
                "    if pUserID = 'Auto' then      \n" +
                "		set vUserName = pUserID;      \n" +
                "    else      \n" +
                "		SELECT u.UserName INTO vUserName         \n" +
                "		FROM aspnetusers u        \n" +
                "		WHERE u.id = pUserID;             \n" +
                "	end if;      \n" +
                "	RETURN vUserName;          \n" +
                "END;  \n" +
                /* **************************** Add Script Version -> 20-07-2021 *********************************** */
                "INSERT INTO dbversion(`buildNumber`,`schemaVersion`,`releaseName`,`description`,`createdBy`,`executedFromIPAddress`) " +
                "VALUES (2,'2.00','V1','Identity server functions - Bhavik'," + userid + " , '" + requiredDet.ipAddress + "');"
            );
            break;
        case 2:
            allDbChangesArray.push(
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "Drop procedure if Exists `Sproc_getAgreedUserList`;  \n" +
                "CREATE PROCEDURE `Sproc_getAgreedUserList`(                      \n" +
                "	IN pPageIndex INT,                                                    \n" +
                "	IN pRecordPerPage INT,                                                    \n" +
                "	IN pOrderBy VARCHAR(255),                                                    \n" +
                "	IN pWhereClause VARCHAR(16383),                    \n" +
                "    IN pAgreementTypeID INT,                    \n" +
                "    IN pUserID VARCHAR(255)                   \n" +
                ")  \n" +
                "BEGIN                    \n" +
                "	DECLARE pOffset INT;                                        \n" +
                "	DECLARE rowNumWhere VARCHAR(255);       	                      \n" +
                "	DECLARE v_DateTimeDisplayFormat VARCHAR(100);                                     \n" +
                "	DECLARE v_TimeZone VARCHAR(50);                        \n" +
                "  \n" +
                "	SELECT fun_getTimeZone() INTO v_TimeZone;                            \n" +
                "	SELECT fun_getDateTimeFormat() INTO v_DateTimeDisplayFormat;                    \n" +
                "	SET @temp_Sproc_getAgreedUserList = CONCAT(\"select                    \n" +
                "		ua.userAgreementID,                    \n" +
                "        ua.signaturevalue as imageURL,                          \n" +
                "		at.version,             \n" +
                "        at.isPublished,            \n" +
                "        at.agreementContent,              \n" +
                "        ua.agreementID,              \n" +
                "        ua.userID from_userID,                            \n" +
                "        (ua.createdBy) createdBy,               \n" +
                "        (ua.createdBy) userName,              \n" +
                "        fun_ApplyLongDateTimeFormatByParaValue(at.publishedDate,'\",v_TimeZone,\"') newpublishedDate,              \n" +
                "        fun_ApplyLongDateTimeFormatByParaValue(ua.agreedDate,'\",v_TimeZone,\"') newagreedDate,              \n" +
                "        fun_ApplyCommonDateTimeFormatByParaValue(at.publishedDate,'\",v_TimeZone,\"', '\",v_DateTimeDisplayFormat,\"') publishedDate,                                                  \n" +
                "        fun_ApplyCommonDateTimeFormatByParaValue(ua.agreedDate,'\",v_TimeZone,\"', '\",v_DateTimeDisplayFormat,\"') agreedDate                     \n" +
                "        from user_agreement ua                     \n" +
                "			inner join agreement at on ua.agreementID = at.agreementID                    \n" +
                "       where ua.isDeleted = 0 and                     \n" +
                "       ua.agreementID in (select agreementID from agreement where agreementTypeID = '\",pAgreementTypeID,\"' and isDeleted = 0)                \n" +
                "	\");                            \n" +
                "  \n" +
                "	IF (pOrderBy IS NULL OR pOrderBy = '') THEN                                                                      \n" +
                "		SET pOrderBy = CONCAT(\" ORDER BY version DESC, agreedDate DESC\") ;                                                                      \n" +
                "	ELSE                                                                      \n" +
                "		SET pOrderBy = CONCAT(\" ORDER BY \" , pOrderBy) ;                                                                      \n" +
                "	END IF;	                                                                      \n" +
                "  \n" +
                "	IF(pWhereClause IS NULL OR pWhereClause = '') THEN                                        \n" +
                "		SET pWhereClause = ' 1=1 ' ;                                        \n" +
                "	END IF;               \n" +
                "  \n" +
                "	IF(pUserID IS NOT NULL AND pUserID != '')THEN        \n" +
                "    		SET pWhereClause = CONCAT(pWhereClause, \" AND from_userID = '\", pUserID ,\"' \");          \n" +
                "	END IF;                \n" +
                "  \n" +
                "	IF(ppageIndex <> 0 AND precordPerPage <> 0) THEN                                                                       \n" +
                "		SET pOffset = (ppageIndex -1) * precordPerPage; 		                                                                      \n" +
                "		SET rowNumWhere = CONCAT(\" LIMIT \" , pRecordPerPage , \" OFFSET \" , pOffset) ;                                                                      \n" +
                "	ELSE	                                                                      \n" +
                "		SET rowNumWhere = '';                                                                      \n" +
                "	END IF;                            \n" +
                "  \n" +
                "	SET @SQLStatement1 = CONCAT(\" SELECT COUNT(1) as TotalRecord from ( \",@temp_Sproc_getAgreedUserList,\" ) c where 1=1 and \", pWhereClause);                                \n" +
                "	PREPARE query1 FROM @SQLStatement1;                                                        \n" +
                "	EXECUTE query1;                                                        \n" +
                "	DEALLOCATE PREPARE query1;                            \n" +
                "  \n" +
                "	SET @SQLStatement2 = CONCAT(\"SELECT a.* FROM ( \", @temp_Sproc_getAgreedUserList,\" ) a WHERE \", pWhereClause , \" \" , pOrderBy , rowNumWhere);      \n" +
                "	PREPARE query2 FROM @SQLStatement2;                                                        \n" +
                "	EXECUTE query2;                                             \n" +
                "	DEALLOCATE PREPARE query2;                            \n" +
                "  \n" +
                "END;  \n" +
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "Drop procedure if Exists `Sproc_GetAgreementDetails`;  \n" +
                "CREATE PROCEDURE `Sproc_GetAgreementDetails`(          \n" +
                "agreementTypeID INT        \n" +
                ")  \n" +
                "BEGIN          \n" +
                "  \n" +
                "(SELECT          \n" +
                "	fun_getAgreementTypeNameById(agreementTypeID) AgreementName,          \n" +
                "	fun_ApplyCommonDateFormat(fun_getLastAgreementPublishedDate(agreementTypeID)) LastPublishedDate,          \n" +
                "	fun_getLastAgreementPublishedVersion(agreementTypeID) LastPublishversion,          \n" +
                "	fun_getDraftAgreementPublishedVersion(agreementTypeID) draftversion          \n" +
                "FROM agreement_type at          \n" +
                "WHERE at.agreementTypeID = agreementTypeID and at.isDeleted = 0 );          \n" +
                "END;  \n" +
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "Drop procedure if Exists `Sproc_GetDownloadAgreementDetails`;  \n" +
                "CREATE PROCEDURE `Sproc_GetDownloadAgreementDetails`(        \n" +
                "	IN puserAgreementID varchar(250),        \n" +
                "    IN pagreementTypeID INT        \n" +
                ")  \n" +
                "BEGIN        \n" +
                "	DECLARE pWhereClause VARCHAR(16383);        \n" +
                "    DECLARE pOrderBy VARCHAR(255);        \n" +
                "	DECLARE v_TimeZone VARCHAR(50);                    \n" +
                "	SELECT fun_getTimeZone() INTO v_TimeZone;        \n" +
                "  \n" +
                "    IF(puserAgreementID IS NOT NULL OR puserAgreementID !='') AND (pagreementTypeID IS NULL OR pagreementTypeID ='')THEN         \n" +
                "	SET @SQLStatement2 = CONCAT(\"select           \n" +
                "		ua.userAgreementID,          \n" +
                "		(Select sc.`values` compLogo From systemconfigrations sc Where sc.`key` ='CompanyLogo') as compLogo,                \n" +
                "        (SELECT at.displayName FROM agreement_type at WHERE at.agreementTypeID = a.agreementTypeID) as agreementName,		        \n" +
                "        ua.signaturevalue ,                     \n" +
                "		a.version,           \n" +
                "        ua.createdAt,        \n" +
                "        a.agreementContent,        \n" +
                "        ua.createdBy agreedBy,        \n" +
                "        fun_ApplyLongDateTimeFormatByParaValue(a.publishedDate,'\",v_TimeZone,\"') publishedDate,        \n" +
                "        fun_ApplyLongDateTimeFormatByParaValue(ua.agreedDate,'\",v_TimeZone,\"') agreedDate        \n" +
                "        from user_agreement ua               \n" +
                "			inner join agreement a on ua.agreementID = a.agreementID              \n" +
                "       where ua.isDeleted = 0 and ua.userAgreementID in (\",puserAgreementID,\") ORDER BY a.version DESC, ua.agreedDate DESC\");         \n" +
                "	ELSE        \n" +
                "    SET @SQLStatement2 = CONCAT(\"select         \n" +
                "		at.agreementTypeID,        \n" +
                "		(Select sc.`values` compLogo From systemconfigrations sc Where sc.`key` ='CompanyLogo') as compLogo,                \n" +
                "        (SELECT at.displayName FROM agreement_type at WHERE at.agreementTypeID = a.agreementTypeID) as agreementName,				        \n" +
                "		a.version,            \n" +
                "        a.createdAt,        \n" +
                "        a.agreementContent,                \n" +
                "        fun_ApplyLongDateTimeFormatByParaValue(a.publishedDate,'\",v_TimeZone,\"') publishedDate        \n" +
                "        from agreement_type at               \n" +
                "			inner join agreement a on at.agreementTypeID = a.agreementTypeID              \n" +
                "       where at.isDeleted = 0 and at.agreementTypeID = \",pagreementTypeID,\" order by a.createdAt desc limit 1\");        \n" +
                "    END IF;        \n" +
                "  \n" +
                "    PREPARE query2 FROM @SQLStatement2;                                                  \n" +
                "	EXECUTE query2;                                       \n" +
                "	DEALLOCATE PREPARE query2;                      \n" +
                "  \n" +
                "END;  \n" +
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "Drop procedure if Exists `Sproc_RetrieveAgreementList`;  \n" +
                "CREATE PROCEDURE `Sproc_RetrieveAgreementList`(                \n" +
                "	IN pPageIndex INT,                                              \n" +
                "	IN pRecordPerPage INT,                                              \n" +
                "	IN pOrderBy VARCHAR(255),                                              \n" +
                "	IN pWhereClause VARCHAR(16383),              \n" +
                "    IN pTemplateType VARCHAR(100),            \n" +
                "    IN pUserID  varchar(255)           \n" +
                ")  \n" +
                "BEGIN       		        \n" +
                "  \n" +
                "	DECLARE pOffset INT;                                  \n" +
                "	DECLARE rowNumWhere VARCHAR(255);       	                \n" +
                "	DECLARE v_DateTimeDisplayFormat VARCHAR(100);                               \n" +
                "	DECLARE v_TimeZone VARCHAR(50);                  \n" +
                "  \n" +
                "    SELECT fun_getTimeZone() INTO v_TimeZone;                      \n" +
                "	SELECT fun_getDateTimeFormat() INTO v_DateTimeDisplayFormat;                      \n" +
                "  \n" +
                "	SET @temp_Sproc_RetrieveAgreementList = CONCAT(\"                       \n" +
                "		SELECT 	at.agreementTypeID id,            \n" +
                "				at.displayName as agreementType,                \n" +
                "                at.templateType from_templateType,              \n" +
                "                at.where_used,              \n" +
                "                at.purpose,              \n" +
                "				a.isPublished,            \n" +
                "                a.agreementContent,            \n" +
                "                fun_ApplyCommonDateFormat(a.publishedDate) headerpublishedDate,          \n" +
                "                fun_ApplyLongDateTimeFormatByParaValue(a.publishedDate,'\",v_TimeZone,\"') newpublishedDate,            \n" +
                "                fun_ApplyCommonDateTimeFormatByParaValue(a.publishedDate,'\",v_TimeZone,\"', '\",v_DateTimeDisplayFormat,\"') publishedDate,              \n" +
                "				fun_getLastAgreementPublishedVersion(at.agreementTypeID) version,              \n" +
                "                fun_getDraftAgreementPublishedVersion(at.agreementTypeID) draftversion,              \n" +
                "                a.agreementID,              \n" +
                "                (                                              \n" +
                "				CASE  	WHEN (a.isPublished = 0) THEN                                               \n" +
                "						'Draft'                                                                                   \n" +
                "					WHEN (a.isPublished = 1) THEN                                               \n" +
                "						'Published'                                                                                  \n" +
                "					ELSE                                               \n" +
                "						''                                               \n" +
                "				END                                              \n" +
                "			) AS statusConvertedValue,              \n" +
                "				(a.updatedBy) updatedby ,                                          \n" +
                "				(at.createdBy) createdby,                                          \n" +
                "				 (at.createByRole) createdbyRole,                                          \n" +
                "				 (a.updateByRole) updatedbyRole,                              \n" +
                "				fun_ApplyCommonDateTimeFormatByParaValue(at.createdAt,'\",v_TimeZone,\"', '\",v_DateTimeDisplayFormat,\"') createdAt,                                          \n" +
                "				fun_ApplyCommonDateTimeFormatByParaValue(a.UpdatedAt,'\",v_TimeZone,\"', '\",v_DateTimeDisplayFormat,\"') updatedAt               \n" +
                "		FROM 	agreement_type at                \n" +
                "        INNER JOIN (select * from (select isPublished,agreementID,createdAt,agreementTypeID,isDeleted,version,updatedBy,updateByRole,updatedAt, agreementContent, publishedDate,            \n" +
                "			rank() over(partition by agreementTypeID order by createdAt desc) as rnk from agreement) a               \n" +
                "				where a.rnk=1 and a.isDeleted = 0) a               \n" +
                "			ON a.agreementTypeID = at.agreementTypeID  			            \n" +
                "		WHERE   at.isDeleted = 0              \n" +
                "	\");                      \n" +
                "  \n" +
                "	IF (pOrderBy IS NULL OR pOrderBy = '') THEN                                                                \n" +
                "		SET pOrderBy = CONCAT(\" ORDER BY  agreementType ASC \") ;                                                                \n" +
                "	ELSE                                                                \n" +
                "		SET pOrderBy = CONCAT(\" ORDER BY \" , pOrderBy) ;                                                                \n" +
                "	END IF;	                                                                \n" +
                "  \n" +
                "	IF(pWhereClause IS NULL OR pWhereClause = '') THEN                                  \n" +
                "		SET pWhereClause = ' 1=1 ' ;                                  \n" +
                "	END IF;               \n" +
                "  \n" +
                "    IF(pTemplateType IS NOT NULL OR pTemplateType!='')THEN                  \n" +
                "		SET pWhereClause = CONCAT(pWhereClause, \" AND from_templateType = '\", pTemplateType ,\"' \");                  \n" +
                "	END IF;               \n" +
                "  \n" +
                "	IF(ppageIndex <> 0 AND precordPerPage <> 0) THEN                                                                 \n" +
                "		SET pOffset = (ppageIndex -1) * precordPerPage; 		                                                                \n" +
                "		SET rowNumWhere = CONCAT(\" LIMIT \" , pRecordPerPage , \" OFFSET \" , pOffset) ;                                                                \n" +
                "	ELSE	                                                                \n" +
                "		SET rowNumWhere = '';                                                                \n" +
                "	END IF;                      \n" +
                "  \n" +
                "	  SET @SQLStatement1 = CONCAT(\" SELECT COUNT(1) as TotalRecord from ( \",@temp_Sproc_RetrieveAgreementList,\" ) c where 1=1 and \", pWhereClause);                          \n" +
                "	  PREPARE query1 FROM @SQLStatement1;                                                  \n" +
                "	 EXECUTE query1;                                                  \n" +
                "	 DEALLOCATE PREPARE query1;                      \n" +
                "  \n" +
                "	SET @SQLStatement2 = CONCAT(\"SELECT a.* FROM ( \", @temp_Sproc_RetrieveAgreementList,\" ) a WHERE \", pWhereClause , \" \" , pOrderBy , rowNumWhere);                                                  \n" +
                "	PREPARE query2 FROM @SQLStatement2;                                                  \n" +
                "	EXECUTE query2;                                       \n" +
                "	DEALLOCATE PREPARE query2;                      \n" +
                "  \n" +
                "END;  \n" +
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "Drop procedure if Exists `Sproc_RetrieveArchieveVesrionDetails`;  \n" +
                "CREATE PROCEDURE `Sproc_RetrieveArchieveVesrionDetails`(                    \n" +
                "	IN pPageIndex INT,                                                  \n" +
                "	IN pRecordPerPage INT,                                                  \n" +
                "	IN pOrderBy VARCHAR(255),                                                  \n" +
                "	IN pWhereClause VARCHAR(16383),                      \n" +
                "	IN pAgreementTypeId INT,                \n" +
                "	IN pUserID VARCHAR(255)                  \n" +
                ")  \n" +
                "BEGIN                    \n" +
                "	DECLARE pOffset INT;                                      \n" +
                "	DECLARE rowNumWhere VARCHAR(255);       	                    \n" +
                "	DECLARE v_DateTimeDisplayFormat VARCHAR(100);                                   \n" +
                "	DECLARE v_TimeZone VARCHAR(50);                      \n" +
                "	SELECT fun_getTimeZone() INTO v_TimeZone;                          \n" +
                "	SELECT fun_getDateTimeFormat() INTO v_DateTimeDisplayFormat;            \n" +
                "  \n" +
                "	SET @temp_RetrieveArchieveVesrionDetails = CONCAT(\"                     \n" +
                "            SELECT  (at.updatedBy) updatedby,      \n" +
                "            at.createdBy,      \n" +
                "            at.isPublished,        \n" +
                "			fun_getAgreementTypeNameById(agreementTypeID) agreementName,          \n" +
                "            fun_ApplyLongDateTimeFormatByParaValue(at.publishedDate,'\",v_TimeZone,\"') newpublishedDate,          \n" +
                "			fun_ApplyCommonDateTimeFormatByParaValue(at.publishedDate,'\",v_TimeZone,\"', '\",v_DateTimeDisplayFormat,\"') publishedDate,                                              \n" +
                "            agreementContent,                  \n" +
                "            agreementTypeID,               \n" +
                "			version,                  \n" +
                "            at.agreementID                   \n" +
                "		FROM 	agreement at                    \n" +
                "		WHERE   at.isDeleted = 0 and at.isPublished = 1 and at.agreementTypeID = '\",pAgreementTypeId,\"'             \n" +
                "        \");  	          \n" +
                "  \n" +
                "	IF (pOrderBy IS NULL OR pOrderBy = '') THEN                                                                    \n" +
                "		SET pOrderBy = CONCAT(\" ORDER BY version DESC \") ;                                                                    \n" +
                "	ELSE                                                                    \n" +
                "		SET pOrderBy = CONCAT(\" ORDER BY \" , pOrderBy) ;                                                                    \n" +
                "	END IF;	                                                                    \n" +
                "  \n" +
                "	IF(pWhereClause IS NULL OR pWhereClause = '') THEN                                      \n" +
                "		SET pWhereClause = ' 1=1 ' ;                                      \n" +
                "	END IF;         	          \n" +
                "  \n" +
                "	IF(ppageIndex <> 0 AND precordPerPage <> 0) THEN                                                                     \n" +
                "		SET pOffset = (ppageIndex -1) * precordPerPage; 		                                                                    \n" +
                "		SET rowNumWhere = CONCAT(\" LIMIT \" , pRecordPerPage , \" OFFSET \" , pOffset) ;                                                                    \n" +
                "	ELSE	                                                                    \n" +
                "		SET rowNumWhere = '';                                                                    \n" +
                "	END IF;                          \n" +
                "  \n" +
                "	SET @SQLStatement1 = CONCAT(\" SELECT COUNT(1) as TotalRecord from ( \",@temp_RetrieveArchieveVesrionDetails,\" ) c where 1=1 and \", pWhereClause);                              \n" +
                "	PREPARE query1 FROM @SQLStatement1;                                                      \n" +
                "	EXECUTE query1;                                                      \n" +
                "	DEALLOCATE PREPARE query1;                          \n" +
                "	SET @SQLStatement2 = CONCAT(\"SELECT a.* FROM ( \", @temp_RetrieveArchieveVesrionDetails,\" ) a WHERE \", pWhereClause , \" \" , pOrderBy , rowNumWhere);                                                      \n" +
                "	PREPARE query2 FROM @SQLStatement2;                                                      \n" +
                "	EXECUTE query2;                                           \n" +
                "	DEALLOCATE PREPARE query2;                          \n" +
                "  \n" +
                "END;  \n" +
                /* **************************** New Script -> 20-07-2021 *********************************** */
                "Drop procedure if Exists `Sproc_RetrieveUserSignUpAgreementList`;  \n" +
                "CREATE PROCEDURE `Sproc_RetrieveUserSignUpAgreementList`(                       \n" +
                "IN pPageIndex INT,                       \n" +
                "IN pRecordPerPage INT,                       \n" +
                "IN pOrderBy VARCHAR(255),                       \n" +
                "IN pWhereClause VARCHAR(16383),                       \n" +
                "IN pUserID VARCHAR(255)                      \n" +
                ")  \n" +
                "BEGIN                      \n" +
                "  \n" +
                "	DECLARE pOffset INT;                       \n" +
                "	DECLARE rowNumWhere VARCHAR(255);                       \n" +
                "	DECLARE v_DateTimeDisplayFormat VARCHAR(100);                       \n" +
                "	DECLARE v_TimeZone VARCHAR(50);                       \n" +
                "	SELECT fun_getTimeZone() INTO v_TimeZone;                       \n" +
                "	SELECT fun_getDateTimeFormat() INTO v_DateTimeDisplayFormat;                       \n" +
                "	SET @temp_Sproc_RetrieveUserSignUpAgreementList = CONCAT(\"                       \n" +
                "			select * from (select                 \n" +
                "            ag.isPublished,              \n" +
                "            ua.userAgreementID,            \n" +
                "			ag.agreementID,                       \n" +
                "			ag.agreementTypeID ,       			                \n" +
                "			fun_ApplyCommonDateTimeFormatByParaValue(ua.agreedDate,'\",v_TimeZone,\"', '\",v_DateTimeDisplayFormat,\"') agreedDate,                       \n" +
                "			agreementContent,                     \n" +
                "			ua.signaturevalue as imageURL,                    \n" +
                "            version,                \n" +
                "            (select templateType from agreement_type where agreementTypeID = ag.agreementTypeID and isDeleted= 0) as templateType,                \n" +
                "            fun_ApplyLongDateTimeFormatByParaValue(ag.publishedDate,'\",v_TimeZone,\"') newpublishedDate,                \n" +
                "			fun_getLastAgreementPublishedVersion(ag.agreementTypeID) latestversion,                             \n" +
                "            fun_ApplyCommonDateFormat(ag.publishedDate) headerpublishedDate,          \n" +
                "			fun_getAgreementTypeNameById(ag.agreementTypeID) agreementName, 	           \n" +
                "			ua.createdBy createdby,             \n" +
                "			rank() over(partition by ag.agreementTypeID order by publishedDate desc) as rnk                       \n" +
                "			from agreement ag                       \n" +
                "			inner join user_agreement ua on ua.agreementID = ag.agreementID                       \n" +
                "			where ag.isDeleted = 0 and                       \n" +
                "			ua.userID = '\",pUserID,\"' ) ar where ar.rnk = 1      	                 \n" +
                "			\");                       \n" +
                "	IF (pOrderBy IS NULL OR pOrderBy = '') THEN                       \n" +
                "		SET pOrderBy = CONCAT(\" ORDER BY agreementID ASC \") ;                  \n" +
                "	ELSE                       \n" +
                "		SET pOrderBy = CONCAT(\" ORDER BY \" , pOrderBy) ;                       \n" +
                "	END IF;                       \n" +
                "	IF(pWhereClause IS NULL OR pWhereClause = '') THEN                       \n" +
                "		SET pWhereClause = ' 1=1 ' ;                       \n" +
                "	END IF;                       \n" +
                "	IF(ppageIndex <> 0 AND precordPerPage <> 0) THEN                       \n" +
                "		SET pOffset = (ppageIndex -1) * precordPerPage;                       \n" +
                "		SET rowNumWhere = CONCAT(\" LIMIT \" , pRecordPerPage , \" OFFSET \" , pOffset) ;                       \n" +
                "	ELSE                       \n" +
                "		SET rowNumWhere = '';                       \n" +
                "	END IF;                       \n" +
                "		SET @SQLStatement1 = CONCAT(\" SELECT COUNT(1) as TotalRecord from ( \",@temp_Sproc_RetrieveUserSignUpAgreementList,\" ) c where 1=1 and \", pWhereClause);                       \n" +
                "		PREPARE query1 FROM @SQLStatement1;                       \n" +
                "		EXECUTE query1;                       \n" +
                "		DEALLOCATE PREPARE query1;                    \n" +
                "  \n" +
                "	SET @SQLStatement2 = CONCAT(\"SELECT a.* FROM ( \", @temp_Sproc_RetrieveUserSignUpAgreementList,\" ) a WHERE \", pWhereClause , \" \" , pOrderBy , rowNumWhere);                       \n" +
                "	PREPARE query2 FROM @SQLStatement2;                       \n" +
                "	EXECUTE query2;                       \n" +
                "	DEALLOCATE PREPARE query2;                       \n" +
                "END;  \n" +
                /* **************************** Add Script Version -> 20-07-2021 *********************************** */
                "INSERT INTO dbversion(`buildNumber`,`schemaVersion`,`releaseName`,`description`,`createdBy`,`executedFromIPAddress`) " +
                "VALUES (3,'2.00','V1','Identity Server Store Procedure - Bhavik'," + userid + " , '" + requiredDet.ipAddress + "');"
            );
            break;

    }
    return allDbChangesArray;
});

/* ******** **********************/
// Please Note : Don't forgot to set schemaVersion as '2.00' instead of '1.00' as branch is Dev Branch
/* ******** **********************/