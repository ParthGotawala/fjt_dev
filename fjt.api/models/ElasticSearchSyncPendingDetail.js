const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ElasticSearchSyncPendingDetail = sequelize.define('ElasticSearchSyncPendingDetail', {
        syncid: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID
        },
        refTransactionTable: {
            allowNull: false,
            type: Sequelize.STRING
        },
        refTransactionID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isConsume: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        isError: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        errorJson: {
            type: Sequelize.STRING,
            allowNull: true
        },
        queueJsonObject: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        tableName: 'elastic_search_sync_pending_detail'
    });
    return ElasticSearchSyncPendingDetail;
};