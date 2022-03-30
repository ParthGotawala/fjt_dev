const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const UserAgreement = sequelize.define('UserAgreement', {
        userAgreementID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        userID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        agreementID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        signaturevalue: {
            allowNull: false,
            type: Sequelize.TEXT
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
            tableName: 'user_agreement',
            paranoid: true
        });

    UserAgreement.associate = (models) => {
        UserAgreement.hasMany(models.User, {
            foreignKey: 'userID',
            as: 'users_Agreement'
        });
    };

    return UserAgreement;
};
