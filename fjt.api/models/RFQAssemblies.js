const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssemblies = sequelize.define('RFQAssemblies', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rfqrefID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        assyNote: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        assemblyDescription: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isActive: {
            allowNull: false,
            type: Sequelize.BOOLEAN
        },
        quoteNote: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        assyCloseNote: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        assyClosedStatus: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
                len: [0, 50]
            }
        },
        assyClosedReasonID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        assyClosedDate: {
            allowNull: true,
            type: Sequelize.DATE
        },
        IsRepeated: {
            type: Sequelize.BOOLEAN,
            allowNull: false
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
        status: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isBOMVerified: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isReadyForPricing: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        RoHSStatusID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isRepeat: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        description: {
            allowNull: true,
            type: Sequelize.STRING,
            validate: {
                notEmpty: false,
                len: [0, 100]
            }
        },
        isSummaryComplete: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        assemblyVersion: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        repeatExpectedQty: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        repeatFrequency: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        quotePriority: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        quoteFinalStatus: {
            allowNull: true,
            type: Sequelize.STRING,
            validate: {
                notEmpty: false,
                len: [0, 2]
            }
        },
        bomFCAVersion: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        bomStatus: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        jobTypeID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        RFQTypeID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        partID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        quoteInDate: {
            allowNull: true,
            type: Sequelize.DATE
        },
        quoteDueDate: {
            allowNull: true,
            type: Sequelize.DATE
        },
        quoteSubmitDate: {
            allowNull: true,
            type: Sequelize.DATE
        },
        quoteNumber: {
            allowNull: true,
            type: Sequelize.STRING
        },
        eau: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        proposedBuildQty: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        noOfBuild: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        timePeriod: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        additionalRequirement: {
            allowNull: true,
            type: Sequelize.TEXT
        },
        assemblyTypeID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        quoteSubmittedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        winQuantity: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        winPrice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        reason: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        quoteClosedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        quoteClosedDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        partCostingBOMInternalVersion: {
            type: Sequelize.STRING,
            allowNull: true
        },
        partcostingBOMIssue: {
            type: Sequelize.STRING,
            allowNull: true
        },
        laborType: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        isLaborUpdate: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        isPriceUpdate: {
            type: Sequelize.BOOLEAN,
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
        },
        priceGroupInternalVersion: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isCustomPartDetShowInReport: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isActivityStart: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        activityStartBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        activityStartAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        activityStopAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        quoteValidTillDate: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'rfq_assemblies'
    });

    RFQAssemblies.associate = (models) => {
        RFQAssemblies.hasMany(models.RFQAssyQuantity, {
            as: 'rfqAssyQuantity',
            foreignKey: 'rfqAssyID'
        });

        RFQAssemblies.hasMany(models.RFQLineitemsAdditionalComment, {
            as: 'RFQLineitemsAdditionalComment',
            foreignKey: 'rfqAssyID'
        });
        RFQAssemblies.belongsTo(models.RFQForms, {
            as: 'rfqForms',
            foreignKey: 'rfqrefID'
        });
        RFQAssemblies.belongsTo(models.JobType, {
            as: 'jobType',
            foreignKey: 'jobTypeID'
        });

        RFQAssemblies.belongsTo(models.RFQType, {
            as: 'rfqType',
            foreignKey: 'RFQTypeID'
        });

        RFQAssemblies.belongsTo(models.Component, {
            as: 'componentAssembly',
            foreignKey: 'partID'
        });

        RFQAssemblies.hasMany(models.RFQConsolidatedMFGPNLineItem, {
            as: 'rfqConsolidatedMFGPNLineItems',
            foreignKey: 'rfqAssyID'
        });
        RFQAssemblies.hasMany(models.RFQAssyQuotations, {
            as: 'rfqAssyQuotations',
            foreignKey: 'rfqAssyID'
        });

        RFQAssemblies.hasMany(models.RFQLineitemsAlternatepart, {
            as: 'rfqLineitemsAlternatepart',
            foreignKey: 'rfqAssyID'
        });
        RFQAssemblies.hasMany(models.ComponentCustomerLOA, {
            as: 'customerLOA',
            foreignKey: 'rfqAssyID'
        });

        RFQAssemblies.belongsTo(models.RFQAssyTypeMst, {
            as: 'assemblyType',
            foreignKey: 'assemblyTypeID'
        });
        RFQAssemblies.belongsTo(models.RFQRoHS, {
            foreignKey: 'RoHSStatusID',
            as: 'rfq_rohsmst'
        });
        RFQAssemblies.hasMany(models.RFQAssembliesQuotationSubmitted, {
            as: 'rfqAssyQuoteSubmitted',
            foreignKey: 'rfqAssyID'
        });
        RFQAssemblies.hasMany(models.RFQQuoteIssueHistory, {
            as: 'rfqQuoteIssueHistory',
            foreignKey: 'rfqAssyID'
        });

        RFQAssemblies.hasMany(models.RFQAssyMiscBuild, {
            as: 'rfqAssyMiscBuild',
            foreignKey: 'rfqAssyID'
        });
        RFQAssemblies.hasMany(models.RFQPriceGroupDetail, {
            as: 'rfqPriceGroupDetail',
            foreignKey: 'rfqAssyID'
        });
        RFQAssemblies.belongsTo(models.User, {
            foreignKey: 'activityStartBy',
            as: 'user'
        });
    };

    return RFQAssemblies;
};
