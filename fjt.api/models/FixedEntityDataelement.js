const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const FixedEntityDataelement = sequelize.define('FixedEntityDataelement', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        tableName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        displayColumnPKField: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        displayColumnField: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        displayFormattedColumnField: {
            type: Sequelize.TEXT,
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
        filter: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        displayEntityName: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
        {
            paranoid: true,
            tableName: 'fixed_entity_dataelement'
        });
    return FixedEntityDataelement;
};