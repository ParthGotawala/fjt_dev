const router = require('express').Router();

const PageDetailController = require('../controllers/PageDetailController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    // place above '/' because of route conflict
    router.route('/getParentPageDetails')
        .get(PageDetailController.getParentPageDataList);

    router.route('/getPageWithFeatureList')
        .get(PageDetailController.getPageWithFeatureList);

    router.route('/getPageList')
        .get(PageDetailController.getPageList);

    router.route('/getPageDetail')
        .get(PageDetailController.getPageDetail);

    router.route('/getPageName')
        .get(PageDetailController.getPageName);

    router.route('/deletePageDetail')
        .post(PageDetailController.deletePageDetail);

    router.route('/getPageNameList')
        .get(PageDetailController.getPageNameList);

    router.route('/')
        .post(PageDetailController.createPageDetail);

    router.route('/retrivePageDetailList')
        .post(PageDetailController.retrivePageDetailList);

    router.route('/:pageID')
        .get(PageDetailController.retrivePageDetail)
        .put(PageDetailController.updatePageDetail);
    // .delete(PageDetailController.deletePageDetail);


    app.use(
        '/api/v1/pages',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );

    /*  app.get('/api/v1/getParentPageDetails',
         validateToken,
 
         jwtErrorHandler,
         populateUser,
         PageDetailController.getParentPageDataList
     ); */

    /*   app.get('/api/v1/getPageList',
          validateToken,
 
          jwtErrorHandler,
          populateUser,
          PageDetailController.getPageList
      ); */

    /*  app.get('/api/v1/getPageWithFeatureList',
         validateToken,
 
         jwtErrorHandler,
         populateUser,
         PageDetailController.getPageWithFeatureList
     ); */

    /* app.get('/api/v1/getPageDetail',
        validateToken,
 
        jwtErrorHandler,
        populateUser,
        PageDetailController.getPageDetail
    ); */
};