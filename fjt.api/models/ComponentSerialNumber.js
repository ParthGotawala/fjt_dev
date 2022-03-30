const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentSerialNumber = sequelize.define('ComponentSerialNumber', {
        mfgType: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        serialNumber: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: false
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
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
    }, {
        paranoid: true,
        tableName: 'component_serial_number'
    });
    return ComponentSerialNumber;
};