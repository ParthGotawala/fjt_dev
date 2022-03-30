const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderSerialMst = sequelize.define('WorkorderSerialMst', {
        ID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        PrefixorSuffix: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        PreSuffix: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        dateCode: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 50]
            }
        },
        noofDigit: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        SerialNo: {
            type: Sequelize.STRING,
            allowNull: false
        },
        curropID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        currStatus: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 5]
            }
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
        woTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        // Manufacture = 1, Packing = 2
        serialType: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isTransferred: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        refSerialID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refMFGSerialNo: {
            type: Sequelize.STRING,
            allowNull: true
        },
        prefix: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        suffix: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        serialIntVal: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        dateCodeFormat: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        configurationId: {
            type: Sequelize.INTEGER,
            allowNUll: true
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
        currwoOPID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        currwoTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refMFGSerialNoId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mappingWOOPID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mappingBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mappingOn: {
            type: Sequelize.DATE,
            allowNull: true
        },
        barcodeSeparatorID: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        barcodeSeparatorValue: {
            type: Sequelize.STRING,
            allowNUll: true
        }
    }, {
        paranoid: true,
        tableName: 'workorder_serialmst'
    });

    WorkorderSerialMst.associate = (models) => {
        WorkorderSerialMst.belongsTo(models.Workorder, {
            foreignKey: 'woID',
            as: 'workorder'
        });
        WorkorderSerialMst.belongsTo(models.Operation, {
            as: 'operation',
            foreignKey: 'curropID'
        });
        WorkorderSerialMst.belongsTo(models.SerialNumberConfiguration, {
            as: 'serial_number_configuration',
            foreignKey: 'configurationId'
        });
        WorkorderSerialMst.belongsTo(models.WorkorderOperation, {
            as: 'workorder_operation',
            foreignKey: 'currwoOPID'
        });
        WorkorderSerialMst.hasMany(models.WorkorderTransSerialNo, {
            as: 'WorkorderTransSerialNo',
            foreignKey: 'refwoSerialNoID'
        });
        WorkorderSerialMst.belongsTo(models.WorkorderTrans, {
            as: 'workorderTrans',
            foreignKey: 'currwoTransID'
        });
    };

    return WorkorderSerialMst;
};
