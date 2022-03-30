const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderOperation = sequelize.define('WorkorderOperation', {
        woOPID: {
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
        // isNoClean: {
        //    type: Sequelize.BOOLEAN,
        //    allowNull: true
        // },
        // isWatersoluble: {
        //    type: Sequelize.BOOLEAN,
        //    allowNull: true
        // },
        isIssueQty: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isRework: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        opVersion: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isTeamOperation: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isStopOperation: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        firstPcsModel: {
            type: Sequelize.STRING,
            allowNull: true
        },
        firstPcsConclusion: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        firstPcsStatus: {
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
        isTrackBySerialNo: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isTrackBySerialFromWOOP: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isAllowFinalSerialMapping: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isLoopOperation: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        refLoopWOOPID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isPreProgrammingComponent: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isTerminated: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        terminateDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        colorCode: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        // cleaningType: {
        //     type: Sequelize.STRING,
        //     allowNull: false
        // },
        tabLimitAtTraveler: {
            type: Sequelize.INTEGER,
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
        isFluxNotApplicable: {
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
        addRefDesig: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isRequireMachineVerification: {
            type: Sequelize.STRING,
            allowNull: true
        },
        doNotReqApprovalForScan: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isRequireRefDesWithUMID: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isStrictlyLimitRefDes: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        shortDescription: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'workorder_operation'
    });

    WorkorderOperation.associate = (models) => {
        WorkorderOperation.belongsTo(models.Operation, {
            as: 'operation',
            foreignKey: 'opID'
        });
        WorkorderOperation.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderOperation.hasMany(models.WorkorderOperationEmployee, {
            foreignKey: 'woOPID',
            as: 'workorderOperationEmployee'
        });
        WorkorderOperation.hasMany(models.WorkorderOperationDataelement, {
            foreignKey: 'woOPID',
            as: 'workorderOperationDataelement'
        });
        WorkorderOperation.hasMany(models.WorkorderOperationEquipment, {
            foreignKey: 'woOPID',
            as: 'workorderOperationEquipment'
        });
        WorkorderOperation.hasMany(models.WorkorderOperationEquipmentDataelement, {
            foreignKey: 'woOPID',
            as: 'workorderOperationEquipmentDataelement'
        });
        WorkorderOperation.hasMany(models.WorkorderOperationCluster, {
            foreignKey: 'woOPID',
            as: 'workorderOperationCluster'
        });
        WorkorderOperation.belongsTo(models.GenericCategory, {
            foreignKey: 'operationTypeID',
            as: 'operationType'
        });
        WorkorderOperation.hasMany(models.WorkorderReqForReview, {
            as: 'workorderReqForReview',
            foreignKey: 'woOPID'
        });
        WorkorderOperation.hasMany(models.WorkorderTrans, {
            foreignKey: 'woOPID',
            as: 'workorderTrans'
        });
        WorkorderOperation.hasMany(models.WorkorderTransEmpinout, {
            foreignKey: 'woOPID',
            as: 'workorderTransEmpinout'
        });
        WorkorderOperation.hasMany(models.WorkorderTransFirstPcsDet, {
            foreignKey: 'woOPID',
            as: 'workorderOperationFirstPcsDet'
        });
        WorkorderOperation.hasMany(models.WorkorderTransOperationHoldUnhold, {
            foreignKey: 'woOPID',
            as: 'workorderTransOperationHoldUnhold'
        });
        WorkorderOperation.hasMany(models.WorkorderTransPreprogramComp, {
            as: 'workorder_trans_preprogramcomp',
            foreignKey: 'woOPID'
        });
        WorkorderOperation.hasMany(models.ShippedAssembly, {
            as: 'shippedassembly',
            foreignKey: 'woOPID'
        });
        WorkorderOperation.hasMany(models.WorkorderTransDataElementValues, {
            as: 'workorderTransDataElementValues',
            foreignKey: 'woOPID'
        });

        WorkorderOperation.hasMany(models.ECORequest, {
            as: 'ecoRequest',
            foreignKey: 'woOPID'
        });
        WorkorderOperation.hasMany(models.WorkorderSerialMst, {
            as: 'workorder_serialmst',
            foreignKey: 'currwoOPID'
        });

        WorkorderOperation.belongsTo(models.RFQMountingType, {
            foreignKey: 'mountingTypeID',
            as: 'mountingType'
        });

        WorkorderOperation.hasMany(models.WorkorderTransSerialNo, {
            as: 'workorder_trans_SerialNo',
            foreignKey: 'woOPID'
        });

        WorkorderOperation.hasMany(models.RackMst, {
            as: 'rackMst',
            foreignKey: 'woOPID'
        });

        WorkorderOperation.hasMany(models.WorkorderTransRack, {
            as: 'workorderTransRack',
            foreignKey: 'woOPID'
        });
        WorkorderOperation.hasMany(models.RackMstHistory, {
            as: 'rackMstHistory',
            foreignKey: 'woOPID'
        });
        WorkorderOperation.belongsTo(models.WorkorderOperation, {
            foreignKey: 'refLoopWOOPID',
            as: 'refLoopOperation'
        });
        WorkorderOperation.hasMany(models.WorkorderOperationRefDesig, {
            as: 'workorderOperationRefDesigs',
            foreignKey: 'woOPID'
        });
    };

    return WorkorderOperation;
};