const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Identity = sequelize.define('Identity', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        prefix: {
            type: Sequelize.STRING,
            allowNull: true
        },
        maxValue: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        remark: {
            type: Sequelize.TEXT,
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
        },
        numberLength: {
            type: Sequelize.INTEGER
        }
    }, {
        paranoid: true,
        tableName: 'identity'
    });
    return Identity;
};
