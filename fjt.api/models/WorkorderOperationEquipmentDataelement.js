
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderOperationEquipmentDataelement = sequelize.define('WorkorderOperationEquipmentDataelement', {
        woOpEqpDataElementID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        opID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        eqpID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 11]
            }
        },
        dataElementID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 11]
            }
        },
        displayOrder: {
            type: Sequelize.DECIMAL(6, 2),
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        woOPID: {
            type: Sequelize.INTEGER,
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
        tableName: 'workorder_operation_equipment_dataelement'
    });

    WorkorderOperationEquipmentDataelement.associate = (models) => {
        WorkorderOperationEquipmentDataelement.belongsTo(models.DataElement, {
            foreignKey: 'dataElementID',
            as: 'dataelement'
        });
    };

    return WorkorderOperationEquipmentDataelement;
};
