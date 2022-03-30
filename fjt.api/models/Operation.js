const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Operation = sequelize.define('Operation', {
        opID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        opName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        opNumber: {
            type: Sequelize.DECIMAL(7, 3),
            allowNull: false,
            // get() { return COMMON.CONVERTTHREEDECIMAL(this.getDataValue('opNumber')); },
            validate: {
                notEmpty: true,
                len: [1, 11]
            }
        },
        opDescription: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        opDoes: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        opDonts: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        opOrder: {
            type: Sequelize.DECIMAL(7, 3),
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        opStatus: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        operationTypeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        parentOPID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        processTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        setupTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        perPieceTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        qtyControl: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        opWorkingCondition: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        opManagementInstruction: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        opDeferredInstruction: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isIssueQty: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isRework: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isTeamOperation: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        colorCode: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        tabLimitAtTraveler: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isMoveToStock: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isPlacementTracking: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        updatedBy: {
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
        mountingTypeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        documentPath: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isLoopOperation: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isAllowMissingPartQty: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isAllowBypassQty: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isEnablePreProgrammingPart: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isWaterSoluble: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isNoClean: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isFluxNotApplicable: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        shortDescription: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'operations'
    });

    Operation.associate = (models) => {
        // Operation.hasMany(models.OperationKeyType, {
        //     foreignKey: 'operationId',
        //     as: 'operationKeyTypes',
        // });

        // Operation.hasMany(models.OperationFile, {
        //    foreignKey: 'operationId',
        //    as: 'operationFiles',
        // });

        // Operation.belongsToMany(models.Job, {
        //    as: 'operations',
        //    through: 'jobs_operations',
        //    foreignKey: 'operationId',
        // });

        // Operation.belongsToMany(models.OperationDataelement, {
        //     as: 'operationDataelement',
        //     through: 'operation_dataelement',
        //     foreignKey: 'opID',
        // });

        Operation.hasMany(models.OperationMasterTemplates, {
            foreignKey: 'operationId',
            as: 'operationMasterTemplates'
        });
        Operation.hasMany(models.OperationEmployee, {
            foreignKey: 'opID',
            as: 'operationEmployee'
        });
        Operation.hasMany(models.WorkorderOperationEmployee, {
            foreignKey: 'opID',
            as: 'workorderOperationEmployee'
        });
        Operation.hasMany(models.WorkorderOperation, {
            foreignKey: 'opID',
            as: 'workorderOperation'
        });
        Operation.hasMany(models.OperationEquipment, {
            foreignKey: 'opID',
            as: 'operationEquipment'
        });
        Operation.hasMany(models.OperationDataelement, {
            foreignKey: 'opID',
            as: 'operationDataelement'
        });
        Operation.belongsTo(models.GenericCategory, {
            foreignKey: 'operationTypeID',
            as: 'operationType'
        });
        Operation.belongsTo(models.Operation, {
            foreignKey: 'parentOPID',
            as: 'parentOperation'
        });
        Operation.hasMany(models.OperationPart, {
            foreignKey: 'opID',
            as: 'operationsParts'
        });
        Operation.hasMany(models.WorkorderOperationCluster, {
            foreignKey: 'opID',
            as: 'operationCluster'
        });

        Operation.hasMany(models.WorkorderReqForReview, {
            as: 'workorderReqForReview',
            foreignKey: 'opID'
        });
        Operation.hasMany(models.WorkorderTransOperationHoldUnhold, {
            foreignKey: 'opID',
            as: 'workorderTransOperationHoldUnhold'
        });
        Operation.hasMany(models.WorkorderTransPreprogramComp, {
            as: 'workorder_trans_preprogramcomp',
            foreignKey: 'opID'
        });

        Operation.hasMany(models.WorkorderSerialMst, {
            foreignKey: 'curropID',
            as: 'workorderSerialMst'
        });

        Operation.hasMany(models.ChartTemplateOperations, {
            foreignKey: 'opID',
            as: 'chartTemplateOperations'
        });

        Operation.hasMany(models.ECORequest, {
            as: 'ecoRequest',
            foreignKey: 'opID'
        });
        Operation.belongsTo(models.RFQMountingType, {
            foreignKey: 'mountingTypeID',
            as: 'mountingType'
        });
    };

    return Operation;
};
