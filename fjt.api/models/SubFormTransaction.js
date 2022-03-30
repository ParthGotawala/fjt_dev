const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SubFormTransaction = sequelize.define('SubFormTransaction', {
        subFormTransID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        parentDataElementID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        rowNumber: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: false
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'subform_transaction'
    });
    return SubFormTransaction;
};
