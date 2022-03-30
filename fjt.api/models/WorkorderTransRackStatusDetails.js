const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransRackStatusDetails = sequelize.define('WorkorderTransRackStatusDetails', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woTransRackID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        status: {
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
            tableName: 'workorder_trans_rack_status_details',
            paranoid: true
        });

    WorkorderTransRackStatusDetails.associate = (models) => {
        WorkorderTransRackStatusDetails.belongsTo(models.WorkorderTransRack, {
            foreignKey: 'woTransRackID',
            as: 'workorderTransRack'
        });
    };

    return WorkorderTransRackStatusDetails;
};
