const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const NotificationMst = sequelize.define('NotificationMst', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        senderID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        subject: {
            allowNull: false,
            type: Sequelize.STRING,
            validate: {
                notEmpty: true,
                len: [1, 500]
            }
        },
        message: {
            allowNull: false,
            type: Sequelize.TEXT
            // validate: {
            //    notEmpty: true,
            //    len: [1, 1000]
            // },
        },
        messageType: {
            allowNull: false,
            type: Sequelize.STRING,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        messageSubType: {
            allowNull: true,
            type: Sequelize.STRING
        },
        jsonData: {
            allowNull: true,
            type: Sequelize.TEXT
        },
        refNotificationID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        isSenderDelete: {
            allowNull: true,
            type: Sequelize.BOOLEAN
        },
        notificationDate: {
            allowNull: false,
            type: Sequelize.DATE
        },
        redirectUrl: {
            allowNull: true,
            type: Sequelize.STRING
        },
        isActive: {
            allowNull: false,
            type: Sequelize.BOOLEAN
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
        },
        refTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refTable: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'notificationmst'
    });

    NotificationMst.associate = (models) => {
        NotificationMst.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'senderID'
        });
        NotificationMst.hasMany(models.NotificationDet, {
            as: 'notificationDet',
            foreignKey: 'notificationID'
        });
    };

    return NotificationMst;
};