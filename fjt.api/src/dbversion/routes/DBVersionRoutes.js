const dbversion = require('../controllers/DBVersionController');

module.exports = (app) => {
    app.post('/api/v1/dbversion/executeAllRemainingDbScript',
        dbversion.executeAllRemainingDbScript);

    app.post('/api/v1/dbversion/retrieveCurrDBInfo',
        dbversion.retrieveCurrDBInfo);

    app.post('/api/v1/dbversion/executeMsgDBScript',
        dbversion.executeMsgDBScript);

    app.post('/api/v1/dbversion/checkValidUserToExecuteDbScript',
        dbversion.checkValidUserToExecuteDbScript);

    app.post('/api/v1/dbversion/executeIdentityDBScript',
        dbversion.executeIdentityDBScript);

    app.get('/api/v1/dbversion/generateJSonFromMongoDBFromDBScript',
        dbversion.generateJSonFromMongoDBFromDBScript);

    app.get('/api/v1/dbversion/synchronizeAddressLocations',
        dbversion.synchronizeAddressLocations);

    app.post('/api/v1/dbversion/saveTractActivityLog',
        dbversion.saveTractActivityLog);
};
