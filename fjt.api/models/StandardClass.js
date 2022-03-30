const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const StandardClass = sequelize.define('StandardClass', {
        classID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        certificateStandardID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        className: {
            type: Sequelize.STRING,
            allowNull: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isActive: {
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
        },
        colorCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        displayOrder: {
            type: Sequelize.DECIMAL(6, 2),
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
            indexes: [{
                unique: true,
                fields: ['certificateStandardID']
            }],
            tableName: 'standard_class'
        });

    StandardClass.associate = (models) => {
        StandardClass.hasMany(models.ComponentStandardDetails, {
            as: 'Standardclass',
            foreignKey: 'ClassID'
        });
        StandardClass.hasMany(models.WorkorderCertification, {
            as: 'workorder_Certification',
            foreignKey: 'classIDs'
        });
        StandardClass.hasMany(models.RFQAssyStandardClassDetail, {
            as: 'RFQAssyStandardClassDetail',
            foreignKey: 'standardClassIDs'
        });
    };


    return StandardClass;
};