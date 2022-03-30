const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransactionUMIDDetails = sequelize.define('WorkorderTransactionUMIDDetails', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        woTransID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        eqpFeederID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refsidid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        mfgPNID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woOpEqpID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woOPID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        assyQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        UOM: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        reelStatus: {
            type: Sequelize.STRING,
            allowNull: true
        },
        changedBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        changedOn: {
            type: Sequelize.DATE,
            allowNull: false
        },
        isVerified: {
            type: Sequelize.STRING,
            allowNull: true
        },
        verifiedBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        verifiedOn: {
            type: Sequelize.DATE,
            allowNull: false
        },
        rfqLineItemsID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        toRefUIDId: {
            type: Sequelize.INTEGER,
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
        refDesig: {
            type: Sequelize.STRING,
            allowNull: true
        },
        approvedBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        approvedOn: {
            type: Sequelize.DATE,
            allowNull: true
        },
        approvedReason: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'workorder_trans_umid_details'
    });
    return WorkorderTransactionUMIDDetails;
};
