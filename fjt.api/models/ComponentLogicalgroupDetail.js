/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentLogicalgroupDetail = sequelize.define('ComponentLogicalgroupDetail', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        logicalgroupID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        rfqMountingTypeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isActive: {
            type: Sequelize.BOOLEAN,
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
        }
    }, {
        paranoid: true,
        tableName: 'component_logicalgroup_detail'
    });

    ComponentLogicalgroupDetail.associate = (models) => {
        ComponentLogicalgroupDetail.belongsTo(models.ComponentLogicalgroup, {
            as: 'componentLogicalgroup',
            foreignKey: 'logicalgroupID'
        });
        ComponentLogicalgroupDetail.belongsTo(models.RFQMountingType, {
            as: 'rfqMountingType',
            foreignKey: 'rfqMountingTypeID'
        });
    };

    return ComponentLogicalgroupDetail;
};