const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssyQuotationsCustomparts = sequelize.define('RFQAssyQuotationsCustomparts', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rfqAssyQuoteId: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        mfgPNID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        unitPrice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        totalPrice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        leadTimeDays: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        totalLeadTimeDays: {
            allowNull: true,
            type: Sequelize.INTEGER
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
        tableName: 'rfq_assy_quotations_customparts'
    });

    RFQAssyQuotationsCustomparts.associate = (models) => {
        RFQAssyQuotationsCustomparts.belongsTo(models.RFQAssyQuotations, {
            as: 'rfqAssyQuotations',
            foreignKey: 'rfqAssyQuoteID'
        });
        RFQAssyQuotationsCustomparts.belongsTo(models.Component, {
            as: 'customParts',
            foreignKey: 'mfgPNID'
        });
        RFQAssyQuotationsCustomparts.hasMany(models.RFQAssyQuotationsAdditionalCost, {
            as: 'rfqAssyQuotationsAdditionalCost',
            foreignKey: 'refCustomPartQuoteID'
        });
    };

    return RFQAssyQuotationsCustomparts;
};