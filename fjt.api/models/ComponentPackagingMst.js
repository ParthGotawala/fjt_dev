/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentPackagingMst = sequelize.define('ComponentPackagingMst', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 100]
            }
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isActive: {
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
        systemGenerated: {
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
        displayOrder: {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: true
        },
        sourceName: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'component_packagingmst'
    });

    ComponentPackagingMst.associate = (models) => {
        ComponentPackagingMst.hasMany(models.Component, {
            as: 'component',
            foreignKey: 'packagingID'
        });
        ComponentPackagingMst.hasMany(models.ComponentFieldsGenericaliasMst, {
            as: 'Component_Fields_Genericalias_Mst',
            foreignKey: 'refId'
        });
        ComponentPackagingMst.hasMany(models.SupplierQuotePartPrice, {
            as: 'Component_PackagingMst',
            foreignKey: 'packageID'
        });
        ComponentPackagingMst.hasMany(models.PurchaseOrderDet, {
            as: 'purchaseOrderDet',
            foreignKey: 'packagingID'
        });
    };

    return ComponentPackagingMst;
};
