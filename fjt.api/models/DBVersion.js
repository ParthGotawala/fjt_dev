const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const DBVersion = sequelize.define('DBVersion', {
        buildNumber: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        schemaVersion: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 10]
            }
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        releaseName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
        {
            // paranoid: true,
            tableName: 'dbversion'
        });
    return DBVersion;
};