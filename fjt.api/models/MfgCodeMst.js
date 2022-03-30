const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const MfgCodeMst = sequelize.define('MfgCodeMst', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        mfgCode: {
            allowNull: false,
            type: Sequelize.STRING,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        mfgType: {
            allowNull: true,
            type: Sequelize.STRING
        },
        mfgName: {
            allowNull: true,
            type: Sequelize.STRING
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
        customerID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        dateCodeFormatID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        isPricingApi: {
            allowNull: true,
            type: Sequelize.BOOLEAN
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true
        },
        website: {
            type: Sequelize.STRING,
            allowNull: true
        },
        contact: {
            type: Sequelize.STRING,
            allowNull: true
        },
        comments: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        poComment: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        phExtension: {
            type: Sequelize.STRING,
            allowNull: true
        },
        contactCountryCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        faxNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        faxCountryCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isCustOrDisty: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        acquisitionDetail: {
            type: Sequelize.STRING,
            allowNull: true
        },
        paymentTermsID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        territory: {
            type: Sequelize.STRING,
            allowNull: true
        },
        shippingMethodID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        scanDocumentSide: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isCompany: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        authorizeType: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        systemGenerated: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isOrderQtyRequiredInPackingSlip: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        customerType: {
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
        displayOrder: {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: true
        },
        salesCommissionTo: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        freeOnBoardId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        supplierMFRMappingType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        taxID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        accountRef: {
            type: Sequelize.STRING,
            allowNull: true
        },
        paymentMethodID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        carrierID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rmaCarrierID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rmashippingMethodId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        carrierAccount: {
            type: Sequelize.STRING,
            allowNull: true
        },
        rmaCarrierAccount: {
            type: Sequelize.STRING,
            allowNull: true
        },
        shippingInsurence: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        rmaShippingInsurence: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        documentPath: {
            type: Sequelize.STRING,
            allowNull: true
        },
        customerSystemID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        systemID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        invoicesRequireManagementApproval: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        acctId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isSupplierEnable: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        externalSupplierOrder: {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: true
        },
        legalName: {
            allowNull: true,
            type: Sequelize.STRING
        }
    }, {
        paranoid: true,
        tableName: 'mfgCodemst'
    });

    MfgCodeMst.associate = (models) => {
        MfgCodeMst.hasMany(models.MfgCodeAlias, {
            as: 'mfgCodeAlias',
            foreignKey: 'mfgcodeId'
        });
        MfgCodeMst.hasMany(models.BRLabelTemplate, {
            as: 'mfgCodeDetail',
            foreignKey: 'mfgcodeid'
        });
        MfgCodeMst.hasMany(models.Component, {
            as: 'component',
            foreignKey: 'mfgcodeID'
        });
        MfgCodeMst.hasMany(models.Component, {
            as: 'refMfgPNComponent',
            foreignKey: 'refMfgPNMfgCodeId'
        });
        MfgCodeMst.hasMany(models.Component, {
            as: 'customer',
            foreignKey: 'CustomerID'
        });
        MfgCodeMst.hasMany(models.WhoBoughtWho, {
            foreignKey: 'buyBy',
            as: 'mfgCodeBy'
        });

        MfgCodeMst.hasOne(models.WhoBoughtWho, {
            foreignKey: 'buyTo',
            as: 'mfgCodeTo'
        });

        MfgCodeMst.hasMany(models.RFQLineitemsAlternatepart, {
            as: 'distRfqLineitemsAlternatepart',
            foreignKey: 'distMfgCodeID'
        });

        MfgCodeMst.hasMany(models.RFQLineitemsAlternatepart, {
            as: 'mfgRfqLineitemsAlternatepart',
            foreignKey: 'mfgCodeID'
        });

        MfgCodeMst.hasMany(models.Equipment, {
            as: 'equipment',
            foreignKey: 'customerId'
        });

        MfgCodeMst.hasMany(models.ComponentCustomerLOA, {
            as: 'customerLOA',
            foreignKey: 'customerID'
        });

        MfgCodeMst.hasMany(models.ShippedAssembly, {
            as: 'shippedAssembly',
            foreignKey: 'customerID'
        });

        MfgCodeMst.hasMany(models.SalesOrderMst, {
            foreignKey: 'customerID',
            as: 'salesordermst'
        });
        MfgCodeMst.hasMany(models.ContactPerson, {
            foreignKey: 'refTransID',
            as: 'contactPerson'
        });
        MfgCodeMst.hasMany(models.PurchasePartsDetails, {
            foreignKey: 'distMfgCodeID',
            as: 'PurchasePartsDetails'
        });
        MfgCodeMst.hasMany(models.InvalidMfgMappingMst, {
            foreignKey: 'refmfgCodeID',
            as: 'invalid_mfgmappings'
        });
        MfgCodeMst.hasMany(models.EmployeeMFGMapping, {
            foreignKey: 'mfgCodeId',
            as: 'employeeMFGMapping'
        });
        MfgCodeMst.belongsTo(models.DateCodeFormatMst, {
            as: 'dateCodeFormatMst',
            foreignKey: 'dateCodeFormatID'
        });
        MfgCodeMst.hasMany(models.ComponentAttributesSourceMapping, {
            foreignKey: 'mfgCodeID',
            as: 'componentAttributesSourceMapping'
        });
        MfgCodeMst.belongsTo(models.Employee, {
            as: 'salesCommissionEmployee',
            foreignKey: 'salesCommissionTo'
        });
        MfgCodeMst.hasMany(models.SupplierQuoteMst, {
            as: 'supplier_quote_mst',
            foreignKey: 'supplierID'
        });
        MfgCodeMst.hasMany(models.CustomerPackingSlip, {
            foreignKey: 'customerID',
            as: 'customerPackingSlip'
        });
        MfgCodeMst.hasMany(models.SupplierAttributeTemplateMst, {
            foreignKey: 'supplierID',
            as: 'supplier_attribute_template_mst'
        });
        MfgCodeMst.hasMany(models.SupplierMappingMst, {
            foreignKey: 'supplierID',
            as: 'supplier_mapping_mstSupplier'
        });
        MfgCodeMst.hasMany(models.SupplierMappingMst, {
            foreignKey: 'refMfgCodeMstID',
            as: 'supplier_mapping_mstManufacturer'
        });
        MfgCodeMst.belongsTo(models.FreeOnBoardMst, {
            foreignKey: 'freeOnBoardId',
            as: 'freeonboardmst'
        });
        MfgCodeMst.hasMany(models.ComponentApprovedSupplierMst, {
            foreignKey: 'supplierID',
            as: 'component_approved_supplier_mst'
        });
        MfgCodeMst.hasMany(models.ComponentApprovedSupplierPriorityDetail, {
            foreignKey: 'supplierID',
            as: 'component_approved_supplier_priority_detail'
        });
        MfgCodeMst.hasMany(models.CompanyInfo, {
            foreignKey: 'mfgCodeId',
            as: 'CompanyInfo'
        });
        MfgCodeMst.belongsTo(models.GenericCategory, {
            foreignKey: 'shippingMethodID',
            as: 'shippingMethod'
        });
        MfgCodeMst.belongsTo(models.GenericCategory, {
            foreignKey: 'paymentMethodID',
            as: 'paymentMethod'
        });
        MfgCodeMst.hasMany(models.PackingslipInvoicePayment, {
            foreignKey: 'mfgcodeID',
            as: 'packingslip_invoice_payment'
        });
        MfgCodeMst.hasMany(models.PurchaseOrderMst, {
            foreignKey: 'supplierID',
            as: 'purchaseOrderMst'
        });
        MfgCodeMst.belongsTo(models.GenericCategory, {
            foreignKey: 'rmashippingMethodId',
            as: 'rmaShippingMethod'
        });
        MfgCodeMst.belongsTo(models.GenericCategory, {
            foreignKey: 'carrierID',
            as: 'Carrier'
        });
        MfgCodeMst.belongsTo(models.GenericCategory, {
            foreignKey: 'rmaCarrierID',
            as: 'rmaCarrier'
        });
        MfgCodeMst.belongsTo(models.AcctAcctMst, {
            foreignKey: 'acctId',
            as: 'ChartOfAccounts'
        });
        MfgCodeMst.hasMany(models.MfgCodeMstCommentDet, {
            as: 'mfgcodemst_comment_det',
            foreignKey: 'mfgcodeID'
        });
        MfgCodeMst.hasMany(models.CustomerAddresses, {
            as: 'customerAddresses',
            foreignKey: 'customerId'
        });
        MfgCodeMst.hasMany(models.SupplierMappingMst, {
            foreignKey: 'supplierID',
            as: 'supplier_mapping_mstCustomerMapping'
        });
    };

    return MfgCodeMst;
};