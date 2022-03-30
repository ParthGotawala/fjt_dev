const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQLineitemsFilter = sequelize.define('RFQLineitemsFilter', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        filterCode: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: false,
                len: [0, 25]
            }
        },
        displayName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: false,
                len: [0, 250]
            }
        },
        org_description: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: false,
                len: [0, 250]
            }
        },
        displayOrder: {
            type: Sequelize.DECIMAL,
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
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isErrorFilter: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    },
        {
            tableName: 'rfq_lineitems_filter',
            paranoid: true
        }
    );
    return RFQLineitemsFilter;
};