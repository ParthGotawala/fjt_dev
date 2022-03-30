const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const PartSubAssyRelationship = sequelize.define('PartSubAssyRelationship', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        prPerPartID: {
            type: Sequelize.STRING,
            allowNull: false
        },
        level: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        prPartLineItemID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        lineitemID: {
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
        }
    },
        {
            tableName: 'part_sub_assy_relationship',
            paranoid: true
        });

    PartSubAssyRelationship.associate = (models) => {
        PartSubAssyRelationship.belongsTo(models.Component, {
            foreignKey: 'partID',
            as: 'component'
        });
        PartSubAssyRelationship.belongsTo(models.Component, {
            foreignKey: 'prPerPartID',
            as: 'refComponent'
        });
        PartSubAssyRelationship.belongsTo(models.RFQLineItems, {
            foreignKey: 'prPartLineItemID',
            as: 'rfqlineItems'
        });
    };


    return PartSubAssyRelationship;
};
