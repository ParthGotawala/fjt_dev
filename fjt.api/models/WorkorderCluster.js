const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderCluster = sequelize.define('WorkorderCluster', {
        clusterID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        clusterName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        displayOrder: {
            type: Sequelize.DECIMAL(6, 2),
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isParellelOperation: {
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
        tableName: 'workorder_cluster'
    });

    WorkorderCluster.associate = (models) => {
        WorkorderCluster.hasMany(models.WorkorderOperationCluster, {
            foreignKey: 'clusterID',
            as: 'workorderOperationCluster'
        });
        WorkorderCluster.belongsTo(models.Workorder, {
            as: 'workordercluster',
            foreignKey: 'woID'
        });
    };

    return WorkorderCluster;
};
