const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const AcctClassMst = sequelize.define('AcctClassMst', {
        class_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        systemid: {
            type: Sequelize.STRING,
            allowNull: false
        },
        class_code: {
            type: Sequelize.STRING,
            allowNull: true
        },
        class_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        system_defined: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        parent_class_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        disp_order: {
            allowNull: true,
            type: Sequelize.DECIMAL(6, 3)
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
        },
        isSubType: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    },
        {
            tableName: 'acct_classmst',
            paranoid: true
        }
    );

    AcctClassMst.associate = (models) => {
        AcctClassMst.hasMany(models.AcctAcctMst, {
            foreignKey: 'sub_class_id',
            as: 'acctAcctMstClass'
        });
        AcctClassMst.hasMany(models.AcctAcctMst, {
            foreignKey: 'parent_acct_id',
            as: 'acctAcctMstSubClass'
        });
    };

    return AcctClassMst;
};
