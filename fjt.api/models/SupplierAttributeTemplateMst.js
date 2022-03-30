const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SupplierAttributeTemplateMst = sequelize.define('SupplierAttributeTemplateMst', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        supplierID: {
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
        tableName: 'supplier_attribute_template_mst'
    });

    SupplierAttributeTemplateMst.associate = (models) => {
        SupplierAttributeTemplateMst.belongsTo(models.MfgCodeMst, {
            as: 'mfgCodemst',
            foreignKey: 'supplierID'
        });
        SupplierAttributeTemplateMst.hasMany(models.SupplierAttributeTemplateDet, {
            foreignKey: 'supplierAttributeTemplateID',
            as: 'supplier_attribute_template_det'
        });
    };

    return SupplierAttributeTemplateMst;
};