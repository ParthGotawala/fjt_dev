const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const VUSalesorderShippedReport = sequelize.define('VUSalesorderShippedReport', {
        'Sales Order ID': {
            type: Sequelize.INTEGER
        },
        'Sales Order': {
            type: Sequelize.STRING
        },
        'Po Number': {
            type: Sequelize.STRING
        },
        'Po Date': {
            type: Sequelize.DATE
        },
        'Customer ID': {
            type: Sequelize.INTEGER
        },
        'ContactPerson ID': {
            type: Sequelize.INTEGER
        },
        'ShippingMethod ID': {
            type: Sequelize.INTEGER
        },
        'Sales Order Status': {
            type: Sequelize.INTEGER
        },
        Revision: {
            type: Sequelize.STRING
        },
        'Shipping Comment': {
            type: Sequelize.STRING
        },
        'Terms ID': {
            type: Sequelize.INTEGER
        },
        'So Date': {
            type: Sequelize.DATE
        },
        'Assy ID': {
            type: Sequelize.STRING
        },
        'Assy Name': {
            type: Sequelize.STRING
        },
        'Assy Revision': {
            type: Sequelize.STRING
        },
        'PO Qty': {
            type: Sequelize.INTEGER
        },
        'Shipped Qty': {
            type: Sequelize.INTEGER
        },
        'Company Name': {
            type: Sequelize.STRING
        },
        'Full Name': {
            type: Sequelize.STRING
        },
        'GencCategory Code': {
            type: Sequelize.STRING
        },
        'Balanced Due Qty': {
            type: Sequelize.INTEGER
        },
        Status: {
            type: Sequelize.STRING
        },
        modifyDate: {
            type: Sequelize.DATE
        },
        SalesOrderDetailId: {
            type: Sequelize.INTEGER
        },
        PartID: {
            type: Sequelize.INTEGER
        },
        NickName: {
            type: Sequelize.STRING
        }
    },
    {
        paranoid: false,
        tableName: 'vu_salesorder_shipped_report'
    });
    return VUSalesorderShippedReport;
};