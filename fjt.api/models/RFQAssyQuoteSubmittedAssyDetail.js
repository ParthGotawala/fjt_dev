const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssyQuoteSubmittedAssyDetail = sequelize.define('RFQAssyQuoteSubmittedAssyDetail', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refSubmittedQuoteID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        rfqAssyID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        qty: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        turnTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        turnType: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 1]
            }
        },
        materialCost: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: false
        },
        materialLeadTime: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: false
        },
        laborCost: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: false
        },
        laborLeadTime: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: false
        },
        additionalCost: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: false
        },
        customItemLeadTime: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: false
        },
        unitPrice: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: false
        },
        totalLeadTime: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: false
        },
        extendedCost: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: false
        },
        excessMaterialCost: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: false
        },
        additionalCostDetail: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: false
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
        },
        allCost: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: false
        },
        allDays: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        paranoid: true,
        tableName: 'rfq_assy_quote_submitted_assyDetail'
    });

    RFQAssyQuoteSubmittedAssyDetail.associate = (models) => {
        RFQAssyQuoteSubmittedAssyDetail.belongsTo(models.ECOTypeCategory, {
            as: 'termsAndConditionCategory',
            foreignKey: 'termsconditionCatID'
        });
        RFQAssyQuoteSubmittedAssyDetail.belongsTo(models.ECOTypeValues, {
            as: 'termsAndConditionTypeValues',
            foreignKey: 'termsconditionTypeValueID'
        });
        RFQAssyQuoteSubmittedAssyDetail.belongsTo(models.RFQAssembliesQuotationSubmitted, {
            as: 'rfqAssyQuoteSubmitted',
            foreignKey: 'RefSubmittedQuoteID'
        });
    };

    return RFQAssyQuoteSubmittedAssyDetail;
};