const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentAttributesSourceMapping = sequelize.define('ComponentAttributesSourceMapping', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refAliasID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        mfgCodeID: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    },
        {
            tableName: 'component_attributes_source_mapping',
            paranoid: true
        });

    ComponentAttributesSourceMapping.associate = (models) => {
        ComponentAttributesSourceMapping.belongsTo(models.ComponentFieldsGenericaliasMst, {
            foreignKey: 'refAliasID',
            as: 'componentFieldsGenericaliasMst'
        });
        ComponentAttributesSourceMapping.belongsTo(models.MfgCodeMst, {
            foreignKey: 'mfgCodeID',
            as: 'mfgCodeMst'
        });
    };

    return ComponentAttributesSourceMapping;
};
