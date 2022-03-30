const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const UsersRoles = sequelize.define('UsersRoles', {

        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        roleId: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        }
    },
        {
            tableName: 'users_roles',
            paranoid: true
        });

    UsersRoles.associate = (models) => {
        UsersRoles.belongsTo(models.Role, {
            as: 'role',
            foreignKey: 'roleId'
        });
        UsersRoles.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId'
        });
    };

    UsersRoles.removeAttribute('id');
    return UsersRoles;
};