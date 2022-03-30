const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQLineitemsApprovalComment = sequelize.define('RFQLineitemsApprovalComment', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rfqLineItemsAlternatePartID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        comment: {
            type: Sequelize.STRING,
            allowNull: false
        },
        approvalBy: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        approvalDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        mfgCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mfgPN: {
            type: Sequelize.STRING,
            allowNull: true
        },
        /* A = Add
           U = Update
           D = Delete
        */
        approvalType: {
            type: Sequelize.STRING,
            allowNull: true
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
        rfqLineItemsID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        errorCode: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        requiredToShowOnQuoteSummary: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isCustomerApproved: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'rfq_lineitems_approval_comment'
    });

    RFQLineitemsApprovalComment.associate = (models) => {
        RFQLineitemsApprovalComment.belongsTo(models.RFQLineitemsAlternatepart, {
            as: 'rfqLineitemsAlternatepart',
            foreignKey: 'rfqLineItemsAlternatePartID'
        });

        RFQLineitemsApprovalComment.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'approvalBy'
        });

        RFQLineitemsApprovalComment.belongsTo(models.RFQLineItems, {
            as: 'rfqLineitems',
            foreignKey: 'rfqLineItemsID'
        });
    };

    return RFQLineitemsApprovalComment;
};
