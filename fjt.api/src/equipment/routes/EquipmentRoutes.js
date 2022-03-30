const router = require('express').Router();

const equipment = require('../controllers/EquipmentController');
const populateUser = require('../../auth/populateUser');
const jwtErrorHandler = require('../../auth/jwtErrorHandler');
const config = require('../../../config/app_config');
const validateToken = require('../../auth/validateToken');

module.exports = (app) => {
    router.route('/downloadequipmentAndworkstationTemplate/:model')
        .get(equipment.downloadequipmentAndworkstationTemplate);
    // place above '/' because of route conflict

    router.route('/getequipmentlist')
        .get(equipment.getequipmentlist);

    router.route('/downloadEquipmentDocument/:gencFileID')
        .get(equipment.downloadEquipmentDocument);

    router.route('/retrieveEquipmentProfile/:id')
        .get(equipment.retrieveEquipmentProfile);

    router.route('/getAssemblySamplesList')
        .get(equipment.getAssemblySamplesList);

    router.route('/retrieveAllWOOPEquipmentforTransDataElement/:woID/:woOPID')
        .get(equipment.retrieveAllWOOPEquipmentforTransDataElement);

    router.route('/')
        .post(equipment.createEquipment);

    router.route('/retriveEquipmentList')
        .post(equipment.retriveEquipmentList);

    router.route('/:id/:isPermanentDelete?')
        .get(equipment.retriveEquipment)
        .put(equipment.updateEquipment);

    router.route('/saveEquipmentMaintenanceSchedule/:id')
        .post(equipment.saveEquipmentMaintenanceSchedule);

    router.route('/retriveEquipmentDocumentList')
        .post(equipment.retriveEquipmentDocumentList);

    router.route('/retriveEmployeeEquipmentsWithProfile')
        .post(equipment.retriveEmployeeEquipmentsWithProfile);

    router.route('/getOperationEquipmentlist')
        .post(equipment.getOperationEquipmentlist);

    router.route('/deleteEquipment')
        .post(equipment.deleteEquipment);

    router.route('/checkEquipmentAndWorkstationNameAlreadyExists')
        .post(equipment.checkEquipmentAndWorkstationNameAlreadyExists);

    router.route('/checkEquipmentInWarehouse')
        .post(equipment.checkEquipmentInWarehouse);

    router.route('/getequipmentBySearch')
        .post(equipment.getequipmentBySearch);

    app.use(
        '/api/v1/equipment',
        validateToken,

        jwtErrorHandler,
        populateUser,
        router
    );
};
