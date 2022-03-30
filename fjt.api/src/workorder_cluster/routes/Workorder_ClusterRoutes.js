const router = require('express').Router(); // eslint-disable-line
const WorkorderCluster = require('../controllers/Workorder_ClusterController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .get(WorkorderCluster.retriveWorkorderClusters)
        .post(WorkorderCluster.createWorkorderCluster);

    router.route('/:id')
        .get(WorkorderCluster.retriveWorkorderClusters)
        .put(WorkorderCluster.updateWorkorderCluster)
        .delete(WorkorderCluster.deleteWorkorderCluster);

    router.route('/retriveClusterListbyWoID/:woID')
        .get(WorkorderCluster.retriveClusterListbyWoID);

    router.route('/checkDuplicateWOClusterName')
        .post(WorkorderCluster.checkDuplicateWOClusterName);


    app.use(
        '/api/v1/workorder_cluster',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
