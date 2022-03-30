const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderOperationEquipmentFeederDetails = sequelize.define('WorkorderOperationEquipmentFeederDetails', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        eqpID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woOPID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woOpEqpID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        feederLocation: {
            type: Sequelize.STRING,
            allowNull: true
        },
        supply: {
            type: Sequelize.STRING,
            allowNull: true
        },
        usedon: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mfgPNID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        feederDescription: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        placementType: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        setupComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        qty: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        col1: {
            type: Sequelize.STRING,
            allowNull: true
        },
        col2: {
            type: Sequelize.STRING,
            allowNull: true
        },
        col3: {
            type: Sequelize.STRING,
            allowNull: true
        },
        col4: {
            type: Sequelize.STRING,
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
        recommendedLineItem: {
            type: Sequelize.DECIMAL(16, 8),
            allowNull: true
        },
        isApprovelineItems: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        systemrecommended: {
            type: Sequelize.DECIMAL(16, 8),
            allowNull: true
        },
        lineItemSelectReason: {
            type: Sequelize.STRING,
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
        tableName: 'workorder_operation_equipment_feeder_details'
    });

    WorkorderOperationEquipmentFeederDetails.associate = (models) => {
        WorkorderOperationEquipmentFeederDetails.hasMany(models.WorkorderOperationFeederLineitemDetails, {
            as: 'workorderOperationFeederLineitemDetails',
            foreignKey: 'eqpFeederID'
        });
    };

    return WorkorderOperationEquipmentFeederDetails;
};
