const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const VUUMIDCreationPending = sequelize.define('VUUMIDCreationPending', {
        packingSlipID: {
            type: Sequelize.INTEGER
        },
        packagingID: {
            type: Sequelize.INTEGER
        },
        BinID: {
            type: Sequelize.INTEGER
        },
        PartId: {
            type: Sequelize.INTEGER
        },
        InQty: {
            type: Sequelize.INTEGER
        },
        UMIDCreatedQty: {
            type: Sequelize.DECIMAL
        },
        BalanceQty: {
            type: Sequelize.DECIMAL
        },
        receivedStatus: {
            type: Sequelize.STRING
        }
    }, {
        paranoid: false,
        tableName: 'vu_umid_creation_pending'
    });
    return VUUMIDCreationPending;
};