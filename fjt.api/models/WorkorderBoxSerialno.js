const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderBoxSerialno = sequelize.define('WorkorderBoxSerialno', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        assyStockID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        uniqueID: {
            type: Sequelize.STRING(10),
            allowNull: false
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        soDetID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        assyID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        qtyPerBox: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        boxWeight: {
            type: Sequelize.DECIMAL(10, 4),
            allowNull: true
        },
        boxWeightUOM: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        binID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        whID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        datecode: {
            type: Sequelize.STRING(4),
            allowNull: true
        },
        remark: {
            type: Sequelize.STRING,
            allowNull: false
        },
        woNumber: {
            type: Sequelize.STRING(255),
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
            allowNull: false
        },
        deletedBy: {
            type: Sequelize.STRING(255),
            allowNull: false
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
        tableName: 'workorder_boxserialno'
    });

    WorkorderBoxSerialno.associate = (models) => {
        WorkorderBoxSerialno.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderBoxSerialno.belongsTo(models.AssemblyStock, {
            as: 'assemblystock',
            foreignKey: 'assyStockID'
        });
        WorkorderBoxSerialno.belongsTo(models.SalesOrderDet, {
            as: 'salesorderdet',
            foreignKey: 'soDetID'
        });
        WorkorderBoxSerialno.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'employeeID'
        });
        WorkorderBoxSerialno.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'partID'
        });
        WorkorderBoxSerialno.belongsTo(models.Component, {
            as: 'assycomponent',
            foreignKey: 'assyID'
        });
        WorkorderBoxSerialno.belongsTo(models.WorkorderTrans, {
            as: 'workordertrans',
            foreignKey: 'woTransID'
        });
        WorkorderBoxSerialno.belongsTo(models.UOMs, {
            as: 'uoms',
            foreignKey: 'boxWeightUOM'
        });
        WorkorderBoxSerialno.belongsTo(models.BinMst, {
            as: 'binmst',
            foreignKey: 'binID'
        });
        WorkorderBoxSerialno.belongsTo(models.WarehouseMst, {
            as: 'warehousemst',
            foreignKey: 'whID'
        });
    };
    return WorkorderBoxSerialno;
};