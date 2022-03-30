const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const StandardRole = sequelize.define('StandardRole', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        roleID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        standardID: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    },
        {
            paranoid: true,
            tableName: 'standard_role'
        });

    StandardRole.associate = (models) => {
        StandardRole.belongsTo(models.CertificateStandards, {
            as: 'certificateStandardRole',
            foreignKey: 'standardID'
        });
        StandardRole.belongsTo(models.Role, {
            as: 'role',
            foreignKey: 'roleID'
        });
    };

    return StandardRole;
};