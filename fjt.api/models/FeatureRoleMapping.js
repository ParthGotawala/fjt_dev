const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const FeatureRoleMapping = sequelize.define('FeatureRoleMapping', {
        featureRoleMappingID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        featureID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        roleID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isActive: {
            type: Sequelize.BOOLEAN,
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
        }
    }, {
        paranoid: true,
        tableName: 'feature_role_mapping'
    });

    FeatureRoleMapping.associate = (models) => {
        FeatureRoleMapping.belongsTo(models.FeatureMst, {
            foreignKey: 'featureID',
            as: 'featureMst'
        });
        FeatureRoleMapping.belongsTo(models.Role, {
            foreignKey: 'roleID',
            as: 'role'
        });        
    };

    return FeatureRoleMapping;
};
