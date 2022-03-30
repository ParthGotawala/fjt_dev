const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const AssemblyRevisionComments = sequelize.define('AssemblyRevisionComments', {
        commentId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        commentBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        comment: {
            type: Sequelize.STRING,
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
        partID: {
            type: Sequelize.INTEGER,
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
    },
        {
            tableName: 'assembly_revision_comments',
            paranoid: true
        });

    AssemblyRevisionComments.associate = (models) => {
        AssemblyRevisionComments.belongsTo(models.Component, {
            foreignKey: 'partID',
            as: 'FK_partID'
        });
        AssemblyRevisionComments.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'createdBy'
        });
    };

    return AssemblyRevisionComments;
};
