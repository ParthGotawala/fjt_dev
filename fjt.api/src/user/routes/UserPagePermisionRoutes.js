const router = require('express').Router(); // eslint-disable-line

const role = require('../controllers/UserPagePermisionController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');


module.exports = (app) => {
    // place above '/' because of route conflict
    router.route('/getMenuPage/:id/:roleId')
        .get(role.getMenuPages);

    router.route('/getShortcutList/:id/:roleId')
        .get(role.getShortcutList);

    router.route('/isPageAccess')
        .post(role.isPageAccess);

    router.route('/:id')
        .get(role.getuserPagePermision)
        .put(role.updateuserPagePermision);
    
    router.route('/retrieveEmployeeListForRights')
        .post(role.retrieveEmployeeListForRights);
    
    router.route('/updateMulitpleUserPagePermision')
        .post(role.updateMulitpleUserPagePermision);

    router.route('/getHomePageMenu')
        .post(role.getHomePageMenu);

    router.route('/getHomeMenuCategory')
        .post(role.getHomeMenuCategory);

    router.route('/createMenuDisplayOrder')
        .post(role.createMenuDisplayOrder);

    router.route('/getHomeMenuListOrderWise')
        .post(role.getHomeMenuListOrderWise);

    router.route('/createUserPageDtailsDisplayOrder')
        .post(role.createUserPageDtailsDisplayOrder);

    router.route('/createGenericCategoryDisplayOrder')
        .post(role.createGenericCategoryDisplayOrder);

    router.route('/deleteHomeMenuItem')
        .post(role.deleteHomeMenuItem);

    router.route('/CheckIsExistsHomeCategoryMenuItem')
        .post(role.CheckIsExistsHomeCategoryMenuItem);

    router.route('/updateBookmarkDisplayOrder')
        .post(role.updateBookmarkDisplayOrder);

    app.use(
        '/api/v1/userPagePermision',
        // validateToken,

        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
