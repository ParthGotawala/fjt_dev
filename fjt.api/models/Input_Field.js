const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const InputField = sequelize.define('InputField', {
        inputFieldID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        displayName: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        iconClass: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        dataType: {
            type: Sequelize.STRING(20),
            allowNull: true
        },
        displayOrder: {
            type: Sequelize.DECIMAL(6, 2),
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false

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
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        createByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        updateByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    },
    {
        paranoid: true,
        tableName: 'input_field'
    });
    return InputField;
};