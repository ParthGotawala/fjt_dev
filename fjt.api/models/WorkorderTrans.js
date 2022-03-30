const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTrans = sequelize.define('WorkorderTrans', {
        woTransID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
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
        issueQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        checkinEmployeeID: {
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
        checkoutEmployeeID: {
            type: Sequelize.INTEGER,
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
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        checkoutSetupTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woentrytype: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 1]
            }
        },
        isSetup: {
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
        }
    }, {
        paranoid: true,
        tableName: 'workorder_trans'
    });

    WorkorderTrans.associate = (models) => {
        WorkorderTrans.belongsTo(models.Employee, {
            as: 'checkInEmployee',
            foreignKey: 'checkinEmployeeID'
        });
        WorkorderTrans.belongsTo(models.Employee, {
            as: 'checkOutEmployee',
            foreignKey: 'checkoutEmployeeID'
        });
        WorkorderTrans.belongsTo(models.Operation, {
            as: 'operation',
            foreignKey: 'opID'
        });
        WorkorderTrans.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderTrans.belongsTo(models.Equipment, {
            as: 'workstation',
            foreignKey: 'workstationID'
        });
        WorkorderTrans.belongsTo(models.Equipment, {
            as: 'equipment',
            foreignKey: 'equipmentID'
        });
        WorkorderTrans.hasMany(models.WorkorderTransEmpinout, {
            foreignKey: 'woTransID',
            as: 'workorderTransEmpinout'
        });
        WorkorderTrans.hasMany(models.WorkorderTransEmpinout, {
            foreignKey: 'woTransID',
            as: 'workorderTransEmpinoutAll'
        });
        WorkorderTrans.hasMany(models.WorkorderTransProduction, {
            foreignKey: 'woTransID',
            as: 'workorderTransProduction'
        });
        WorkorderTrans.belongsTo(models.WorkorderOperation, {
            as: 'workorderOperation',
            foreignKey: 'woOPID'
        });
        WorkorderTrans.hasMany(models.WorkorderTransAssyDefectdet, {
            as: 'workorder_trans_assy_defectdet',
            foreignKey: 'woTransID'
        });
        WorkorderTrans.belongsTo(models.WorkorderTransOperationHoldUnhold, {
            as: 'workorder_trans',
            foreignKey: 'woTransID'
        });
        WorkorderTrans.hasMany(models.WorkorderTransPreprogramComp, {
            as: 'workorder_trans_preprogramcomp',
            foreignKey: 'woTransID'
        });
        WorkorderTrans.hasMany(models.RackMst, {
            as: 'rackMst',
            foreignKey: 'woTransID'
        });
        WorkorderTrans.hasMany(models.WorkorderTransRack, {
            as: 'workorderTransRack',
            foreignKey: 'woTransID'
        });
    };

    return WorkorderTrans;
};