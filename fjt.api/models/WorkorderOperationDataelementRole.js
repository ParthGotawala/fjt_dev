const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderOperationDataelementRole = sequelize.define('WorkorderOperationDataelementRole', {
        woOPDataElementRoleID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woOpDataElementID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 11]
            }
        },
        roleID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 11]
            }
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
        tableName: 'workorder_operation_dataelement_role'
    });

    WorkorderOperationDataelementRole.associate = (models) => {
        WorkorderOperationDataelementRole.belongsTo(models.WorkorderOperationDataelement, {
            foreignKey: 'woOpDataElementID',
            as: 'workorder_Operation_DataElement_Id'
        });
        WorkorderOperationDataelementRole.belongsTo(models.Role, {
            foreignKey: 'roleID',
            as: 'workorder_Operation_DataElement_role'
        });
    };

    return WorkorderOperationDataelementRole;
};
