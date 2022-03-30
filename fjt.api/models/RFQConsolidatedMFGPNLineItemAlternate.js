const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQConsolidatedMFGPNLineItemAlternate = sequelize.define('RFQConsolidatedMFGPNLineItemAlternate', {

        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        mfgPN: {
            type: Sequelize.STRING,
            allowNull: false
        },
        consolidateID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        mfgPNID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mfgCodeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        PIDCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isdeleted: {
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
        customerApproval: {
            type: Sequelize.STRING,
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
        approvedMountingType: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'rfq_consolidated_mfgpn_lineitem_alternate'
    });

    RFQConsolidatedMFGPNLineItemAlternate.associate = (models) => {
        RFQConsolidatedMFGPNLineItemAlternate.belongsTo(models.RFQConsolidatedMFGPNLineItem, {
            as: 'rfqConsolidatedMFGPNLinteItem',
            foreignKey: 'consolidateID'
        });
        RFQConsolidatedMFGPNLineItemAlternate.belongsTo(models.MfgCodeMst, {
            as: 'mfgCodeMst',
            foreignKey: 'mfgCodeID'
        });

        RFQConsolidatedMFGPNLineItemAlternate.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'mfgPNID'
        });
    };

    return RFQConsolidatedMFGPNLineItemAlternate;
};
