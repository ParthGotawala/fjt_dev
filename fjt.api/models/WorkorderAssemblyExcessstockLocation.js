const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderAssemblyExcessstockLocation = sequelize.define('WorkorderAssemblyExcessstockLocation', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        serialNoDescription: {
            type: Sequelize.STRING(2500),
            allowNull: true
        },
        notes: {
            type: Sequelize.STRING(2500),
            allowNull: true
        },
        isdefault: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        qty: {
            type: Sequelize.INTEGER,
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
        },
        geolocationId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'workorder_assembly_excessstock_location'
    });

    WorkorderAssemblyExcessstockLocation.associate = (models) => {
        WorkorderAssemblyExcessstockLocation.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderAssemblyExcessstockLocation.belongsTo(models.Component, {
            foreignKey: 'partID',
            as: 'componentAssembly'
        });
    };

    return WorkorderAssemblyExcessstockLocation;
};