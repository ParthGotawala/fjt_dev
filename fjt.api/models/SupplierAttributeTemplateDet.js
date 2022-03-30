const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SupplierAttributeTemplateDet = sequelize.define('SupplierAttributeTemplateDet', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        supplierAttributeTemplateID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        attributeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: false
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
        }
    }, {
        paranoid: true,
        tableName: 'supplier_attribute_template_det'
    });

    SupplierAttributeTemplateDet.associate = (models) => {
        SupplierAttributeTemplateDet.belongsTo(models.SupplierAttributeTemplateMst, {
            as: 'supplier_attribute_template_mst',
            foreignKey: 'supplierAttributeTemplateID'
        });
        SupplierAttributeTemplateDet.belongsTo(models.QuoteDynamicFields, {
            as: 'quotecharges_dynamic_fields_mst',
            foreignKey: 'attributeID'
        });
    };
    
    return SupplierAttributeTemplateDet;
};