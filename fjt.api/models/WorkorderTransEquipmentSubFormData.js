const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransEquipmentSubFormData = sequelize.define('WorkorderTransEquipmentSubFormData', {
        woTransEqpSubFormDataID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        parentDataElementID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        rowNumber: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: false
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        createByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        updateByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'workorder_trans_equipment_subform_data'
    });
    return WorkorderTransEquipmentSubFormData;
};
