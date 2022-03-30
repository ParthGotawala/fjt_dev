/* eslint-disable no-console */

const resHandler = require('../../resHandler');
const { STATE, COMMON } = require('../../constant');
const { MESSAGE_CONSTANT, DATA_CONSTANT } = require('../../../constant');
const _ = require('lodash');

const ServiceController = require('nodejs-windows-service-controller');

module.exports = {
    // Retrive list of services status from Windows service controller
    // POST : /api/v1/servicestatus/getServiceStatus
    // @return list of services status
    getServiceStatus: (req, res) => {
        try {
            if (req.body && req.body.servicesName) {
                var serviceList = req.body.servicesName;
                const promiseList = (serviceList || []).map((serviceName) => {
                    const service = new ServiceController(serviceName);
                    return service.getInfo();
                });
                const services = [];
                return Promise.all(promiseList.map(p => p.catch(e => e))).then((response) => {
                    response.map((result, index) => {
                        if (!(result instanceof Error)) {
                            services.push({
                                serviceName: result.ServiceName,
                                status: result.Status
                            });
                        } else {
                            services.push({
                                serviceName: serviceList[index],
                                status: "Unavailable"
                            });
                        }
                    })
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, services, null);
                })
            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            }
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    },
    // Do the service start or Stop.
    // POST : /api/v1/servicestatus/manageServicesmanageServices
    // @return the status of service.
    manageServices: async (req, res) => {
        try {
            if (req.body && req.body.serviceName && req.body.status != null) {
                const serviceName = req.body.serviceName;
                const serviceActive = req.body.status;
                const service = new ServiceController(serviceName);

                const serviceInfo = await service.getInfo();
                if (!serviceActive && serviceInfo) {
                    if (serviceInfo.CanStop) {
                        await service.stop();
                        await service.waitForStatus("Stopped");
                    } else {
                        return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.STATICMSG('Service Can not be Stopped.'), err: null, data: null });
                    }
                }
                else if (serviceActive && service) {
                    await service.start();
                    await service.waitForStatus("Running");
                }
                const serviceUpdatedInfo = await service.getInfo();
                if (serviceUpdatedInfo) {
                    return resHandler.successRes(res, DATA_CONSTANT.API_RESPONSE_CODE.SUCCESS, STATE.SUCCESS, {
                        serviceName: serviceUpdatedInfo.ServiceName,
                        status: serviceUpdatedInfo.Status
                    }, null);
                }

            } else {
                return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.EMPTY, { messageContent: MESSAGE_CONSTANT.GLOBAL.INVALID_PARAMETER, err: null, data: null });
            }
        } catch (err) {
            console.trace();
            console.error(err);
            return resHandler.errorRes(res, DATA_CONSTANT.API_RESPONSE_CODE.ERROR, STATE.ERROR, { messageContent: MESSAGE_CONSTANT.GLOBAL.SOMTHING_WRONG, err: err, data: null });
        }
    }
};