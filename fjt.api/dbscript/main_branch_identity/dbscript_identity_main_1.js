(function (maxBuildNumber, userid) {
    let allDbChangesArray = [];
    switch (maxBuildNumber) {
        case 0:
            allDbChangesArray.push(
                /* **************************** New Script -> 20-07-2021 *********************************** */
                /* **************************** Add Script Version -> 20-07-2021 *********************************** */
                "INSERT INTO dbversion(`buildNumber`,`schemaVersion`,`releaseName`,`description`,`createdBy`,`executedFromIPAddress`)" +
                " VALUES (1,'1.00','V1','Sample entry - Bhavik'," + userid + ", '" + requiredDet.ipAddress + "');"
            );
            break;
    }
    return allDbChangesArray;
});