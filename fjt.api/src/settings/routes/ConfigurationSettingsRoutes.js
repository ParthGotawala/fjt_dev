const router = require('express').Router(); // eslint-disable-line
const SettingsController = require('../controllers/SettingsController');
// const populateUser = require('../../auth/populateUser');

module.exports = (app) => {
    app.get('/api/v1/configurationsettings/getDefinedGlobalSettingKeyValues',
        SettingsController.getDefinedGlobalSettingKeyValues);

    app.use(
        '/api/v1/configurationsettings',
        // validateToken,
        // jwtErrorHandler,
        // populateUser,
        router
    );
};
