/* eslint-disable global-require */
module.exports = (sequelize) => {
    const Sequelize = require('sequelize');
    const DataElementKeyValues = sequelize.define('DataElementKeyValues', {
        keyValueID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        dataElementID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        displayOrder: {
            type: Sequelize.Sequelize.DECIMAL(6, 2),
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
        name: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        value: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        defaultValue: {
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
        }
    }, {
        paranoid: true,
        indexes: [{
            unique: true,
            fields: ['keyValueID', 'refTransactionID']
        }],
        tableName: 'dataelement_keyvalues'
    });

    DataElementKeyValues.associate = (models) => {
        // DataElementKeyValues.belongsToMany(models.DataElementTransactionValues, {
        //     as: 'dataelement_transactionvalues',
        //     through: 'dataelement',
        //     foreignKey: 'keyValueID'
        // });
    };

    return DataElementKeyValues;
};
