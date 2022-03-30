const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SupplierMappingMst = sequelize.define('SupplierMappingMst', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        supplierID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refMfgCodeMstID: {
            type: Sequelize.STRING,
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
        },
        isCustMapping: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        paranoid: true,
        tableName: 'supplier_mapping_mst'
    });

    SupplierMappingMst.associate = (models) => {
        SupplierMappingMst.belongsTo(models.MfgCodeMst, {
            as: 'MfgCodeMstSupplier',
            foreignKey: 'supplierID'
        });
        SupplierMappingMst.belongsTo(models.MfgCodeMst, {
            as: 'MfgCodeMstManufacturer',
            foreignKey: 'refMfgCodeMstID'
        });
        SupplierMappingMst.belongsTo(models.MfgCodeMst, {
            as: 'MfgCodeMstCustomer',
            foreignKey: 'refMfgCodeMstID'
        });
    };
    return SupplierMappingMst;
};