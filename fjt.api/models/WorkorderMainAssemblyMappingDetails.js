const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderMainAssemblyMappingDetails = sequelize.define('WorkorderMainAssemblyMappingDetails', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refWOID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        parentWOID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        qty: {
            type: Sequelize.INTEGER,
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
        tableName: 'workorder_main_assembly_mapping_details'
    });

    WorkorderMainAssemblyMappingDetails.associate = (models) => {
        WorkorderMainAssemblyMappingDetails.belongsTo(models.Workorder, {
            as: 'refWorkOrder',
            foreignKey: 'refWOID'
        });
        WorkorderMainAssemblyMappingDetails.belongsTo(models.Workorder, {
            as: 'parentWorkOrder',
            foreignKey: 'parentWOID'
        });
    };

    return WorkorderMainAssemblyMappingDetails;
};
