const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQErrorCodeCategoryMapping = sequelize.define('RFQErrorCodeCategoryMapping', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        errorCodeId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        categoryID: {
            type: Sequelize.INTEGER,
            allowNull: false
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
            tableName: 'rfq_error_code_category_mapping',
            paranoid: true
        }
    );

    RFQErrorCodeCategoryMapping.associate = (models) => {
        RFQErrorCodeCategoryMapping.belongsTo(models.RFQLineitemsErrorcode, {
            as: 'rfqLineitemsErrorcode',
            foreignKey: 'errorCodeId'
        });
        RFQErrorCodeCategoryMapping.belongsTo(models.RFQErrorCodeCategorymst, {
            as: 'rfqErrorCodeCategorymst',
            foreignKey: 'categoryID'
        });
    };


    return RFQErrorCodeCategoryMapping;
};