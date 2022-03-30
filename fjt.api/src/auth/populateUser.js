const resHandler = require('../resHandler');
const { STATE, COMMON } = require('../constant');
var jwt = require('jsonwebtoken');
const _ = require('lodash');

function GetUserID(req) {
    var id;
    if (req.headers && req.headers.authorization) {
        const headerArray = req.headers.authorization.split(' ');
        if (headerArray.length === 2) {
            const scheme = headerArray[0];
            const credentials = headerArray[1];
            if (/^Bearer$/i.test(scheme)) {
                const token = credentials;
                const dcodetoken = jwt.decode(token, { complete: true }) || {};
                id = dcodetoken.payload.userid;
            }
        }
    }
    return id;
}

const populateUser = (req, res, next) => {
    // requestObject = req;
    const userid = GetUserID(req);
    const {
        sequelize
    } = req.app.locals.models;

    if (userid) {
        return sequelize.query('CALL Sproc_GetUserAuthDetail(:pUserID)', {
            replacements: {
                pUserID: userid || null
            },
            type: sequelize.QueryTypes.SELECT
        }).then((response) => {
            if (response && response.length > 0) {
                const userDetail = _.first(_.values(response[0]));
                if (!userDetail) {
                    return resHandler.errorRes(res, 200, STATE.EMPTY, 'Unauthorized user');
                }

                const user = {
                    id: userDetail.id,
                    identityUserId: userDetail.IdentityUserId,
                    username: userDetail.username,
                    emailAddress: userDetail.emailAddress,
                    firstName: userDetail.firstName,
                    lastName: userDetail.lastName,
                    deletedAt: userDetail.deletedAt,
                    isDeleted: userDetail.isDeleted,
                    employeeID: userDetail.employeeID,
                    printerID: userDetail.printerID,
                    defaultLoginRoleID: userDetail.defaultLoginRoleID,
                    employee: {
                        id: userDetail.employeeID,
                        isActive: userDetail.isActive,
                        initialName: userDetail.initialName
                    }
                };
                req.user = user;
                COMMON.setLoggedInUser(user);

                if (response.length > 1) {
                    const objTextAngularKeyCode = _.find(_.values(response[1]), { key: 'TextAngularKeyCode' });
                    if (objTextAngularKeyCode) {
                        const objKeyCode = JSON.parse(objTextAngularKeyCode.values);
                        if (objKeyCode) {
                            COMMON.setTextAngularAPIKeyCode(objKeyCode.textAngularAPIKeyCode);
                            COMMON.setTextAngularWebKeyCode(objKeyCode.textAngularWebKeyCode);
                        }
                    }
                }
                next();
                return null;
            } else {
                return resHandler.errorRes(res, 200, STATE.EMPTY, 'Unauthorized user');
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 500, STATE.FAILED, 'Something went wrong');
        });
    }
    return resHandler.errorRes(res, 200, STATE.FAILED, 'User not found');
};

module.exports = populateUser;

