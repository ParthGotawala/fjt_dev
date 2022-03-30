const router = require('express').Router(); // eslint-disable-line
const WorkorderOperationCluster = require('../controllers/Workorder_Operation_ClusterController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/')
    .get(WorkorderOperationCluster.retriveWorkorderOperationClusters)
    .post(WorkorderOperationCluster.createWorkorderOperationCluster)
    .put(WorkorderOperationCluster.updateWorkorderOperationCluster);

  router.route('/:id')
    .get(WorkorderOperationCluster.retriveWorkorderOperationClusters);
  // .put(Workorder_Operation_Cluster.updateWorkorderOperationCluster)
  // .delete(Workorder_Operation_Cluster.Workorder_Operation_Cluster);

  app.use(
    '/api/v1/workorder_operation_cluster',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router
  );
  router.route('/deleteClusterOperationFromWorkOrder')
    .post(WorkorderOperationCluster.deleteClusterOperationFromWorkOrder);
};
