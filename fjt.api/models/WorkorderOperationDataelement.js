const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderOperationDataelement = sequelize.define('WorkorderOperationDataelement', {
        woOpDataElementID: {
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
        tableName: 'workorder_operation_dataelement'
    });

    WorkorderOperationDataelement.associate = (models) => {
        // WorkorderOperationDataelement.belongsTo(models.Operation, {
        //     as: 'operation_workorder',
        //     foreignKey: 'opID'
        // });
        // WorkorderOperationDataelement.belongsTo(models.Workorder, {
        //     as: 'workorder',
        //     foreignKey: 'woID'
        // });
        WorkorderOperationDataelement.belongsTo(models.DataElement, {
            foreignKey: 'dataElementID',
            as: 'dataelement'
        });
        WorkorderOperationDataelement.hasMany(models.WorkorderOperationDataelementRole, {
            foreignKey: 'woOpDataElementID',
            as: 'workorder_Operation_DataElement_Id'
        });
    };

    return WorkorderOperationDataelement;
};
