const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransPreprogramComp = sequelize.define('WorkorderTransPreprogramComp', {
        woTransPreprogramID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        opID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woOPID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        //woCompDesignatorID: {
        //    type: Sequelize.INTEGER,
        //    allowNull: true
        //},
        compCnt: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        createdBy: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING(255),
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
        woPreProgCompID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        refsidid: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        paranoid: true,
        tableName: 'workorder_trans_preprogramcomp'
    });

    WorkorderTransPreprogramComp.associate = (models) => {
        WorkorderTransPreprogramComp.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderTransPreprogramComp.belongsTo(models.Operation, {
            as: 'operations',
            foreignKey: 'opID'
        });
        WorkorderTransPreprogramComp.belongsTo(models.WorkorderOperation, {
            as: 'workorderOperation',
            foreignKey: 'woOPID'
        });
        WorkorderTransPreprogramComp.belongsTo(models.WorkorderTrans, {
            as: 'workorder_trans',
            foreignKey: 'woTransID'
        });
        WorkorderTransPreprogramComp.belongsTo(models.Employee, {
            as: 'employees',
            foreignKey: 'employeeID'
        });
        WorkorderTransPreprogramComp.belongsTo(models.WorkorderPreprogComp, {
            as: 'workorderPreprogComp',
            foreignKey: 'woPreProgCompID'
        });
    };

    return WorkorderTransPreprogramComp;
};