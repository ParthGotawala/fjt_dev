const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssyStandardClassDetail = sequelize.define('RFQAssyStandardClassDetail', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        standardID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        standardClassIDs: {
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
        refSubmittedQuoteID: {
            allowNull: true,
            type: Sequelize.INTEGER
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
        tableName: 'rfq_assy_standard_class_detail'
    });

    RFQAssyStandardClassDetail.associate = (models) => {
        RFQAssyStandardClassDetail.belongsTo(models.CertificateStandards, {
            as: 'certificateStandards',
            foreignKey: 'standardID'
        });

        RFQAssyStandardClassDetail.belongsTo(models.StandardClass, {
            as: 'standardClass',
            foreignKey: 'standardClassIDs'
        });
        RFQAssyStandardClassDetail.belongsTo(models.RFQAssembliesQuotationSubmitted, {
            as: 'rfqAssySubmittedQuote',
            foreignKey: 'refSubmittedQuoteID'
        });
    };

    return RFQAssyStandardClassDetail;
};