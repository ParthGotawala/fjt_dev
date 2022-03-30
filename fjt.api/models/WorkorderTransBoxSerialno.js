const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransBoxSerialno = sequelize.define('WorkorderTransBoxSerialno', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woBoxSerialID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        serialID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        createdBy: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        updatedBy: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        createByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        updateByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        labelPrintSN: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        finalSN: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        mfrSN: {
            type: Sequelize.STRING(50),
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'workorder_trans_boxserialno'
    });

    WorkorderTransBoxSerialno.associate = (models) => {
        WorkorderTransBoxSerialno.belongsTo(models.WorkorderBoxSerialno, {
            as: 'workorderserialno',
            foreignKey: 'woBoxSerialID'
        });
        WorkorderTransBoxSerialno.belongsTo(models.WorkorderSerialMst, {
            as: 'workorderserialmst',
            foreignKey: 'serialID'
        });
        WorkorderTransBoxSerialno.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'employeeID'
        });
    };
    return WorkorderTransBoxSerialno;
};