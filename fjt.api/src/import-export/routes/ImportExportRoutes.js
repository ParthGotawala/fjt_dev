const router = require('express').Router(); // eslint-disable-line
const ImportExport = require('../controllers/ImportExportController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
        /* router.route('/uploadmodelDocuments')
                .post(ImportExport.uploadmodelDocuments);
    */
        router.route('/importFile')
                .post(ImportExport.downloadEXCELFile);

        router.route('/createEntity')
                .post(ImportExport.createEntity);

        router.route('/getFieldList/:entity')
                .get(ImportExport.getFieldList);

        router.route('/getEntityFieldListByTableName/:entityTableName')
                .get(ImportExport.getEntityFieldListByTableName);

        app.use('/api/v1/ImportExport',
                validateToken,

                jwtErrorHandler,
                populateUser,
                router
        );

        app.post('/api/v1/uploadmodelDocuments',
                ImportExport.uploadmodelDocuments);

        /*   app.post('/api/v1/importFile',
                  validateToken,
 
                  jwtErrorHandler,
                  populateUser,
                  ImportExport.downloadEXCELFile
                  );
           app.post('/api/v1/createEntity',
                  validateToken,
 
                  jwtErrorHandler,
                  populateUser,
                  ImportExport.createEntity
                  ); */
};
