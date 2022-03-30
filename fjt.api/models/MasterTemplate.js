const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const MasterTemplate = sequelize.define('MasterTemplate', {
        masterTemplate: {
            allowNull: false,
            type: Sequelize.STRING,
            validate: {
                notEmpty: true
            }
        },
        description: {
            allowNull: true,
            type: Sequelize.STRING
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
        isMasterTemplate: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        systemGenerated: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        masterTemplateStatus: {
            allowNull: false,
            type: Sequelize.INTEGER
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
        tableName: 'master_templates'
    });

    MasterTemplate.associate = (models) => {
        // MasterTemplate.belongsToMany(models.OperationMasterTemplates, {
        // foreignKey: 'masterTemplateId',
        // through: 'operation_master_templates',
        //     as: 'operationMasterTemplates_Count',
        // });
        // MasterTemplate.belongsToMany(models.OperationMasterTemplates, {
        //    as: 'operationMasterTemplates',
        //    through: 'operation_master_templates',
        //    foreignKey: 'masterTemplateId',
        // });
        MasterTemplate.hasMany(models.OperationMasterTemplates, {
            foreignKey: 'masterTemplateId',
            as: 'operationMasterTemplates'
        });
    };

    return MasterTemplate;
};
