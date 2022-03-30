const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const DataElementTransactionValuesManual = sequelize.define('DataElementTransactionValuesManual', {
        dataElementTransManualID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        dataElementID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        value: {
            type: Sequelize.STRING,
            allowNull: false
        },
        refTransID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        entityID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        refSubFormTransID: {
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
            type: Sequelize.STRING,
            allowNull: true
        },
        updateByRoleId: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'dataelement_transactionvalues_manual'
    });

    DataElementTransactionValuesManual.associate = () => {
        // DataElementTransactionValuesManual.belongsTo(models.DataElement, {
        //    as: 'dataElement',
        //    foreignKey: 'dataElementID',
        // });
    };

    return DataElementTransactionValuesManual;
};
