DELIMITER $$

USE `FlexJobTracking`$$

DROP PROCEDURE IF EXISTS `Sproc_DBVersion`$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Sproc_DBVersion`(
IN pVersion INT(11))
BEGIN
	DECLARE vBuildNumber  INT ;
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	 BEGIN
	      ROLLBACK;
	END;

	DECLARE EXIT HANDLER FOR SQLWARNING
	 BEGIN
		ROLLBACK;
	END;
	
	IF (0 = (SELECT IFNULL(MAX(buildNumber),0) FROM dbversion)) THEN
	INSERT INTO dbversion 
		(
			 `BuildNumber`
			,`SchemaVersion`
			,`ReleaseName`
			,`Description`
			)
		VALUES 
		(
			 11
			,'1.00'
			,'V1'
			,'Initial Load of dbversion for V1 release' 
		);
	END IF;

   END$$

DELIMITER ;

 CALL Sproc_DBVersion(1);