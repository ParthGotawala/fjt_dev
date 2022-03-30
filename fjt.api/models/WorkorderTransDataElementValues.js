const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransDataElementValues = sequelize.define('WorkorderTransDataElementValues', {
        woTransDataElementID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        dataElementID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woTransID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woOPID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        entityID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        value: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        refWoTransSubFormDataID: {
            type: Sequelize.INTEGER,
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
        tableName: 'workorder_trans_dataelement_values'
    });

    WorkorderTransDataElementValues.associate = (models) => {
        WorkorderTransDataElementValues.belongsTo(models.DataElement, {
            foreignKey: 'dataElementID',
            as: 'dataelement'
        });
    };

    return WorkorderTransDataElementValues;
};
