const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQLineitemsAlternatepartHistory = sequelize.define('RFQLineitemsAlternatepartHistory', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rfqLineItemsID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        refSubmittedQuoteID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        distributor: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
                len: [0, 500]
            }
        },
        distMfgCodeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        distPN: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
                len: [0, 150]
            }
        },
        distMfgPNID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mfgCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mfgCodeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mfgPN: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mfgPNID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        notes: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isApproved: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isNoBidsPN: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isDraft: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        RoHSStatusID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        copyAlternetPartID: {
            type: Sequelize.INTEGER,
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
        mfgVerificationStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mfgDistMappingStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mfgCodeStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        distVerificationStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        distCodeStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        getMFGPNStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        obsoletePartStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mfgGoodPartMappingStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        distGoodPartMappingStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        rfqAssyID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mfgPNStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        distPNStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        customerApproval: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        customerApprovalBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        customerApprovalDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        org_distributor: {
            type: Sequelize.STRING,
            allowNull: true
        },
        org_distPN: {
            type: Sequelize.STRING,
            allowNull: true
        },
        org_mfgCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        org_mfgPN: {
            type: Sequelize.STRING,
            allowNull: true
        },
        badMfgPN: {
            type: Sequelize.STRING,
            allowNull: true
        },
        nonRohsStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        epoxyStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        invalidConnectorTypeStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        duplicateMPNInSameLineStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        parttypeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mountingtypeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        partcategoryID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        userData1: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userData2: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userData3: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userData4: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userData5: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userData6: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userData7: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userData8: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userData9: {
            type: Sequelize.STRING,
            allowNull: true
        },
        userData10: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mismatchMountingTypeStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mismatchFunctionalCategoryStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mismatchCustomPartStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        restrictUseWithPermissionStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        restrictUsePermanentlyStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        pickupPadRequiredStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        matingPartRquiredStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        driverToolsRequiredStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        functionalTestingRequiredStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mismatchValueStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mismatchPackageStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mismatchToleranceStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mismatchTempratureStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mismatchPowerStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        uomMismatchedStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        programingRequiredStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mismatchColorStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isCustomerUnAppoval: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        customerUnAppovalBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        customerUnAppovalDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        restrictUseInBOMStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        restrictUseInBOMWithPermissionStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        unknownPartStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        defaultInvalidMFRStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isUnlockApprovedPart: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        restrictUseInBOMExcludingAliasStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        restrictUseInBOMExcludingAliasWithPermissionStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        restrictUseExcludingAliasStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        restrictUseExcludingAliasWithPermissionStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        approvedMountingType: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        suggestedGoodPartStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        suggestedGoodDistPartStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'rfq_lineitems_alternatepart_history'
    });

    RFQLineitemsAlternatepartHistory.associate = (models) => {
        RFQLineitemsAlternatepartHistory.belongsTo(models.RFQLineItemsHistory, {
            as: 'rfqLineItemsHistory',
            foreignKey: 'rfqLineItemsID'
        });

        RFQLineitemsAlternatepartHistory.belongsTo(models.MfgCodeMst, {
            as: 'distMfgCodeMst',
            foreignKey: 'distMfgCodeID'
        });

        RFQLineitemsAlternatepartHistory.belongsTo(models.MfgCodeMst, {
            as: 'mfgCodeMfgCodeMst',
            foreignKey: 'mfgCodeID'
        });

        RFQLineitemsAlternatepartHistory.belongsTo(models.Component, {
            as: 'distComponent',
            foreignKey: 'distMfgPNID'
        });

        RFQLineitemsAlternatepartHistory.belongsTo(models.Component, {
            as: 'mfgComponent',
            foreignKey: 'mfgPNID'
        });
        RFQLineitemsAlternatepartHistory.belongsTo(models.RFQAssembliesQuotationSubmitted, {
            as: 'rfqAssySubmittedBom',
            foreignKey: 'refSubmittedQuoteID'
        });

        RFQLineitemsAlternatepartHistory.belongsTo(models.RFQAssemblies, {
            as: 'rfqAssemblies',
            foreignKey: 'rfqAssyID'
        });

        RFQLineitemsAlternatepartHistory.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'partID'
        });
    };

    return RFQLineitemsAlternatepartHistory;
};
