const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Timeline = sequelize.define('Timeline', {
        timelineID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        userID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        eventTitle: {
            type: Sequelize.STRING,
            allowNull: true
        },
        eventDescription: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refTransTable: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        refTransID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        eventType: {
            type: Sequelize.DECIMAL(6, 2),
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
        eventAction: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'timeline'
    });
    return Timeline;
};
