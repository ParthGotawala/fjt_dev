const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const UnalloctedUMIDTransferHistory = sequelize.define('UnalloctedUMIDTransferHistory', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        transactionType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        category: {
            type: Sequelize.STRING,
            allowNull: false
        },
        transferFrom: {
            type: Sequelize.STRING,
            allowNull: false
        },
        transferTo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        reason: {
            type: Sequelize.TEXT,
            allowNull: false
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
    },
        {
            tableName: 'unallocted_umid_transfer_history',
            paranoid: true
        }
    );
    return UnalloctedUMIDTransferHistory;
};
