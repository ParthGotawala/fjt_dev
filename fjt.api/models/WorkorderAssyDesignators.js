const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderAssyDesignators = sequelize.define('WorkorderAssyDesignators', {
        wodesignatorID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        designatorName: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        createdBy: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updatedBy: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: false
        },
        deletedBy: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        defectCatid: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        noOfPin: {
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
    }, {
        paranoid: true,
        tableName: 'workorder_assy_designators'
    });

    WorkorderAssyDesignators.associate = (models) => {
        WorkorderAssyDesignators.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderAssyDesignators.belongsTo(models.DefectCategory, {
            as: 'defectCategory',
            foreignKey: 'defectCatid'
        });
        WorkorderAssyDesignators.hasMany(models.WorkorderTransAssyDefectdet, {
            as: 'workorder_trans_assy_defectdet',
            foreignKey: 'wodesignatorID'
        });
    };

    return WorkorderAssyDesignators;
};