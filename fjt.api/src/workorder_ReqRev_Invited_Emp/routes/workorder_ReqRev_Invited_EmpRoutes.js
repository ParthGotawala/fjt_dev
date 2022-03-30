const router = require('express').Router(); // eslint-disable-line
const WorkorderReqRevInvitedEmp = require('../controllers/Workorder_ReqRev_Invited_EmpController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
  router.route('/inviteEmployeeForWorkorderReview')
    .post(WorkorderReqRevInvitedEmp.inviteEmployeeForWorkorderReview);

  router.route('/getInvitedEmployeeForWorkorderReview')
    .post(WorkorderReqRevInvitedEmp.getInvitedEmployeeForWorkorderReview);

  router.route('/getReqRevInvitedEmpList/:woRevReqID')
    .get(WorkorderReqRevInvitedEmp.getReqRevInvitedEmpList);
  router.route('/getCoOwnerEmpList/:woID')
    .get(WorkorderReqRevInvitedEmp.getCoOwnerEmpList);
  router.route('/saveCoOwnerEmployeeDetail')
    .post(WorkorderReqRevInvitedEmp.saveCoOwnerEmployeeDetail);

  app.use('/api/v1/workorder_ReqRev_Invited_Emp',
    validateToken,

    jwtErrorHandler,
    populateUser,
    router);
};
