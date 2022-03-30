const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentAlternatePNValidations = sequelize.define('ComponentAlternatePNValidations', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refRfqPartTypeId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        fieldNameToValidate: {
            type: Sequelize.STRING,
            allowNull: false
        },
        fieldDataType: {
            type: Sequelize.STRING,
            allowNull: false
        },
        matchCriteria: {
            type: Sequelize.STRING,
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
        },
        type: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        fieldTitle: {
            type: Sequelize.STRING,
            allowNull: false
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
        tableName: 'component_alternatepn_validations'
    });

    ComponentAlternatePNValidations.associate = (models) => {
        ComponentAlternatePNValidations.belongsTo(models.RFQPartType, {
            as: 'rfq_parttypemst',
            foreignKey: 'refRfqPartTypeId'
        });
    };

    return ComponentAlternatePNValidations;
};