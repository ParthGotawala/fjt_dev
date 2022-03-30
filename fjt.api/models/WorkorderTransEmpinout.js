const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransEmpinout = sequelize.define('WorkorderTransEmpinout', {
        woTransinoutID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woTransID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        opID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woOPID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        workstationID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        equipmentID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        checkinTime: {
            type: Sequelize.DATE,
            allowNull: true
        },
        checkoutTime: {
            type: Sequelize.DATE,
            allowNull: true
        },
        totalTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        productionTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isPaused: {
            type: Sequelize.BOOLEAN,
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
        checkoutSetupTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        remark: {
            type: Sequelize.TEXT,
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
        tableName: 'workorder_trans_empinout'
    });

    WorkorderTransEmpinout.associate = (models) => {
        WorkorderTransEmpinout.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'employeeID'
        });
        WorkorderTransEmpinout.belongsTo(models.Operation, {
            as: 'operation',
            foreignKey: 'opID'
        });
        WorkorderTransEmpinout.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderTransEmpinout.belongsTo(models.Equipment, {
            as: 'workstation',
            foreignKey: 'workstationID'
        });
        WorkorderTransEmpinout.belongsTo(models.Equipment, {
            as: 'equipment',
            foreignKey: 'equipmentID'
        });
        WorkorderTransEmpinout.belongsTo(models.WorkorderOperation, {
            as: 'workorderOperation',
            foreignKey: 'woOPID'
        });
        WorkorderTransEmpinout.belongsTo(models.WorkorderTrans, {
            as: 'workorderTrans',
            foreignKey: 'woTransID'
        });
        WorkorderTransEmpinout.hasMany(models.WorkorderTransEmpPausedet, {
            foreignKey: 'woTransinoutID',
            as: 'workorderTransEmpPauseDet'
        });
    };

    return WorkorderTransEmpinout;
};
