const { STATE, REQUEST, COMMON } = require('../../constant');
const { NotFound, NotCreate, InvalidPerameter } = require('../../errors');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');

const moduleName = DATA_CONSTANT.AGREEMENT.NAME;

const resHandler = require('../../resHandler');

module.exports = {

    /* comment by BT - 23-02-2021 - i think below Functionality is extra as we move agreement flow in identiyserver side */
    // createUserAgreement: (req, res) => {
    //     const UserAgreement = req.app.locals.models.UserAgreement;
    //     if (req.body) {
    //         COMMON.setModelCreatedByFieldValue(req);
    //         UserAgreement.create(req.body, {
    //         })
    //             .then(() => {
    //                 resHandler.successRes(res, 200, STATE.SUCCESS, null);
    //             })
    //             .catch((err) => {
    //                 console.trace();
    //                 console.error(err);
    //                 resHandler.errorRes(res, 200,
    //                     STATE.EMPTY,
    //                     new NotCreate(MESSAGE_CONSTANT.NOT_CREATED(moduleName)));
    //             });
    //     } else {
    //         resHandler.errorRes(res,
    //             200,
    //             STATE.FAILED,
    //             new InvalidPerameter(REQUEST.INVALID_PARAMETER));
    //     }
    // },
    // checkUserAgrrementByID: (req, res) => {
    //     const { UserAgreement } = req.app.locals.models;
    //     UserAgreement.findAll({
    //         where: {
    //             userID: req.params.id
    //         }
    //        }).then((type) => {
    //         if (!type) {
    //             return Promise.reject(new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName)));
    //         }
    //         return resHandler.successRes(res, 200, STATE.SUCCESS, type);
    //     }).catch((err) => {
    //         console.trace();
    //         console.error(err);
    //         resHandler.errorRes(res, 200, STATE.EMPTY, new NotFound(MESSAGE_CONSTANT.NOT_FOUND(moduleName), err));
    //     });
    // }
};