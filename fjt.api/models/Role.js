const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Role = sequelize.define('Role', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        description: {
            type: Sequelize.STRING
        },
        slug: {
            type: Sequelize.STRING
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
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        systemGenerated: {
            type: Sequelize.BOOLEAN
            // allowNull: false
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        accessLevel: {
            type: Sequelize.DECIMAL(6, 2),
            allowNull: false
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
        indexes: [{
            unique: true,
            fields: ['name']
        }],
        tableName: 'roles'
    });

    Role.associate = (models) => {
        // Role.belongsToMany(models.User, {
        // as: 'users',
        // through: 'users_roles',
        // foreignKey: 'roleId',
        // });
        Role.hasMany(models.GenericFolder, {
            as: 'generic_folder',
            foreignKey: 'roleId'
        });
        Role.hasMany(models.WorkorderOperationDataelementRole, {
            as: 'workorder_Operation_DataElement_role',
            foreignKey: 'roleID'
        });
        Role.hasMany(models.UsersRoles, {
            as: 'users_roles',
            foreignKey: 'roleId'
        });
        Role.hasMany(models.UserPageDetail, {
            as: 'UserPageDetailRoles',
            foreignKey: 'roleID'
        });
        Role.hasMany(models.FeatureUserMapping, {
            as: 'FeatureUserMappingRoles',
            foreignKey: 'roleID'
        });
        Role.hasMany(models.StandardRole, {
            as: 'componentStandardRole',
            foreignKey: 'roleID'
        });
        // Role.belongsToMany(models.Permission, {
        // as: 'permissions',
        // through: 'roles_permissions',
        // foreignKey: 'roleId',
        // });
        // Role.belongsToMany(models.OtherPermission, {
        //     as: 'OtherPermissions',
        //     through: 'roles_other_permission',
        //     foreignKey: 'roleId',
        // });
    };

    return Role;
};
