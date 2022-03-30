const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const TransactionModeMst = sequelize.define('TransactionModeMst', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        modeType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        modeCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        modeName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        displayOrder: {
            allowNull: true,
            type: Sequelize.DECIMAL(6, 2)
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        systemGenerated: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        ref_acctid: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isDeleted: {
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
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
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
        tableName: 'generic_transmode_mst'
    });

    TransactionModeMst.associate = (models) => {
        TransactionModeMst.belongsTo(models.AcctAcctMst, {
            foreignKey: 'ref_acctid',
            as: 'acct_acctmst'
        });
        TransactionModeMst.hasMany(models.PackingslipInvoicePayment, {
            foreignKey: 'refGencTransModeID',
            as: 'packingslip_invoice_payment'
        });
    };
    return TransactionModeMst;
};