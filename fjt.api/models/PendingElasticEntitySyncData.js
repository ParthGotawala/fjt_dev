const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PendingElasticEntitySyncData = sequelize.define('PendingElasticEntitySyncData', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        entityID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        entityParamDet: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
        {
            tableName: 'pending_elastic_entity_sync_data',
            paranoid: false,
            timestamps: false
        });

    return PendingElasticEntitySyncData;
};
