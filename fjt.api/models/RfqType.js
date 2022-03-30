const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQType = sequelize.define('RFQType', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                // notEmpty: false,
                len: [0, 100]
            }
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        termsandcondition: {
            type: Sequelize.TEXT,
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
            tableName: 'rfqtype',
            paranoid: true
        }
    );

    RFQType.associate = (models) => {
        RFQType.hasMany(models.RFQAssemblies, {
            foreignKey: 'RFQTypeID',
            as: 'rfqAssemblies'
        });
    };

    return RFQType;
};
