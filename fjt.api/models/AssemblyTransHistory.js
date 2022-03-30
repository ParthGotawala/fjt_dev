const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const AssemblyTransHistory = sequelize.define('AssemblyTransHistory', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refTransID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        transactionType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        activityType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        checkinTime: {
            type: Sequelize.DATE,
            allowNull: false
        },
        checkoutTime: {
            type: Sequelize.DATE,
            allowNull: false
        },
        userID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        totalTime: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        burdenRate: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        paymentMode: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 10]
            }
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
            allowNull: false
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
        tableName: 'assembly_trans_history',
        paranoid: true
    });

    AssemblyTransHistory.associate = (models) => {
        AssemblyTransHistory.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userID'
        });
    };
    return AssemblyTransHistory;
};