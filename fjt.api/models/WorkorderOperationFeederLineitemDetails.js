const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderOperationFeederLineitemDetails = sequelize.define('WorkorderOperationFeederLineitemDetails', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        eqpFeederID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        rfqLineItemID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        lineID: {
            type: Sequelize.DECIMAL(16, 8),
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
        tableName: 'workorder_operation_feeder_lineitem_details'
    });

    WorkorderOperationFeederLineitemDetails.associate = (models) => {
        WorkorderOperationFeederLineitemDetails.belongsTo(models.WorkorderOperationEquipmentFeederDetails, {
            as: 'workorderOperationEquipmentFeederDetails',
            foreignKey: 'eqpFeederID'
        });
    };

    return WorkorderOperationFeederLineitemDetails;
};
