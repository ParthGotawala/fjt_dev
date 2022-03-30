const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransProduction = sequelize.define('WorkorderTransProduction', {
        woTransprodID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woTransID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        totalQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        passQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        reprocessQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        observedQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        reworkQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        scrapQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isFirstArticle: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        remark: {
            type: Sequelize.TEXT,
            allowNull: true
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
        boardWithMissingPartsQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        bypassQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'workorder_trans_production'
    });

    WorkorderTransProduction.associate = (models) => {
        WorkorderTransProduction.belongsTo(models.WorkorderTrans, {
            as: 'workorderTrans',
            foreignKey: 'woTransID'
        });
        WorkorderTransProduction.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'employeeID'
        });
    };

    return WorkorderTransProduction;
};
