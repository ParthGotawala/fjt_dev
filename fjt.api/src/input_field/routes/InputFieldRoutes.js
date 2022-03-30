const router = require('express').Router(); // eslint-disable-line
const InputField = require('../controllers/InputFieldController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(InputField.createInputField);

    router.route('/retriveInputFieldList')
        .post(InputField.retriveInputFieldList);

    router
        .route('/:id')
        .get(InputField.retriveInputField)
        .put(InputField.updateInputField);

    router.route('/deleteInputField').post(InputField.deleteInputField);

    router.route('/checkUniqueName').post(InputField.checkUniqueName);

    app.use(
        '/api/v1/inputfield',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
