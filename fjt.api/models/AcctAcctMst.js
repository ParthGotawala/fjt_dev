const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const AcctAcctMst = sequelize.define('AcctAcctMst', {
        acct_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        systemid: {
            type: Sequelize.STRING,
            allowNull: false
        },
        acct_code: {
            type: Sequelize.STRING,
            allowNull: true
        },
        acct_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        sub_class_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        class_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        disp_order: {
            allowNull: true,
            type: Sequelize.DECIMAL(6, 3)
        },
        isSubAccount: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        parent_acct_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        tax_acct_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        m3_acct_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
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
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updateByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    },
        {
            tableName: 'acct_acctmst',
            paranoid: true
        }
    );

    AcctAcctMst.associate = (models) => {
        AcctAcctMst.hasMany(models.MfgCodeMst, {
            foreignKey: 'acctId',
            as: 'mfgCodeMstCOA'
        });
        AcctAcctMst.hasMany(models.Component, {
            foreignKey: 'salesacctId',
            as: 'componentSalesCOA'
        });
        AcctAcctMst.hasMany(models.Component, {
            foreignKey: 'purchaseacctId',
            as: 'componentPurchaseCOA'
        });
        AcctAcctMst.belongsTo(models.AcctClassMst, {
            as: 'subClassId',
            foreignKey: 'sub_class_id'
        });
        AcctAcctMst.belongsTo(models.AcctClassMst, {
            as: 'parentClassId',
            foreignKey: 'parent_acct_id'
        });
    };

    return AcctAcctMst;
};
