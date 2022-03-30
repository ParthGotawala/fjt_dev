const router = require('express').Router();

const equipmentTask = require('../controllers/Equipment_TaskController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/')
        .post(equipmentTask.createEquipmentTask);

    router.route('/:id/:isPermanentDelete?')
        .put(equipmentTask.updateEquipmentTask)
        .delete(equipmentTask.deleteEquipmentTask);

    // app.post('/api/v1/uploadEquipmentTaskDocuments',
    //          validateToken,

    //          jwtErrorHandler,
    //          populateUser,
    //          Equipment_Task.uploadEquipmentTaskDocuments);

    // app.get('/api/v1/downloadEquipmentTaskDocument/:gencFileID',
    //     Equipment_Task.downloadEquipmentTaskDocument);

    // app.delete('/api/v1/removeEquipmentTaskDocument/:gencFileID',
    //         validateToken,

    //         jwtErrorHandler,
    //         populateUser,
    //         Equipment_Task.removeEquipmentTaskDocument);

    router.route('/retriveEquipmentTaskDocumentList')
        .post(equipmentTask.retriveEquipmentTaskDocumentList);

    app.use(
        '/api/v1/equipment_task',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
