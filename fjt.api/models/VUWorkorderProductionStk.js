const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const VUWorkorderProductionStk = sequelize.define('VUWorkorderProductionStk', {
        woID: {
            type: Sequelize.INTEGER
        },
        opID: {
            type: Sequelize.INTEGER
        },
        woOPID: {
            type: Sequelize.INTEGER
        },
        opNumber: {
            type: Sequelize.INTEGER
            // get() { return COMMON.CONVERTTHREEDECIMAL(this.getDataValue('opNumber')); },
        },
        opName: {
            type: Sequelize.STRING
        },
        opStatus: {
            type: Sequelize.INTEGER
        },
        processTime: {
            type: Sequelize.INTEGER
        },
        Setuptime: {
            type: Sequelize.INTEGER
        },
        perPieceTime: {
            type: Sequelize.INTEGER
        },
        qtyControl: {
            type: Sequelize.BOOLEAN
        },
        isIssueQty: {
            type: Sequelize.BOOLEAN
        },
        isRework: {
            type: Sequelize.BOOLEAN
        },
        isTeamOperation: {
            type: Sequelize.BOOLEAN
        },
        isStopOperation: {
            type: Sequelize.BOOLEAN
        },
        operationTypeID: {
            type: Sequelize.INTEGER
        },
        IssueQty: {
            type: Sequelize.DECIMAL
        },
        RecCnt: {
            type: Sequelize.DECIMAL
        },
        OPProdQty: {
            type: Sequelize.DECIMAL
        },
        StockQty: {
            type: Sequelize.DECIMAL
        },
        productionQty: {
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
        TerminatedTransQty: {
            type: Sequelize.DECIMAL
        },
        ShippedQty: {
            type: Sequelize.DECIMAL
        },
        ReadyForShippQty: {
            type: Sequelize.DECIMAL
        },
        boardWithMissingPartsQty: {
            type: Sequelize.DECIMAL
        },
        bypassQty: {
            type: Sequelize.DECIMAL
        }
    }, {
            paranoid: false,
            tableName: 'vu_workorder_production_stk'
        });
    return VUWorkorderProductionStk;
};