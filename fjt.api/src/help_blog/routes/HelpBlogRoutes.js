const router = require('express').Router(); // eslint-disable-line
const HelpBlogController = require('../controllers/HelpBlogController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const validateToken = require('../../auth/validateToken');


module.exports = (app) => {
    router.route('/helpBlogDetailByKeyword')
        .get(HelpBlogController.helpBlogDetailByKeyword);

    router.route('/saveBlog')
        .post(HelpBlogController.saveBlog);

    router.route('/checkUniqueHelpBlog')
        .post(HelpBlogController.checkUniqueHelpBlog);

    router.route('/checkUniqueHelpBlogTitle')
        .post(HelpBlogController.checkUniqueHelpBlogTitle);

    router.route('/getHelpBlogDetailByPageId/:pageID')
        .get(HelpBlogController.getHelpBlogDetailByPageId);

    /* User Story 30275: Help Blog: Improvement Points Suggested By JV - Charmi Patel */
    router.route('/getHelpBlogDetailList')
        .get(HelpBlogController.getHelpBlogDetailList);

    router.route('/getHelpBlogNotesById/:Id')
        .get(HelpBlogController.getHelpBlogNotesById);

    router.route('/deleteHelpBlogNotes')
        .post(HelpBlogController.deleteHelpBlogNotes);

    router.route('/saveHelpBlogNotes')
        .post(HelpBlogController.saveHelpBlogNotes);

    router.route('/getHelpBlogHistory')
        .post(HelpBlogController.getHelpBlogHistory);

    router.route('/getHelpBlogDetailById/:id')
        .get(HelpBlogController.getHelpBlogDetailById);

    router.route('/updateBulkDisplayOrder')
        .post(HelpBlogController.updateBulkDisplayOrder);

    router.route('/getHelpBlogTemplateDetails')
        .post(HelpBlogController.getHelpBlogTemplateDetails);

        
    app.use('/api/v1/helpBlog',
        validateToken,
        jwtErrorHandler,
        populateUser,
        router
    );
};
