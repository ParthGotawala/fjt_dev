
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const GenericCategory = sequelize.define('GenericCategory', {
        gencCategoryID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        // for Allow blank space for sparator conmment code notempty
        gencCategoryName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                // notEmpty: false,
                len: [1, 255]
            }
        },
        gencCategoryCode: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 255]
            }
            // unique: 'categorytype_gencCategoryName_unique'
        },
        categoryType: {
            allowNull: false,
            type: Sequelize.STRING,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        displayOrder: {
            allowNull: true,
            type: Sequelize.DECIMAL(6, 2)
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        parentGencCategoryID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        isActive: {
            type: Sequelize.BOOLEAN,
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
        systemGenerated: {
            type: Sequelize.BOOLEAN
            // allowNull: false
        },
        termsDays: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        colorCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        carrierID: {
            allowNull: true,
            type: Sequelize.INTEGER
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
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isEOM: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        paymentTypeCategoryId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        bankid: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
        indexes: [{
            unique: true,
            fields: ['categoryType', 'gencCategoryName']

        }],
        tableName: 'genericcategory'
    });

    GenericCategory.associate = (models) => {
        GenericCategory.belongsTo(models.GenericCategory, {
            foreignKey: 'parentGencCategoryID',
            as: 'parentGenericCategory'
        });
        GenericCategory.belongsTo(models.GenericCategory, {
            foreignKey: 'carrierID',
            as: 'CarrierCategory'
        });
        GenericCategory.belongsTo(models.GenericCategory, {
            foreignKey: 'paymentTypeCategoryId',
            as: 'paymentTypeCategory'
        });
        GenericCategory.belongsTo(models.BankMst, {
            foreignKey: 'bankid',
            as: 'bankMst'
        });
        GenericCategory.hasMany(models.Equipment, {
            foreignKey: 'eqpTypeID',
            as: 'equipmentType'
        });
        GenericCategory.hasMany(models.ReportMaster, {
            foreignKey: 'reportCategoryId',
            as: 'reportMaster'
        });
        GenericCategory.hasMany(models.CertificateStandards, {
            foreignKey: 'standardTypeID',
            as: 'standardType'
        });
        GenericCategory.hasMany(models.Operation, {
            foreignKey: 'operationTypeID',
            as: 'operationType'
        });
        GenericCategory.hasMany(models.Equipment, {
            foreignKey: 'locationTypeID',
            as: 'locationType'
        });
        GenericCategory.hasMany(models.WorkorderOperation, {
            foreignKey: 'operationTypeID',
            as: 'workorderOperation'
        });
        GenericCategory.hasMany(models.SalesOrderMst, {
            foreignKey: 'shippingMethodID',
            as: 'salesordermst'
        });
        GenericCategory.hasMany(models.SalesShippingMst, {
            foreignKey: 'shippingMethodID',
            as: 'salesShippingMst'
        });
        GenericCategory.hasOne(models.Component, {
            as: 'component',
            foreignKey: 'partStatus'
        });
        GenericCategory.hasMany(models.ECORequest, {
            as: 'ecoDfmType',
            foreignKey: 'ecoDfmTypeID'
        });
        GenericCategory.hasMany(models.EmployeeResponsibility, {
            as: 'employeeResponsibility',
            foreignKey: 'responsibilityID'
        });
        GenericCategory.hasMany(models.MfgCodeMst, {
            foreignKey: 'shippingMethodID',
            as: 'customer'
        });
        GenericCategory.hasMany(models.PackingSlipMaterialReceive, {
            foreignKey: 'paymentTermsID',
            as: 'packing_slip_material_receive'
        });
        GenericCategory.hasMany(models.PurchaseOrderMst, {
            foreignKey: 'termsID',
            as: 'paymentTermsPurchaseOrderMst'
        });
        GenericCategory.hasMany(models.PurchaseOrderMst, {
            foreignKey: 'shippingMethodID',
            as: 'shippingMethodPurchaseOrderMst'
        });
        GenericCategory.hasMany(models.PurchaseOrderLineReleaseDet, {
            foreignKey: 'shippingMethodID',
            as: 'shippingMethodPurchaseOrderLineReleaseDet'
        });
        GenericCategory.hasMany(models.MfgCodeMst, {
            foreignKey: 'rmashippingMethodId',
            as: 'rmaMgfCodeMst'
        });
        GenericCategory.hasMany(models.MfgCodeMst, {
            foreignKey: 'carrierID',
            as: 'carrierMfgCode'
        });
        GenericCategory.hasMany(models.MfgCodeMst, {
            foreignKey: 'rmaCarrierID',
            as: 'rmacarrierMfgCode'
        });
        GenericCategory.hasMany(models.PurchaseOrderMst, {
            foreignKey: 'carrierID',
            as: 'carrierPurchaseOrderMst'
        });
        GenericCategory.hasMany(models.InspectionMst, {
            foreignKey: 'partRequirementCategoryID',
            as: 'inspectionMstPartRequirement'
        });
    };

    return GenericCategory;
};