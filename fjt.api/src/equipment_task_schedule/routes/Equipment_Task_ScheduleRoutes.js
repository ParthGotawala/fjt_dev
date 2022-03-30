const router = require('express').Router();

const equipmentTaskSchedule = require('../controllers/Equipment_Task_ScheduleController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/:id').put(equipmentTaskSchedule.saveEquipmentMaintenanceTaskSchedule);

    app.use('/api/v1/equipment_task_schedule',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
