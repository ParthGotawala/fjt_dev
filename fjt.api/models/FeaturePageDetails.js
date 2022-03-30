const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const FeaturePageDetails = sequelize.define('FeaturePageDetails', {
        featurePageDetailID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        featureID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        pageID: {
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
        tableName: 'feature_page_details'
    });

    FeaturePageDetails.associate = (models) => {
        FeaturePageDetails.belongsTo(models.FeatureMst, {
            foreignKey: 'featureID',
            as: 'featureMst'
        });
        FeaturePageDetails.belongsTo(models.PageDetail, {
            foreignKey: 'pageID',
            as: 'pageDetail'
        });
    };

    return FeaturePageDetails;
};
