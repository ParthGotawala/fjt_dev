const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const BankMst = sequelize.define('BankMst', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        accountCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        bankName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        accountNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: false
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
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
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
        },
        typeOfAccount: {
            type: Sequelize.STRING,
            allowNull: true
        },
        creditDebitType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        acctId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'bank_mst'
    });

    BankMst.associate = (models) => {
        BankMst.belongsTo(models.AcctAcctMst, {
            foreignKey: 'acctId',
            as: 'acct_acctmst'
        });
    };
    return BankMst;
};