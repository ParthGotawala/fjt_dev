const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PackingSlipMaterialReceivePartInspectionDet = sequelize.define('PackingSlipMaterialReceivePartInspectionDet', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        partId: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        lineId: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        instruction: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        inspectionStatus: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        remark: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        createByRoleId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updateByRoleId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNUll: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        category: {
            type: Sequelize.STRING,
            allowNull: false
        },
        requiementType: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        tableName: 'packing_slip_material_receive_part_inspection_det',
        paranoid: true
    });

    PackingSlipMaterialReceivePartInspectionDet.associate = (models) => {
        PackingSlipMaterialReceivePartInspectionDet.belongsTo(models.PackingSlipMaterialReceiveDet, {
            as: 'packingSlipDetail',
            foreignKey: 'lineId'
        });
        PackingSlipMaterialReceivePartInspectionDet.belongsTo(models.Component, {
            as: 'partmst',
            foreignKey: 'partId'
        });
    };

    return PackingSlipMaterialReceivePartInspectionDet;
};