const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentApprovedSupplierMst = sequelize.define('ComponentApprovedSupplierMst', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        supplierID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        priority: {
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
        },
        status: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'component_approved_supplier_mst'
    });

    ComponentApprovedSupplierMst.associate = (models) => {
        ComponentApprovedSupplierMst.belongsTo(models.MfgCodeMst, {
            as: 'mfgCodeMst',
            foreignKey: 'supplierID'
        });
        ComponentApprovedSupplierMst.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'partID'
        });
    };
    return ComponentApprovedSupplierMst;
};