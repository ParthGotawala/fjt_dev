const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RackmstHistoryStatusDetails = sequelize.define('RackmstHistoryStatusDetails', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rackHistoryID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        opStatus: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        }
    },
        {
            tableName: 'rackmst_history_status_details',
            paranoid: true
        });

    RackmstHistoryStatusDetails.associate = (models) => {
        RackmstHistoryStatusDetails.belongsTo(models.RackMstHistory, {
            foreignKey: 'rackHistoryID',
            as: 'rackMstHistory'
        });
    };

    return RackmstHistoryStatusDetails;
};
