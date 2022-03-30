const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkOrderCoOwner = sequelize.define('WorkOrderCoOwner', {
        coOwnerID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: true
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
    }, {
        tableName: 'Workorder_coowner',
        paranoid: true
    });

    WorkOrderCoOwner.associate = (models) => {
        WorkOrderCoOwner.belongsTo(models.Workorder, {
            foreignKey: 'woID',
            as: 'workorder'
        });
        WorkOrderCoOwner.belongsTo(models.Employee, {
            foreignKey: 'employeeID',
            as: 'employee'
        });
    };

    return WorkOrderCoOwner;
};
