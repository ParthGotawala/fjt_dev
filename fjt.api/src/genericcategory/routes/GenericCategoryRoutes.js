const router = require('express').Router(); // eslint-disable-line
const GenericCategory = require('../controllers/GenericCategoryController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  // place above '/' because of route conflict
  router.route('/getAllGenericCategoryList')
    .get(GenericCategory.getAllGenericCategoryList);

  router.route('/getAllGenericCategoryByCategoryType')
    .post(GenericCategory.getAllGenericCategoryByCategoryType);

  router.route('/downloadGenericCategoryTemplate/:categoryType')
    .get(GenericCategory.downloadGenericCategoryTemplate);

  router.route('/getSelectedGenericCategoryList')
    .post(GenericCategory.getSelectedGenericCategoryList);

  router.route('/uploadGenericDocuments')
    .post(GenericCategory.uploadGenericDocuments);

  router.route('/retriveGenericCategoryList')
    .post(GenericCategory.retriveGenericCategoryList);

  router.route('/')
    //.post(GenericCategory.retriveGenericCategory)
    .post(GenericCategory.createGenericCategory);

    router.route('/retriveGenericCategory')
        .post(GenericCategory.retriveGenericCategory);
  
  router.route('/:id/:categoryType?')
    //.get(GenericCategory.retriveGenericCategory)
    .put(GenericCategory.updateGenericCategory);

  router.route('/deleteGenericCategory')
    .post(GenericCategory.deleteGenericCategory);

  router.route('/checkGenericCategoryAlreadyExists')
    .post(GenericCategory.checkGenericCategoryAlreadyExists);

  app.use(
    '/api/v1/genericcategory',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );

  /*   app.get('/api/v1/getAllGenericCategoryList',
      validateToken,
 
      jwtErrorHandler,
      populateUser,
      GenericCategory.getAllGenericCategoryList
    ); */

  /* app.get('/api/v1/getAllGenericCategoryByCategoryType/:categoryType',
    validateToken,
 
    jwtErrorHandler,
    populateUser,
    GenericCategory.getAllGenericCategoryByCategoryType
  );
 */
  /*   app.post('/api/v1/getSelectedGenericCategoryList',
      validateToken,
 
      jwtErrorHandler,
      populateUser,
      GenericCategory.getSelectedGenericCategoryList
    );
   */
  /*  app.get('/api/v1/downloadGenericCategoryTemplate/:categoryType',
     GenericCategory.downloadGenericCategoryTemplate
   ); */

  /*  app.post('/api/v1/uploadGenericDocuments',
     GenericCategory.uploadGenericDocuments); */
};
