const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssyTypeMst = sequelize.define('RFQAssyTypeMst', {
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
                len: [1, 255]
            }
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
        isPCBRequire: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        noOfSide: {
            type: Sequelize.INTEGER,
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
        },
        displayOrder: {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: true
        }
    },
        {
            tableName: 'rfq_assy_typemst',
            paranoid: true
        }
    );

    RFQAssyTypeMst.associate = (models) => {
        RFQAssyTypeMst.hasMany(models.RFQAssemblies, {
            as: 'rfqAssemblies',
            foreignKey: 'assemblyTypeID'
        });
        RFQAssyTypeMst.hasMany(models.Component, {
            as: 'component',
            foreignKey: 'assemblyType'
        });
    };

    return RFQAssyTypeMst;
};
