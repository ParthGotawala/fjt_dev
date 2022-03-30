const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const HoldUnholdTrans = sequelize.define('HoldUnholdTrans', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refTransId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        refType: {
            allowNull: true,
            type: Sequelize.STRING
        },
        status: {
            allowNull: true,
            type: Sequelize.STRING
        },
        startDate: {
            allowNull: true,
            type: Sequelize.DATE
        },
        endDate: {
            allowNull: true,
            type: Sequelize.DATE
        },
        reason: {
            allowNull: true,
            type: Sequelize.STRING
        },
        resumeReason: {
            allowNull: true,
            type: Sequelize.STRING
        },
        holdEmployeeId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        unHoldEmployeeId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        isDeleted: {
            allowNull: false,
            type: Sequelize.BOOLEAN
        },
        createdBy: {
            allowNull: false,
            type: Sequelize.STRING
        },
        updatedBy: {
            allowNull: true,
            type: Sequelize.STRING
        },
        deletedBy: {
            allowNull: true,
            type: Sequelize.STRING
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
            tableName: 'holdUnholdtrans',
            paranoid: true
        });

    HoldUnholdTrans.associate = (models) => {
    };


    return HoldUnholdTrans;
};
