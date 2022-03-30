const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Workorder = sequelize.define('Workorder', {
        woID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woNumber: {
            type: Sequelize.STRING,
            allowNull: false
        },
        customerID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        excessQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        buildQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        startTime: {
            type: Sequelize.TIME,
            allowNull: true
        },
        endTime: {
            type: Sequelize.TIME,
            allowNull: true
        },
        isClusterApplied: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isIncludeSubAssembly: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        masterTemplateID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refrenceWOID: {
            type: Sequelize.INTEGER,
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
        woStatus: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        RoHSStatusID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woVersion: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isOperationTrackBySerialNo: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        ECORemark: {
            type: Sequelize.STRING,
            allowNull: true
        },
        FCORemark: {
            type: Sequelize.STRING,
            allowNull: true
        },
        locationDetails: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isStopWorkorder: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isRevisedWO: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isNoClean: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isWatersoluble: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isOperationsVerified: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isHotJob: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        terminateWOID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        initialInternalVersion: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        terminateWOOPID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woType: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        ecoReqID: {
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
        documentPath: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isRackTrackingRequired: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isStrictlyFollowRackValidation: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        selectedSampleID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woSubStatus: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isInternalBuild: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        proposedUmidQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        dateCode: {
            type: Sequelize.STRING(4),
            allowNUll: true
        },
        dateCodeFormat: {
            type: Sequelize.STRING(5),
            allowNUll: true
        },
        isKitAllocationNotRequired: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        woSeries: {
            type: Sequelize.STRING,
            allowNull: false
        },
        buildNumber: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        systemID: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'workorder'
    });

    Workorder.associate = (models) => {
        // Workorder.belongsTo(models.Customer, {
        //     as: 'customer',
        //     foreignKey: 'customerID',
        // });
        Workorder.belongsTo(models.MfgCodeMst, {
            as: 'customer',
            foreignKey: 'customerID'
        });
        Workorder.belongsTo(models.RFQRoHS, {
            as: 'rohs',
            foreignKey: 'RoHSStatusID'
        });
        Workorder.belongsTo(models.MasterTemplate, {
            as: 'masterTemplate',
            foreignKey: 'masterTemplateID'
        });
        Workorder.belongsTo(models.Equipment, {
            as: 'sample',
            foreignKey: 'selectedSampleID'
        });
        Workorder.hasMany(models.WorkorderCertification, {
            as: 'workorderCertification',
            foreignKey: 'woID'
        });
        Workorder.hasMany(models.WorkorderOperationEmployee, {
            foreignKey: 'woID',
            as: 'workorder_operation_employee'
        });
        Workorder.hasMany(models.WorkorderOperation, {
            as: 'workorderOperation',
            foreignKey: 'woID'
        });
        Workorder.hasMany(models.WorkorderOperationEquipment, {
            foreignKey: 'woID',
            as: 'workorderOperationEquipment'
        });
        Workorder.hasMany(models.WorkorderCluster, {
            as: 'workordercluster',
            foreignKey: 'woID'
        });
        Workorder.hasMany(models.WorkorderReqForReview, {
            as: 'workorderReqForReview',
            foreignKey: 'woID'
        });

        Workorder.hasMany(models.WorkorderReqRevInvitedEmp, {
            as: 'workorderReqRevInvitedEmp',
            foreignKey: 'woID'
        });

        Workorder.hasMany(models.WorkorderReqRevComments, {
            as: 'workorderReqRevComments',
            foreignKey: 'woID'
        });

        Workorder.hasMany(models.WorkorderTransHoldUnhold, {
            as: 'workorderTransHoldUnhold',
            foreignKey: 'woID'
        });


        // Job.belongsTo(models.Customer, {
        //     as: 'customer',
        //     foreignKey: 'customerId'
        // });

        // Job.belongsTo(models.Job, {
        //     as: 'repeatJob',
        //     foreignKey: 'repeatId'
        // });

        // Job.belongsToMany(models.Operation, {
        //     as: 'operations',
        //     through: 'jobs_operations',
        //     foreignKey: 'jobId'
        // });

        Workorder.hasMany(models.WorkorderTransEmpinout, {
            foreignKey: 'woID',
            as: 'workorderTransEmpinout'
        });
        Workorder.hasMany(models.WorkorderTransOperationHoldUnhold, {
            foreignKey: 'woOPID',
            as: 'workorder'
        });
        Workorder.hasMany(models.WorkorderTransPreprogramComp, {
            as: 'workorder_trans_preprogramcomp',
            foreignKey: 'woID'
        });

        Workorder.hasMany(models.WorkorderSerialMst, {
            foreignKey: 'woID',
            as: 'workorderSerialMst'
        });

        Workorder.hasMany(models.WorkorderSalesOrderDetails, {
            as: 'WoSalesOrderDetails',
            foreignKey: 'woID'
        });

        Workorder.hasMany(models.ShippingRequestDet, {
            foreignKey: 'woID',
            as: 'shippingRequestDet'
        });
        Workorder.hasMany(models.WorkorderTransDataElementValues, {
            foreignKey: 'woID',
            as: 'workorderTransDataElementValues'
        });

        Workorder.hasMany(models.WorkorderAssemblyExcessstockLocation, {
            as: 'workorderAssemblyExcessstockLocation',
            foreignKey: 'woID'
        });

        Workorder.hasMany(models.ECORequest, {
            as: 'ecoRequest',
            foreignKey: 'woID'
        });

        Workorder.belongsTo(models.Component, {
            foreignKey: 'partID',
            as: 'componentAssembly'
        });

        Workorder.hasMany(models.WorkorderMainAssemblyMappingDetails, {
            as: 'refWorkOrder',
            foreignKey: 'refWOID'
        });

        Workorder.hasMany(models.WorkorderMainAssemblyMappingDetails, {
            as: 'parentWorkOrder',
            foreignKey: 'parentWOID'
        });

        Workorder.hasMany(models.RackMst, {
            as: 'rackMst',
            foreignKey: 'woID'
        });
        Workorder.hasMany(models.RackMstHistory, {
            as: 'rackMstHistory',
            foreignKey: 'woID'
        });
        Workorder.hasMany(models.AssemblyStock, {
            as: 'assemblyStock',
            foreignKey: 'woID'
        });
        Workorder.hasMany(models.ComponentSidStock, {
            as: 'componentSidStock',
            foreignKey: 'woID'
        });
    };

    return Workorder;
};