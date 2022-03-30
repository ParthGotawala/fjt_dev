const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const NotificationDet = sequelize.define('NotificationDet', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        notificationID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        receiverID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        isRead: {
            allowNull: true,
            type: Sequelize.BOOLEAN
        },
        requestStatus: {
            allowNull: true,
            type: Sequelize.STRING,
            validate: {
                len: [0, 1]
            }
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
    }, {
        paranoid: true,
        tableName: 'notificationdet'
    });

    NotificationDet.associate = (models) => {
        NotificationDet.belongsTo(models.NotificationMst, {
            as: 'notificationMst',
            foreignKey: 'notificationID'
        });
        NotificationDet.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'receiverID'
        });
    };

    return NotificationDet;
};