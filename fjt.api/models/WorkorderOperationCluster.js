const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderOperationCluster = sequelize.define('WorkorderOperationCluster', {
        woClusterID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        clusterID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        opID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woOPID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        displayOrder: {
            type: Sequelize.DECIMAL(6, 2),
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
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
        deletedAt: {
            type: Sequelize.DATE,
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
        tableName: 'workorder_operation_cluster'
    });

    WorkorderOperationCluster.associate = (models) => {
        WorkorderOperationCluster.belongsTo(models.Operation, {
            as: 'clusterOperation',
            foreignKey: 'opID'
        });
        WorkorderOperationCluster.belongsTo(models.WorkorderOperation, {
            as: 'workorderOperation',
            foreignKey: 'woOPID'
        });
        WorkorderOperationCluster.belongsTo(models.WorkorderCluster, {
            as: 'clusterWorkorder',
            foreignKey: 'clusterID'
        });
    };

    return WorkorderOperationCluster;
};
