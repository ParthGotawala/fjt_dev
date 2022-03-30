const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Equipment = sequelize.define('Equipment', {
        eqpID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        assetName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        eqpMake: {
            type: Sequelize.STRING,
            allowNull: true
        },
        eqpModel: {
            type: Sequelize.STRING,
            allowNull: true
        },
        eqpYear: {
            type: Sequelize.STRING,
            allowNull: true
        },
        eqpDescription: {
            type: Sequelize.STRING,
            allowNull: true
        },
        assetNumber: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        eqpGroupID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        eqpSubGroupID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        eqpTypeID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        eqpOwnershipTypeID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        bankName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        customerId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        departmentID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        equipmentAs: {
            type: Sequelize.STRING,
            allowNull: false
        },
        locationTypeID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        macAddress: {
            type: Sequelize.STRING,
            allowNull: true
        },
        placedInServiceDate: {
            allowNull: true,
            type: Sequelize.DATEONLY
        },
        outOfServiceDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        eqpOwnershipComments: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        maintenanceType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        noOfHours: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        scheduleComments: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        scheduleModifiedOn: {
            type: Sequelize.DATE,
            allowNull: true
        },
        scheduleAddedOn: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        deletedAt: {
            type: Sequelize.DATE,
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
        equipmentSetupMethod: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        documentPath: {
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
        binId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        assyId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        serialNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        calibrationRequired: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        }
    }, {
        paranoid: true,
        tableName: 'equipment'
    });

    Equipment.associate = (models) => {
        Equipment.hasMany(models.OperationEquipment, {
            foreignKey: 'eqpID',
            as: 'operationEquipment'
        });
        Equipment.hasMany(models.WorkorderOperationEquipment, {
            foreignKey: 'eqpID',
            as: 'workorderOperationEquipment'
        });
        Equipment.belongsTo(models.GenericCategory, {
            as: 'equipmentType',
            foreignKey: 'eqpTypeID'
        });
        Equipment.hasMany(models.EquipmentDataelement, {
            foreignKey: 'eqpID',
            as: 'equipmentDataelement'
        });
        Equipment.belongsTo(models.MfgCodeMst, {
            as: 'customer',
            foreignKey: 'customerId'
        });
        Equipment.belongsTo(models.GenericCategory, {
            as: 'equipmentGroup',
            foreignKey: 'eqpGroupID'
        });
        Equipment.belongsTo(models.GenericCategory, {
            as: 'equipmentSubGroup',
            foreignKey: 'eqpSubGroupID'
        });
        Equipment.belongsTo(models.GenericCategory, {
            as: 'equipmentOwnershipType',
            foreignKey: 'eqpOwnershipTypeID'
        });
        Equipment.hasMany(models.EquipmentTask, {
            foreignKey: 'eqpID',
            as: 'equipmentTask'
        });
        Equipment.hasMany(models.EmployeeEquipment, {
            foreignKey: 'eqpID',
            as: 'employeeEquipment'
        });
        Equipment.belongsTo(models.GenericCategory, {
            foreignKey: 'locationTypeID',
            as: 'locationType'
        });
        Equipment.belongsTo(models.Department, {
            foreignKey: 'departmentID',
            as: 'equipmentDepartment'
        });
        Equipment.hasMany(models.GenericFiles, {
            foreignKey: 'refTransID',
            as: 'genericDocument'
        });
        Equipment.hasMany(models.Workorder, {
            foreignKey: 'selectedSampleID',
            as: 'workorder'
        });
        Equipment.hasOne(models.WarehouseMst, {
            foreignKey: 'refEqpID',
            as: 'warehouseMst'
        });
        Equipment.belongsTo(models.BinMst, {
            as: 'binMst',
            foreignKey: 'binId'
        });
        Equipment.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'assyId'
        });
        Equipment.hasMany(models.CalibrationDetails, {
            foreignKey: 'refEqpID',
            as: 'calibration_details'
        });
    };

    return Equipment;
};