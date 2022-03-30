const router = require('express').Router();

const ReleaseNotesDetailController = require('../controllers/ReleaseNotesController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/getReleaseNotes/:Id')
    .get(ReleaseNotesDetailController.getReleaseNoteDetailInfo);

  router.route('/getReleaseVersion')
    .get(ReleaseNotesDetailController.getReleaseVersion);

  router.route('/releaseNotesValidation')
    .post(ReleaseNotesDetailController.releaseNotesValidation);

  router.route('/saveReleaseDetails')
    .post(ReleaseNotesDetailController.saveReleaseDetails);

  router.route('/saveReleaseNotesDetails')
    .post(ReleaseNotesDetailController.saveReleaseNotesDetails);

  router.route('/deleteReleaseNotesDetails')
    .post(ReleaseNotesDetailController.deleteReleaseNotesDetails);

  router.route('/deleteReleaseDetails')
    .post(ReleaseNotesDetailController.deleteReleaseDetails);

  router.route('/getLatestReleaseVersion')
    .get(ReleaseNotesDetailController.getLatestReleaseVersion)

  app.use(
    '/api/v1/release_notes',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
};