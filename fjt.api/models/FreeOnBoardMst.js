const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const FreeOnBoardMst = sequelize.define('FreeOnBoardMst', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
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
            tableName: 'freeonboardmst',
            paranoid: true
        }
    );

    FreeOnBoardMst.associate = (models) => {
        FreeOnBoardMst.hasMany(models.MfgCodeMst, {
            foreignKey: 'freeOnBoardId',
            as: 'freeonboardmst'
        });
        FreeOnBoardMst.hasMany(models.PurchaseOrderMst, {
            foreignKey: 'freeOnBoardID',
            as: 'purchaseOrderMst'
        });
    };
    return FreeOnBoardMst;
};
