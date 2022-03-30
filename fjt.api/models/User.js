/* eslint-disable global-require */
const jwt = require('jsonwebtoken'); // eslint-disable-line import/no-unresolved
const bcrypt = require('bcryptjs'); // eslint-disable-line import/no-unresolved
const Sequelize = require('sequelize');
const config = require('../config/app_config');
const { NotMatchingPassword } = require('../src/errors');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        username: {
            unique: true,
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        password: {
            type: Sequelize.VIRTUAL,
            validate: {
                notEmpty: true
            }
        },
        passwordConfirmation: {
            type: Sequelize.VIRTUAL,
            validate: {
                notEmpty: true
            }
        },
        passwordDigest: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: true
            }
        },
        emailAddress: {
            unique: true,
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                // notEmpty: false,
                len: [0, 50]
            }
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        onlineStatus: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 1]
            }
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
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        forGotPasswordToken: {
            type: Sequelize.UUID,
            allowNull: true
        },
        tokenGenerationDateTime: {
            type: Sequelize.DATE,
            allowNull: true
        },
        printerID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        defaultLoginRoleID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        IdentityUserId: {
            type: Sequelize.STRING,
            allowNull: true
        },

    }, {
        freezeTableName: true,
        indexes: [{
            unique: true,
            fields: ['username']
        }],
        tableName: 'users',
        paranoid: true
    });

    User.associate = (models) => {
        User.belongsToMany(models.Role, {
            as: 'roles',
            foreignKey: 'userId',
            through: models.UsersRoles
        });

        User.hasMany(models.GroupParticipantDetails, {
            foreignKey: 'participantID',
            as: 'groupParticipantDetails'
        });
        User.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'employeeID'
        });
        User.hasMany(models.UserAgreement, {
            as: 'user_agreement',
            foreignKey: 'userID'
        });
        User.hasMany(models.UsersRoles, {
            as: 'users_roles',
            foreignKey: 'userId'
        });
        User.hasMany(models.UserPageDetail, {
            as: 'users_page',
            foreignKey: 'userID'
        });
        User.hasMany(models.FeatureUserMapping, {
            as: 'user',
            foreignKey: 'userID' // change from user to user user by jay solanki
        });
        User.hasMany(models.ComponentBOMSetting, {
            as: 'componentBOMSetting',
            foreignKey: 'activityStartBy'
        });
        User.hasMany(models.RFQAssemblies, {
            as: 'RFQAssemblies',
            foreignKey: 'activityStartBy'
        });
        User.hasMany(models.UserConfiguration, {
            as: 'userConfiguration',
            foreignKey: 'userID'
        });
        User.hasMany(models.PackingSlipMaterialReceive, {
            as: 'packingSlipMaterialReceive',
            foreignKey: 'lockedBy'
        });
    };

    User.prototype.authenticate = function (value) { // eslint-disable-line object-shorthand, func-names
        return new Promise((resolve, reject) => (
            bcrypt.compare(value, this.passwordDigest, (err, resp) => {
                if (err) {
                    console.trace();
                    console.error(err);
                    reject(err);
                }
                if (!resp) {
                    reject(new NotMatchingPassword('Password does not match.'));
                }
                resolve();
            })
        ));
    };

    User.prototype.generateToken = function () { // eslint-disable-line object-shorthand, func-names
        return new Promise((resolve, reject) => {
            jwt.sign({
                id: this.id,
                username: this.username
            }, config.jwt.secret, {
                // 8 hours * 60 * 8
                // expiresIn: 60 * 60 * 8,
            }, (err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            });
        });
    };
    User.addHook('beforeFind', (options) => {
        // https://github.com/sequelize/sequelize/issues/4925
        // does not allow objects yet:(
        if (!options.attributes) {
            options.attributes = ['id', 'username', 'emailAddress', 'firstName', 'lastName', 'deletedAt', 'isDeleted', 'employeeID', 'printerID', 'defaultLoginRoleID', 'IdentityUserId'];
        }
        if (options.include) {
            options.include.forEach((includeModel) => {
                if (!includeModel.attributes) {
                    // if (includeModel.model.name === 'Permission') {
                    //     includeModel.attributes = ['id', 'name'];
                    // }
                    if (includeModel.model.name === 'Role') {
                        includeModel.attributes = ['id', 'name', 'slug'];
                    }
                }
            });
        }
    });

    return User;
};
