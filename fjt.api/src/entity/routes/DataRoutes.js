const router = require('express').Router(); // eslint-disable-line
const entity = require('../controllers/EntityController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(entity.createEntity);

    router.route('/retriveEntitiesList')
        .post(entity.retriveEntitiesList);

    router.route('/:id/:systemGenerated?/:entityName?')
        .get(entity.retriveEntities)
        .put(entity.updateEntity);

    router.route('/deleteEntity')
        .post(entity.deleteEntity);

    app.post('/api/v1/entities/detail',
        entity.getEntityByName);

    app.get('/api/v1/entities/getAllEntityWithUniqueDataElement',
        entity.getAllEntityWithUniqueDataElement);

    app.get('/api/v1/entities/getAllEntityWithDataElements',
        entity.getAllEntityWithDataElements);

    app.get('/api/v1/entities/getWithDataElementsByEntityIds/:EntityIds',
        entity.getWithDataElementsByEntityIds);

    app.get('/api/v1/entities/getAllCustomFormEntityByAccessPermissionOfEmployee',
        entity.getAllCustomFormEntityByAccessPermissionOfEmployee);

    app.get('/api/v1/entities/getAllEntity',
        entity.getAllEntity);

    // app.get('/api/v1/entities/retrieveGenericReportCategories',
    // entity.retrieveGenericReportCategories);

    router.route('/retrieveGenericReportCategories')
    .post(entity.retrieveGenericReportCategories);

    app.get('/api/v1/entities/retrieveSystemGeneratedEntities',
        entity.retrieveSystemGeneratedEntities);

    router.route('/retrieveEntityAllEmployeeDetails')
        .post(entity.retrieveEntityAllEmployeeDetails);

    router.route('/createEntityEmployeeList')
        .post(entity.createEntityEmployeeList);

    router.route('/deleteEntityEmployeeList')
        .post(entity.deleteEntityEmployeeList);

    router.route('/updateEntityEmployeePermission')
        .post(entity.updateEntityEmployeePermission);

    router.route('/checkDuplicateEntityName')
        .post(entity.checkDuplicateEntityName);

    app.use(
        '/api/v1/entities',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
