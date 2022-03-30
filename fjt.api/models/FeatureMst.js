const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const FeatureMst = sequelize.define('FeatureMst', {
        featureID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        featureName: {
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
        tableName: 'feature_mst'
    });

    FeatureMst.associate = (models) => {
        FeatureMst.hasMany(models.FeaturePageDetails, {
            foreignKey: 'featureID',
            as: 'featurePageDetails'
        });
        FeatureMst.hasMany(models.FeatureUserMapping, {
            foreignKey: 'featureID',
            as: 'featureUserMapping'
        });
        // FeatureMst.hasMany(models.FeatureRoleMapping, {
        //     foreignKey: 'userID',
        //     as: 'featureRoleMapping',
        // });
    };

    return FeatureMst;
};
