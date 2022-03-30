const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const VUComponent = sequelize.define('VUComponent', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        PIDCode: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 109]
            }
        },
        imageURL: {
            type: Sequelize.STRING,
            allowNull: true
        },
        productionPN: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mfgPN: {
            type: Sequelize.STRING,
            allowNull: false
        },
        mfgcodeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mfgPNDescription: {
            type: Sequelize.STRING,
            allowNull: true
        },
        maxQtyonHand: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        packageQty: {
            type: Sequelize.DECIMAL(18, 6),
            allowNull: true
        },
        partStatus: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        ltbDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        isGoodPart: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        RoHSStatusID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        packaginggroupID: {
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
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        rohsgroupID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        leadTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        packaging: {
            type: Sequelize.STRING,
            allowNull: true
        },
        noOfPosition: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        countryOfOrigin: {
            type: Sequelize.STRING,
            allowNull: true
        },
        uom: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        mountingTypeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        partPackage: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deviceMarking: {
            type: Sequelize.STRING,
            allowNull: true
        },
        minimum: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mult: {
            type: Sequelize.STRING,
            allowNull: true
        },
        htsCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        category: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rohsText: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dataSheetLink: {
            type: Sequelize.STRING,
            allowNull: true
        },
        replacementPartID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        eolDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        value: {
            type: Sequelize.STRING,
            allowNull: true
        },
        tolerance: {
            type: Sequelize.STRING,
            allowNull: true
        },
        minOperatingTemp: {
            type: Sequelize.DECIMAL(18, 6),
            allowNull: true
        },
        maxOperatingTemp: {
            type: Sequelize.DECIMAL(18, 6),
            allowNull: true
        },
        functionalCategoryID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        weight: {
            type: Sequelize.STRING,
            allowNull: true
        },
        length: {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: true
        },
        width: {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: true
        },
        height: {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: true
        },
        saftyStock: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        specialNote: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        uomText: {
            type: Sequelize.STRING,
            allowNull: true
        },
        heightText: {
            type: Sequelize.STRING,
            allowNull: true
        },
        partStatusText: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isPIDManual: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        feature: {
            type: Sequelize.STRING,
            allowNull: true
        },
        functionalCategoryText: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mountingTypeText: {
            type: Sequelize.STRING,
            allowNull: true
        },
        maxPriceLimit: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: true
        },
        selfLifeDays: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isCustom: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        rev: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mslID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        connecterTypeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        connectorTypeText: {
            type: Sequelize.STRING,
            allowNull: true
        },
        costCategoryID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        noOfRows: {
            type: Sequelize.STRING,
            allowNull: true
        },
        bookValue: {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: true
        },
        voltage: {
            type: Sequelize.STRING,
            allowNull: true
        },
        operatingTemp: {
            type: Sequelize.STRING,
            allowNull: true
        },
        powerRating: {
            type: Sequelize.STRING,
            allowNull: true
        },
        pitch: {
            type: Sequelize.STRING,
            allowNull: true
        },
        pitchMating: {
            type: Sequelize.STRING,
            allowNull: true
        },
        scrapRatePercentagePerBuild: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        plannedOverRunPercentagePerBuild: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        nickName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        sizeDimension: {
            type: Sequelize.STRING,
            allowNull: true
        },
        bomLock: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        restrictUSEwithpermission: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        restrictUsePermanently: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        rfqOnly: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        plannedValuePerBuild: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        scrapValuePerBuild: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        customerID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        eau: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: true
        },
        assyCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        pcbPerArray: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        temperatureCoefficientValue: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        temperatureCoefficient: {
            type: Sequelize.STRING,
            allowNull: true
        },
        temperatureCoefficientUnit: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isCPN: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        matingPartRquired: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        driverToolRequired: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        pickupPadRequired: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        programingRequired: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        functionalTestingRequired: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        liveInternalVersion: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        liveVersion: {
            type: Sequelize.STRING,
            allowNull: true
        },
        custAssyPN: {
            type: Sequelize.STRING,
            allowNull: true
        },
        partType: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        functionalTypePartRequired: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        mountingTypePartRequired: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        shelfListDaysThresholdPercentage: {
            type: Sequelize.DECIMAL(16, 8),
            allowNull: true
        },
        color: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refSupplierMfgpnComponentID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        businessRisk: {
            type: Sequelize.STRING,
            allowNull: true
        },
        exteranalAPICallStatus: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isBOMVerified: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        packagingID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isTemperatureSensitive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        unit: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: false
        },
        grossWeight: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: true
        },
        packagingWeight: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: true
        },
        isCloudApiUpdateAttribute: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        epicorType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        grossWeightUom: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        packagingWeightUom: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        price: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: true
        },
        noOfPositionText: {
            type: Sequelize.STRING,
            allowNull: true
        },
        uomClassID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        noOfRowsText: {
            type: Sequelize.STRING,
            allowNull: true
        },
        rohsDeviation: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        alertExpiryDays: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        umidVerificationRequire: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        isAutoVerificationOfAllAssemblyParts: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        totalSolderPoints: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        trackSerialNumber: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        restrictPackagingUseWithpermission: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        restrictPackagingUsePermanently: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        reversalDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        serialNumber: {
            type: Sequelize.STRING,
            allowNull: false
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
        systemGenerated: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        purchasingComment: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        detailDescription: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        isReversal: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        requiredTestTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        predictedObsolescenceYear: {
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
        obsoleteDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        assemblyType: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refMfgPNMfgCodeId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        frequency: {
            type: Sequelize.INTEGER,
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
        mfrNameText: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isFluxNotApplicable: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isHazmatMaterial: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        rfqNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        salesacctId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        purchaseacctId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        umidSPQ: {
            type: Sequelize.DECIMAL(18, 6),
            allowNull: true
        },
        internalReference: {
            type: Sequelize.STRING,
            allowNull: true
        },
        shelfLifeAcceptanceDays: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        maxShelfLifeAcceptanceDays: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        maxShelfListDaysThresholdPercentage: {
            type: Sequelize.DECIMAL(16, 8),
            allowNull: true
        },
        quoteValidTillDate: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        mfgType: {
            allowNull: true,
            type: Sequelize.STRING
        },
        shelfLifeDateType: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        frequencyType: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isReceiveBulkItem: {
            type: Sequelize.BOOLEAN,
            allowNUll: false
        },
        isEpoxyMount: {
            type: Sequelize.BOOLEAN,
            allowNUll: false
        },
        dateCodeFormatID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isDateCodeFormat: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
        }
    },
        {
            paranoid: true,
            tableName: 'vu_component'
        });

    VUComponent.associate = (models) => {
        VUComponent.hasMany(models.ComponentAlternatePN, {
            foreignKey: 'componentID',
            as: 'componentAsAlterPN'
        });

        VUComponent.hasMany(models.ComponentAlternatePN, {
            foreignKey: 'refComponentID',
            as: 'componentAlterPN'
        });

        VUComponent.hasMany(models.ComponentPackagingAlias, {
            foreignKey: 'componentID',
            as: 'componentPackagingAlias'
        });

        VUComponent.hasMany(models.ComponentDataelement, {
            foreignKey: 'componentID',
            as: 'componentDataElement'
        });

        VUComponent.belongsTo(models.MfgCodeMst, {
            as: 'mfgCodemst',
            foreignKey: 'mfgcodeID'
        });
        VUComponent.belongsTo(models.MfgCodeMst, {
            as: 'refMfgPNMfgCodemst',
            foreignKey: 'refMfgPNMfgCodeId'
        });
        VUComponent.belongsTo(models.MeasurementType, {
            as: 'measurement_Type',
            foreignKey: 'uomClassID'
        });
        VUComponent.belongsTo(models.UOMs, {
            as: 'UOMs',
            foreignKey: 'uom'
        });
        VUComponent.belongsTo(models.UOMs, {
            as: 'grossWgtUom',
            foreignKey: 'grossWeightUom'
        });
        VUComponent.belongsTo(models.UOMs, {
            as: 'packagingWgtUom',
            foreignKey: 'packagingWeightUom'
        });

        VUComponent.hasMany(models.ComponentSidStock, {
            foreignKey: 'refcompid',
            as: 'componentsidstock'
        });
        VUComponent.hasMany(models.SupplierQuotePartsDet, {
            foreignKey: 'partID',
            as: 'supplier_quote_parts_det'
        });
        VUComponent.hasMany(models.SupplierQuotePartsDet, {
            foreignKey: 'supplierPartID',
            as: 'supplier_quote_supplier_parts_det'
        });
        VUComponent.hasMany(models.RFQAssemblies, {
            foreignKey: 'partID',
            as: 'rfqAssemblies'
        });

        VUComponent.hasMany(models.ComponentCustAliasRevPN, {
            foreignKey: 'refComponentID',
            as: 'ComponentCustAliasRevPN'
        });

        VUComponent.hasMany(models.ComponentCustAliasRevPN, {
            foreignKey: 'refCPNPartID',
            as: 'ComponentCPNPart'
        });

        VUComponent.hasMany(models.ComponentDrivetools, {
            as: 'refDriveToolAlias',
            foreignKey: 'refComponentID'
        });

        VUComponent.hasMany(models.ComponentDrivetools, {
            as: 'driveToolAlias',
            foreignKey: 'componentID'
        });

        VUComponent.hasMany(models.ComponentStandardDetails, {
            as: 'componetStandardDetail',
            foreignKey: 'componentID'
        });
        VUComponent.hasMany(models.RFQLineItems, {
            as: 'rfqLineitems',
            foreignKey: 'partID'
        });
        VUComponent.hasMany(models.RFQLineItems, {
            as: 'custPNIDrfqLineitems',
            foreignKey: 'custPNID'
        });
        VUComponent.hasMany(models.RFQLineitemsAlternatepart, {
            as: 'distPNRfqLineitemsAlternatepart',
            foreignKey: 'distMfgPNID'
        });
        VUComponent.hasMany(models.RFQLineitemsAlternatepart, {
            as: 'partidRfqLineitemsAlternatepart',
            foreignKey: 'partid'
        });
        VUComponent.hasMany(models.RFQLineitemsAlternatepart, {
            as: 'mfgPNRfqLineitemsAlternatepart',
            foreignKey: 'mfgPNID'
        });

        VUComponent.hasMany(models.ComponentROHSAlternatePN, {
            as: 'mfgPNRfqLineitemsRohsAlternatepn',
            foreignKey: 'componentID'
        });

        VUComponent.hasMany(models.RFQConsolidatedMFGPNLineItemAlternate, {
            as: 'rfqConsolidatedMFGPNLineItemAlternate',
            foreignKey: 'mfgPNID'
        });

        VUComponent.hasMany(models.ComponentCustomerLOA, {
            as: 'customerLOA',
            foreignKey: 'componentID'
        });
        VUComponent.hasMany(models.AssemblyRevisionComments, {
            as: 'partID',
            foreignKey: 'partID'
        });
        VUComponent.belongsTo(models.ComponentPartStatus, {
            as: 'componentPartStatus',
            foreignKey: 'partStatus'
        });
        VUComponent.belongsTo(models.RFQConnecterType, {
            as: 'rfqConnecterType',
            foreignKey: 'connecterTypeID'
        });
        VUComponent.belongsTo(models.CostCategory, {
            as: 'costCategory',
            foreignKey: 'costCategoryID'
        });
        VUComponent.belongsTo(models.RFQPartType, {
            foreignKey: 'functionalCategoryID',
            as: 'rfqPartType'
        });
        VUComponent.belongsTo(models.RFQMountingType, {
            foreignKey: 'mountingTypeID',
            as: 'rfqMountingType'
        });
        VUComponent.belongsTo(models.MfgCodeMst, {
            foreignKey: 'CustomerID',
            as: 'customer'
        });
        VUComponent.belongsTo(models.Component, {
            foreignKey: 'replacementPartID',
            as: 'replacementComponent'
        });
        VUComponent.belongsTo(models.ComponentMSLMst, {
            foreignKey: 'mslID',
            as: 'component_mslmst'
        });
        VUComponent.belongsTo(models.RFQRoHS, {
            foreignKey: 'RoHSStatusID',
            as: 'rfq_rohsmst'
        });
        VUComponent.hasMany(models.Workorder, {
            foreignKey: 'partID',
            as: 'workorder'
        });
        VUComponent.hasMany(models.ComponentSidStock, {
            foreignKey: 'refCPNMFGPNID',
            as: 'componentsidstock_cpn'
        });
        VUComponent.hasMany(models.WorkorderOperationPart, {
            foreignKey: 'partID',
            as: 'workorderOperationPart'
        });
        VUComponent.hasMany(models.OperationPart, {
            foreignKey: 'partID',
            as: 'operationPart'
        });
        VUComponent.hasMany(models.ComponentRequireFunctionalType, {
            foreignKey: 'refComponentID',
            as: 'component_requirefunctionaltype'
        });
        VUComponent.hasMany(models.ComponentRequireMountingType, {
            foreignKey: 'refComponentID',
            as: 'component_requiremountingtype'
        });
        VUComponent.hasMany(models.ComponentImages, {
            foreignKey: 'refComponentID',
            as: 'component_images'
        });
        VUComponent.hasMany(models.ComponentDataSheets, {
            foreignKey: 'refComponentID',
            as: 'component_datasheets'
        });
        VUComponent.hasMany(models.ComponentOtherPN, {
            foreignKey: 'refComponentID',
            as: 'component_otherpn'
        });
        VUComponent.belongsTo(models.ComponentPackagingMst, {
            as: 'component_packagingmst',
            foreignKey: 'packagingID'
        });
        VUComponent.belongsTo(models.Component, {
            foreignKey: 'refSupplierMfgpnComponentID',
            as: 'refSupplierMfgComponent'
        });
        VUComponent.hasMany(models.ComponentTemperatureSensitiveData, {
            foreignKey: 'refComponentID',
            as: 'component_temperature_sensitive_data'
        });
        VUComponent.belongsTo(models.RFQPartCategory, {
            foreignKey: 'partType',
            as: 'rfq_partcategory'
        });
        VUComponent.hasMany(models.ComponentProcessMaterial, {
            as: 'refProcessMaterial',
            foreignKey: 'refComponentID'
        });
        VUComponent.hasMany(models.ComponentProcessMaterial, {
            as: 'ProcessMaterial',
            foreignKey: 'componentID'
        });
        VUComponent.hasMany(models.ComponentCustAliasRevPN, {
            foreignKey: 'refCPNPartID',
            as: 'ComponentCustAliasRevPart'
        });
        VUComponent.hasMany(models.PurchasePartsDetails, {
            foreignKey: 'refAssyId',
            as: 'refAssembly'
        });
        VUComponent.hasMany(models.PurchasePartsDetails, {
            foreignKey: 'refComponentId',
            as: 'PurchasePartsDetails'
        });
        VUComponent.belongsTo(models.User, {
            foreignKey: 'activityStartBy',
            as: 'user'
        });
        VUComponent.hasMany(models.ECORequest, {
            as: 'fromEcoRequest',
            foreignKey: 'fromPartID'
        });
        VUComponent.hasMany(models.ECORequest, {
            as: 'toEcoRequest',
            foreignKey: 'toPartID'
        });
        VUComponent.belongsTo(models.RFQPackageCaseType, {
            as: 'rfq_packagecasetypemst',
            foreignKey: 'partPackageID'
        });
        VUComponent.hasMany(models.ComponentDynamicAttributeMappingPart, {
            as: 'componetDynamicAttributeDetails',
            foreignKey: 'mfgPNID'
        });
        VUComponent.hasMany(models.ComponentAcceptableShippingCountries, {
            as: 'Component_Acceptable_Shipping_Countries',
            foreignKey: 'refComponentID'
        });
        VUComponent.hasMany(models.Equipment, {
            as: 'equipment',
            foreignKey: 'assyId'
        });
        VUComponent.hasMany(models.AssemblyStock, {
            foreignKey: 'partID',
            as: 'assemblystock'
        });
        VUComponent.hasMany(models.RackMst, {
            foreignKey: 'partID',
            as: 'rackMst'
        });
        VUComponent.hasMany(models.RackMstHistory, {
            foreignKey: 'partID',
            as: 'rackMstHistory'
        });
        VUComponent.belongsTo(models.RFQAssyTypeMst, {
            as: 'rfq_assy_typemst',
            foreignKey: 'assemblyType'
        });
        VUComponent.hasMany(models.CustomerPackingSlipDet, {
            foreignKey: 'partId',
            as: 'customerPackingSlipDet'
        });
        VUComponent.hasMany(models.SalesorderdetCommissionAttribute, {
            foreignKey: 'partID',
            as: 'salesorderDetCommissionAttribute'
        });
        VUComponent.hasMany(models.RFQLineItemsProgrammingMapping, {
            foreignKey: 'partID',
            as: 'RFQLineItemsProgrammingMapping'
        });
        VUComponent.hasMany(models.ComponentApprovedSupplierMst, {
            foreignKey: 'partID',
            as: 'component_approved_supplier_mst'
        });
        VUComponent.hasMany(models.ComponentApprovedSupplierPriorityDetail, {
            foreignKey: 'partID',
            as: 'component_approved_supplier_priority_detail'
        });
        VUComponent.hasMany(models.PurchaseOrderDet, {
            foreignKey: 'mfgPartID',
            as: 'mfgPartPurchaseOrder'
        });
        VUComponent.hasMany(models.PurchaseOrderDet, {
            foreignKey: 'supplierPartID',
            as: 'supplierPartPurchaseOrder'
        });
        VUComponent.hasMany(models.ComponenetInspectionRequirementDet, {
            foreignKey: 'partId',
            as: 'componenet_inspection_requirement_det'
        });
        VUComponent.belongsTo(models.AcctAcctMst, {
            foreignKey: 'salesacctId',
            as: 'salesCOA'
        });
        VUComponent.belongsTo(models.AcctAcctMst, {
            foreignKey: 'purchaseacctId',
            as: 'purchasCOA'
        });
        VUComponent.hasMany(models.VUSubAssemblyCount, {
            foreignKey: 'partID',
            as: 'vuSubAssemblyCount',
            sourceKey: 'id'
        });
        VUComponent.hasMany(models.ComponentLastExternalAPICall, {
            foreignKey: 'refComponentID',
            as: 'componentLastExternalAPICall'
        });
        VUComponent.hasMany(models.ComponentBOMSetting, {
            foreignKey: 'refComponentID',
            as: 'componentbomSetting'
        });
    };
    return VUComponent;
};