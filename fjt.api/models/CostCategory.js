const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const CostCategory = sequelize.define('CostCategory', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        categoryName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        from: {
            type: Sequelize.DECIMAL(18, 6),
            allowNull: false
        },
        to: {
            type: Sequelize.DECIMAL(18, 6),
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
        description: {
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
            paranoid: true,
            tableName: 'cost_category'
        });

    CostCategory.associate = () => {
        // CostCategory.hasMany(models.ComponentSidStock, {
        //     as:'componentSidStock',
        //     foreignKey: 'priceCategoryID'
        // });
    };

    return CostCategory;
};