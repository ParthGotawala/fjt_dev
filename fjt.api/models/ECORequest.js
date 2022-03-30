const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ECORequest = sequelize.define('ECORequest', {
        ecoReqID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        ecoNumber: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        fromPartID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        toPartID: {
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
        custECONumber: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 255]
            }
        },
        FCAECONumber: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 255]
            }
        },
        reasonForChange: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        initiateBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        initiateDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        approvalBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        approvalDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        rejectedBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rejectedDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 1]
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
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        comments: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        finalStatus: {
            type: Sequelize.STRING,
            validate: {
                len: [0, 1]
            }
        },
        finalStatusInit: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        finalStatusDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        finalStatusReason: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        isAllProductConf: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isFutureProd: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isTemp: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        requestedWOOPID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        ECOImplemetTo: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        implemetToWOID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        closedDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        requestType: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        ecoDfmTypeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        mountingTypeID: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        }
    },
        {
            paranoid: true,
            tableName: 'eco_request'
        });

    ECORequest.associate = (models) => {
        ECORequest.hasMany(models.ECORequestTypeValues, {
            as: 'ecoRequestTypeValues',
            foreignKey: 'ecoReqID'
        });
        ECORequest.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'initiateBy'
        });
        ECORequest.belongsTo(models.Employee, {
            as: 'employee_finalStatusInit',
            foreignKey: 'finalStatusInit'
        });
        ECORequest.belongsTo(models.Operation, {
            as: 'operation',
            foreignKey: 'opID'
        });
        ECORequest.belongsTo(models.WorkorderOperation, {
            as: 'workOrderOperation',
            foreignKey: 'woOPID'
        });
        ECORequest.belongsTo(models.Workorder, {
            as: 'workOrder',
            foreignKey: 'woID'
        });
        ECORequest.belongsTo(models.Component, {
            as: 'fromComponentAssembly',
            foreignKey: 'fromPartID'
        });
        ECORequest.belongsTo(models.Component, {
            as: 'toComponentAssembly',
            foreignKey: 'toPartID'
        });
        ECORequest.belongsTo(models.RFQMountingType, {
            as: 'mountingType',
            foreignKey: 'mountingTypeID'
        });
        ECORequest.belongsTo(models.GenericCategory, {
            as: 'ecoDfmType',
            foreignKey: 'ecoDfmTypeID'
        });
    };

    return ECORequest;
};