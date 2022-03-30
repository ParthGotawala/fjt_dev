const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const FeatureUserMapping = sequelize.define('FeatureUserMapping', {
        featureUserMappingID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        featureID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        userID: {
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
        },
        roleID: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        paranoid: true,
        tableName: 'feature_user_mapping'
    });

    FeatureUserMapping.associate = (models) => {
        FeatureUserMapping.belongsTo(models.FeatureMst, {
            foreignKey: 'featureID',
            as: 'featureMst'
        });
        FeatureUserMapping.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userID'
        });
        FeatureUserMapping.belongsTo(models.Role, {
            as: 'FeatureUserMappingRoles',
            foreignKey: 'roleID'
        }); 
    };

    return FeatureUserMapping;
};
