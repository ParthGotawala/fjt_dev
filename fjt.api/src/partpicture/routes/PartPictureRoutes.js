const routerWithoutTocken = require('express').Router(); // eslint-disable-line
// eslint-disable-line
const partpicture = require('../controllers/PartPictureController');

module.exports = (app) => {
    app.use(
        '/api/v1/partapi',
        routerWithoutTocken
    );

    routerWithoutTocken.route('/getFileUploadStatus')
        .post(partpicture.getFileUploadStatus);
};
