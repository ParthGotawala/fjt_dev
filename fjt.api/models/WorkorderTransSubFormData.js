const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransSubFormData = sequelize.define('WorkorderTransSubFormData', {
        woTransSubFormDataID: {
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
        tableName: 'workorder_trans_subform_data'
    });
    return WorkorderTransSubFormData;
};
