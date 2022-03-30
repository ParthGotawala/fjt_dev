const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const VUWorkorderReadyassyStk = sequelize.define('VUWorkorderReadyassyStk', {
        opID: {
            type: Sequelize.INTEGER
        },
        woOPID: {
            type: Sequelize.INTEGER
        },
        woID: {
            type: Sequelize.INTEGER
        },
        woNumber: {
            type: Sequelize.STRING
        },
        partID: {
            type: Sequelize.INTEGER
        },
        buildQty: {
            type: Sequelize.INTEGER
        },
        woStatus: {
            type: Sequelize.INTEGER
        },
        woVersion: {
            type: Sequelize.STRING
        },
        isDeleted: {
            type: Sequelize.BOOLEAN
        },
        StockQty: {
            type: Sequelize.DECIMAL
        },
        PassQty: {
            type: Sequelize.DECIMAL
        },
        reprocessQty: {
            type: Sequelize.DECIMAL
        },
        observedQty: {
            type: Sequelize.DECIMAL
        },
        reworkQty: {
            type: Sequelize.DECIMAL
        },
        scrapQty: {
            type: Sequelize.DECIMAL
        },
        boardWithMissingPartsQty: {
            type: Sequelize.DECIMAL
        },
        bypassQty: {
            type: Sequelize.DECIMAL
        },
        TerminatedTransQty: {
            type: Sequelize.DECIMAL
        },
        ShippedQty: {
            type: Sequelize.DECIMAL
        },
        inHouseStockQty: {
            type: Sequelize.DECIMAL
        }
    }, {
            paranoid: false,
            tableName: 'vu_workorder_readyassy_stk'
        });
    return VUWorkorderReadyassyStk;
};