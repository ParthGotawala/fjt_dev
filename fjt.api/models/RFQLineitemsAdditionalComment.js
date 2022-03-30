const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQLineitemsAdditionalComment = sequelize.define('RFQLineitemsAdditionalComment', {

        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        lineID: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        rfqLineItemID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        rfqAssyID: {
            type: Sequelize.INTEGER,
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
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    },
        {
            paranoid: true,
            tableName: 'rfq_lineitems_additional_comment'
        });

    RFQLineitemsAdditionalComment.associate = (models) => {
        RFQLineitemsAdditionalComment.belongsTo(models.RFQLineItems, {
            as: 'rfqLinteitems',
            foreignKey: 'rfqLineItemID'
        });
        RFQLineitemsAdditionalComment.belongsTo(models.RFQAssemblies, {
            as: 'rfqAssemblies',
            foreignKey: 'rfqAssyID'
        });
        RFQLineitemsAdditionalComment.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'partID'
        });
    };


    return RFQLineitemsAdditionalComment;
};