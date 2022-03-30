/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentLastExternalAPICall = sequelize.define('ComponentLastExternalAPICall', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refComponentID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        supplierID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        updatedAtApi: {
            type: Sequelize.DATE,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'component_last_external_apicall'
    });

    ComponentLastExternalAPICall.associate = (models) => {
        ComponentLastExternalAPICall.belongsTo(models.Component, {
            as: 'externalComponent',
            foreignKey: 'refComponentID'
        });
        ComponentLastExternalAPICall.belongsTo(models.MfgCodeMst, {
            as: 'supplierMaster',
            foreignKey: 'supplierID'
        });
    };

    return ComponentLastExternalAPICall;
};
