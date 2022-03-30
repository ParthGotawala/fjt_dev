const _ = require('lodash');
const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const rfqRoHSPeerModuleName = DATA_CONSTANT.ROHS_PEER.NAME;

const inputFields = [
    'id',
    'rohsID',
    'rohsPeerID',
    'isDeleted',
    'createdBy',
    'updatedBy',
    'deletedBy',
    'createByRoleId',
    'updateByRoleId',
    'deleteByRoleId'
];

module.exports = {
    // Get list of RoHS Peer
    // GET : /api/v1/getRoHSPeer
    // @param {employeeID} int
    // @return list of RoHS Peer
    getRoHSPeer: (req, res) => {
        const { RFQRoHSPeer, RFQRoHS } = req.app.locals.models;
        if (req.params.id) {
            return RFQRoHSPeer.findAll({
                where: {
                    rohsID: req.params.id
                },
                attributes: ['id', 'rohsID', 'rohsPeerID'],
                include: [{
                    model: RFQRoHS,
                    as: 'peerRoHS',
                    attributes: ['id', 'name', 'refParentID']
                }]
            }).then(rohsPeers => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, rohsPeers, null)).catch((err) => {
                console.trace();
                console.error(err);
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
            });
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    },
    // Create RoHS Peer
    // POST : /api/v1/saveRoHSPeer
    // @return new created RoHS Peer
    saveRoHSPeer: (req, res) => {
        const { RFQRoHSPeer, sequelize } = req.app.locals.models;
        if (req.body.listObj) {
            const promises = [];
            if (req.body.listObj.newRoHSPeer.length > 0) {
                const newRohsPeerIds = _.map(req.body.listObj.newRoHSPeer, 'rohsPeerID');

                return sequelize.query('CALL Sproc_validatePeerRohs (:pRoHSID,:pPeerRoHSIDs)', {
                    replacements: {
                        pRoHSID: req.body.listObj.rohsID,
                        pPeerRoHSIDs: newRohsPeerIds.join()
                    }
                }).then((response) => {
                    if (response[0].itemCount > 0) {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.MASTER.INVALID_PEER_ROHS, err: null, data: null });
                    } else {
                        if (req.body.listObj.newRoHSPeer.length > 0) {
                            COMMON.setModelCreatedArrayFieldValue(req.user, req.body.listObj.newRoHSPeer);
                            promises.push(RFQRoHSPeer.bulkCreate(req.body.listObj.newRoHSPeer, {
                                fields: inputFields,
                                updateOnDuplicate: ['rohsID', 'rohsPeerID']
                            }));
                        }
                        if (req.body.listObj.deletedRoHSPeer.length > 0) {
                            COMMON.setModelDeletedByFieldValue(req);
                            promises.push(RFQRoHSPeer.update({ isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
                                where: {
                                    rohsID: req.body.listObj.rohsID,
                                    rohsPeerID: req.body.listObj.deletedRoHSPeer
                                },
                                fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId']
                            }));
                        }
                        return Promise.all(promises).then(responses => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responses, MESSAGE_CONSTANT.UPDATED(rfqRoHSPeerModuleName))).catch((err) => {
                            console.trace();
                            console.error(err);
                            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                        });
                    }
                }).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            } else {
                if (req.body.listObj.deletedRoHSPeer.length > 0) {
                    COMMON.setModelDeletedByFieldValue(req);
                    promises.push(RFQRoHSPeer.update({ isDeleted: true, deletedBy: COMMON.getRequestUserID(req), deletedAt: COMMON.getCurrentUTC(), deleteByRoleId: COMMON.getRequestUserLoginRoleID(req) }, {
                        where: {
                            rohsID: req.body.listObj.rohsID,
                            rohsPeerID: req.body.listObj.deletedRoHSPeer
                        },
                        fields: ['deletedBy', 'deletedAt', 'isDeleted', 'deleteByRoleId']
                    }));
                }
                return Promise.all(promises).then(responses => resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, responses, MESSAGE_CONSTANT.UPDATED(rfqRoHSPeerModuleName))).catch((err) => {
                    console.trace();
                    console.error(err);
                    return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
                });
            }
        } else {
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.FAILED, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
        }
    }

};