const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderCertification = sequelize.define('WorkorderCertification', {
        woCertificationID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        certificateStandardID: {
            type: Sequelize.INTEGER,
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
        classIDs: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
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
        tableName: 'workorder_certification'
    });

    WorkorderCertification.associate = (models) => {
        WorkorderCertification.belongsTo(models.StandardClass, {
            as: 'standardsClass',
            foreignKey: 'classIDs'
        });
        WorkorderCertification.belongsTo(models.CertificateStandards, {
            as: 'certificateStandards',
            foreignKey: 'certificateStandardID'
        });
        WorkorderCertification.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
    };

    return WorkorderCertification;
};
