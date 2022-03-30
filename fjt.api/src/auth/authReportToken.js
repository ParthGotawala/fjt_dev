const resHandler = require('../resHandler');
const { STATE } = require('../constant');
// const _ = require('lodash');

function GetClientTokenID(req) {
    var id;
    // console.log("req.headers.authorization : ",req.headers.authorization);
    if (req.headers && req.headers.authorization) {
        const headerArray = req.headers.authorization.split(' ');
        if (headerArray.length === 2) {
            // console.log("Bearer ---->  " + headerArray[0]);
            // const scheme = headerArray[0];
            const credentials = headerArray[1];
            id = credentials;
            // if (/^Bearer$/i.test(scheme)) {
            //     var token = credentials;
            //     //console.log("token : -----> " + token);
            //     var dcodetoken = jwt.decode(token, { complete: true }) || {};
            //     //console.log("dcodetoken  :  ----> " + JSON.stringify(dcodetoken.payload));
            //     id = dcodetoken.payload.id;
            // }
        }
    }
    return id;
}


const authReportTokenUser = (req, res, next) => {
    var clientTokenId = GetClientTokenID(req);
    const {
        LicenseInfo
    } = req.app.locals.models;

    if (clientTokenId) {
        return LicenseInfo.findOne({
            where: {
                clientToken: clientTokenId
            }
        }).then((response) => {
            if (response && response.id > 0) {
                next();
                return null;
            } else {
                return resHandler.errorRes(res, 401, STATE.EMPTY, 'Unauthorized user');
            }
        }).catch((err) => {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, 500, STATE.FAILED, 'Something went wrong');
        });
    } else {
        return resHandler.errorRes(res, 500, STATE.FAILED, 'Client not found');
    }
};

module.exports = authReportTokenUser;