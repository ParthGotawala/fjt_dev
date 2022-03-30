const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const KitAllocationLineitemsAlternatepart = sequelize.define('KitAllocationLineitemsAlternatepart', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refSalesOrderDetID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refKitAllocationLineItemId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refRfqLineitem: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refRfqLineItemAlternatePartId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        distributor: {
            type: Sequelize.STRING,
            allowNull: true
        },
        distMfgCodeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        distPN: {
            type: Sequelize.STRING,
            allowNull: true
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
        description: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        RoHSStatusID: {
            type: Sequelize.INTEGER,
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
        customerApproval: {
            type: Sequelize.STRING,
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
        restrictUsePermanentlyStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        restrictUseWithPermissionStep: {
            type: Sequelize.BOOLEAN,
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
        mismatchMountingTypeStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mismatchFunctionalCategoryStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
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
        approvedMountingType: {
            type: Sequelize.BOOLEAN,
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
        obsoletePartStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mfgGoodPartMappingStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        mfgPNStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        distPNStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        badMfgPN: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: true
        },
        distGoodPartMappingStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
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
        mismatchNumberOfRowsStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        partPinIsLessthenBOMPinStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        tbdPartStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        exportControlledStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isUnlockApprovedPart: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        unknownPartStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        defaultInvalidMFRStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        suggestedGoodPartStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        suggestedGoodDistPartStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        mismatchRequiredProgrammingStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        mappingPartProgramStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        mismatchCustomPartStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        },
        suggestedByApplicationMsg: {
            type: Sequelize.STRING,
            allowNull: true
        },
        suggestedByApplicationStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        mismatchProgrammingStatusStep: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: true
        }
    }, {
        paranoid: true,
        tableName: 'kit_allocation_lineitems_alternatepart'
    });

    KitAllocationLineitemsAlternatepart.associate = (models) => {
        KitAllocationLineitemsAlternatepart.belongsTo(models.KitAllocationLineitems, {
            as: 'KitAllocationLineitems',
            foreignKey: 'refKitAllocationLineItemId'
        });

        KitAllocationLineitemsAlternatepart.belongsTo(models.RFQLineItems, {
            as: 'RFQ_LineItems',
            foreignKey: 'refRfqLineitem'
        });

        KitAllocationLineitemsAlternatepart.belongsTo(models.RFQLineitemsAlternatepart, {
            as: 'RFQ_Lineitems_Alternatepart',
            foreignKey: 'refRfqLineItemAlternatePartId'
        });

        KitAllocationLineitemsAlternatepart.belongsTo(models.MfgCodeMst, {
            as: 'DistMfgCode',
            foreignKey: 'distMfgCodeID'
        });

        KitAllocationLineitemsAlternatepart.belongsTo(models.Component, {
            as: 'DistMfgPN',
            foreignKey: 'distMfgPNID'
        });

        KitAllocationLineitemsAlternatepart.belongsTo(models.MfgCodeMst, {
            as: 'MfgCode',
            foreignKey: 'mfgCodeID'
        });

        KitAllocationLineitemsAlternatepart.belongsTo(models.Component, {
            as: 'MfgPN',
            foreignKey: 'mfgPNID'
        });

        KitAllocationLineitemsAlternatepart.belongsTo(models.RFQRoHS, {
            as: 'RoHSMst',
            foreignKey: 'RoHSStatusID'
        });

        KitAllocationLineitemsAlternatepart.belongsTo(models.RFQPartType, {
            as: 'RFQ_PartType',
            foreignKey: 'parttypeID'
        });

        KitAllocationLineitemsAlternatepart.belongsTo(models.RFQMountingType, {
            as: 'RFQ_MountingType',
            foreignKey: 'mountingtypeID'
        });

        KitAllocationLineitemsAlternatepart.belongsTo(models.RFQPartCategory, {
            as: 'RFQ_PartCategory',
            foreignKey: 'partcategoryID'
        });

        KitAllocationLineitemsAlternatepart.belongsTo(models.Component, {
            as: 'part',
            foreignKey: 'partID'
        });
    };

    return KitAllocationLineitemsAlternatepart;
};