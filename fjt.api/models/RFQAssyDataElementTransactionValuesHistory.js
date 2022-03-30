const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssyDataElementTransactionValuesHistory = sequelize.define('RFQAssyDataElementTransactionValuesHistory', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        dataElementID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        refTransID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        refTransHistoryId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        value: {
            type: Sequelize.STRING,
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
        }
    }, {
        paranoid: true,
        tableName: 'rfq_Assy_dataelement_transaction_value_history'
    });

    RFQAssyDataElementTransactionValuesHistory.associate = (models) => {
        RFQAssyDataElementTransactionValuesHistory.belongsTo(models.DataElement, {
            as: 'dataElement',
            foreignKey: 'dataElementID'
        });
    };

    return RFQAssyDataElementTransactionValuesHistory;
};
