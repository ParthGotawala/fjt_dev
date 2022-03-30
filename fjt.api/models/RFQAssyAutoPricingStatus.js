const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssyAutoPricingStatus = sequelize.define('RFQAssyAutoPricingStatus', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rfqAssyID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        pricingApiName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: true

        },
        msg: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        errorMsg: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        userID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        statusChangeDate: {
            type: Sequelize.DATE,
            allowNull: false
        },
        isPurchaseApi: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        pricingSupplierID: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
        timestamps: false,
        tableName: 'rfq_assy_autopricingstatus'
    });
    return RFQAssyAutoPricingStatus;
};
