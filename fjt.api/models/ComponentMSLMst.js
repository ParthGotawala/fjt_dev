/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentMSLMst = sequelize.define('ComponentMSLMst', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        levelRating: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        time: {
            type: Sequelize.STRING,
            allowNull: true
        },
        code: {
            type: Sequelize.STRING,
            allowNull: true
        },
        conditions: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
            paranoid: false,
            tableName: 'component_mslmst'
        });
    return ComponentMSLMst;
};
