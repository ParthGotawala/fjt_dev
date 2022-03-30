const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PurchasePartsDetails = sequelize.define('PurchasePartsDetails', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refAssyId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        refBOMLineID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        refComponentId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        distMfgCodeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        poNumber: {
            type: Sequelize.STRING,
            allowNull: false
        },
        poDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        poQty: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        poPricePerUnit: {
            type: Sequelize.DECIMAL(18, 8),
            allowNull: false
        },
        soNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
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
        }
    },
        {
            tableName: 'purchase_parts_details',
            paranoid: true
        });

    PurchasePartsDetails.associate = (models) => {
        PurchasePartsDetails.belongsTo(models.Component, {
            foreignKey: 'refAssyId',
            as: 'refAssembly'
        });
        PurchasePartsDetails.belongsTo(models.RFQLineItems, {
            foreignKey: 'refBOMLineID',
            as: 'RFQ_LineItems'
        });
        PurchasePartsDetails.belongsTo(models.Component, {
            foreignKey: 'refComponentId',
            as: 'Component'
        });
        PurchasePartsDetails.belongsTo(models.MfgCodeMst, {
            foreignKey: 'distMfgCodeID',
            as: 'MfgCodeMst'
        });
    };

    return PurchasePartsDetails;
};
