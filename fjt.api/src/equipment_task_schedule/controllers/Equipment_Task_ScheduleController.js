const resHandler = require('../../resHandler');
const { STATE, REQUEST, COMMON } = require('../../constant');
const { InvalidPerameter, NotUpdate } = require('../../errors');
const { MESSAGE_CONSTANT } = require('../../../constant');

const inputFields = [
    'eqpTaskScheduleID',
    'eqpTaskID',
    'repeatsType',
    'dayType',
    'monthDate',
    'monthType',
    'scheduleStartTime',
    'repeatEnd',
    'endOnDate',
    'endAfterOccurrence',
    'scheduleRemarks',
    'isDeleted',
    'isActive',
    'deletedAt',
    'createdBy',
    'updatedBy',
    'deletedBy'
];

module.exports = {
    /* Save-update Equipments Maintenance Schedule*/
    saveEquipmentMaintenanceTaskSchedule: (req, res) => {
        const EquipmentTaskSchedule = req.app.locals.models.EquipmentTaskSchedule;
        if (req.params.id) {
            COMMON.setModelUpdatedByFieldValue(req);
            EquipmentTaskSchedule.update(req.body, {
                where: {
                    eqpTaskScheduleID: req.params.id
                },
                fields: inputFields
            }).then((rowsUpdated) => {
                if (rowsUpdated[0] === 1) {
                    resHandler.successRes(res, 200, STATE.SUCCESS, { userMessage: MESSAGE_CONSTANT.EQUIPMENT_TASK_SCHEDULE.SAVED });
                } else {
                    resHandler.errorRes(res, 200, STATE.EMPTY,
                        new NotUpdate(MESSAGE_CONSTANT.EQUIPMENT_TASK_SCHEDULE.NOT_SAVED));
                }
            }).catch((err) => {
                console.trace();
                console.error(err);
                if (err.message === COMMON.VALIDATION_ERROR && err.errors && err.errors.length > 0) {
                    resHandler.errorRes(res, 200, STATE.FAILED, null, err.errors.map(e => e.message).join(','));
                } else {
                    console.trace();
                    console.error(err);
                    resHandler.errorRes(res, 200, STATE.EMPTY, new NotUpdate(MESSAGE_CONSTANT.EQUIPMENT_TASK_SCHEDULE.NOT_SAVED));
                }
            });
        } else {
            resHandler.errorRes(res, 200, STATE.FAILED, new InvalidPerameter(REQUEST.INVALID_PARAMETER));
        }
    }

};
