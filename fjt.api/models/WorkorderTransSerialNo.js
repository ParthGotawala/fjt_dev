const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransSerialNo = sequelize.define('WorkorderTransSerialNo', {
        woTransSerialID: {
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
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        serialNo: {
            type: Sequelize.STRING,
            allowNull: true
        },
        prodStatus: {
            type: Sequelize.STRING,
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
        woOPID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        refwoSerialNoID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woTransprodID: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'workorder_trans_serialNo'
    });

    WorkorderTransSerialNo.associate = (models) => {
        WorkorderTransSerialNo.belongsTo(models.WorkorderTrans, {
            as: 'workorderTrans',
            foreignKey: 'woTransID'
        });
        WorkorderTransSerialNo.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'employeeID'
        });
        WorkorderTransSerialNo.belongsTo(models.Operation, {
            as: 'operation',
            foreignKey: 'opID'
        });
        WorkorderTransSerialNo.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderTransSerialNo.belongsTo(models.WorkorderOperation, {
            as: 'workorder_operation',
            foreignKey: 'woOPID'
        });
        WorkorderTransSerialNo.belongsTo(models.WorkorderSerialMst, {
            as: 'Workorder_SerialMst',
            foreignKey: 'refwoSerialNoID'
        });
        WorkorderTransSerialNo.belongsTo(models.WorkorderTransProduction, {
            as: 'Workorder_Trans_Production',
            foreignKey: 'woTransprodID'
        });
    };

    return WorkorderTransSerialNo;
};
