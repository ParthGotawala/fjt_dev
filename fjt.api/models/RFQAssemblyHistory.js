const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssemblyHistory = sequelize.define('RFQAssemblyHistory', {

        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        tableName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        refTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rfqLineItemID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rfqAssyID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        columnName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        oldValue: {
            type: Sequelize.STRING,
            allowNull: true
        },
        newValue: {
            type: Sequelize.STRING,
            allowNull: true
        },
        changeVersion: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isShow: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        narrative: {
            type: Sequelize.STRING,
            allowNull: true
        },
        time: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    },
        {
            paranoid: false,
            tableName: 'rfq_assembly_history'
        });

    RFQAssemblyHistory.associate = (models) => {
        RFQAssemblyHistory.belongsTo(models.RFQLineItems, {
            as: 'rfqLinteitems',
            foreignKey: 'rfqLineItemID'
        });
    };

    return RFQAssemblyHistory;
};