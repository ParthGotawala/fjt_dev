/* eslint-disable */
'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config`)[env];
var db = {};

if (config.use_env_variable) {
    var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname).filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
}).forEach(function (file) {
    //var model = sequelize['import'](path.join(__dirname, file));
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
    // const model = require(path.join(__dirname, file))(sequelize, Sequelize)
    // db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

//sequelize.addHook('beforeCreate', (model, options) => {
//    //if (model.context && model.context.user) {
//    //    model.createdBy = model.context.user.id;
//    //}
//    if (options.model.attributes.createdBy != undefined) {
//        model.dataValues.createdBy = 1;
//    }
//});

//sequelize.addHook('beforeBulkCreate', (options, callback) => {
//    options.individualHooks = true;
//    return callback(null, options);
//});


//sequelize.addHook('beforeUpdate', (model, options) => {
//    //if (options.model.attributes.updatedBy && model.context && model.context.user) {
//    //    model.dataValues.updatedBy = model.context.user.id;
//    //}
//    if (options.model.attributes.updatedBy != undefined) {
//        model.dataValues.updatedBy = 1;
//    }
//});

//sequelize.addHook('beforeBulkUpdate', (options, callback) => {
//    options.individualHooks = true;
//    return callback(null, options);
//});

//sequelize.addHook('beforeDestroy', (model, options) => {
//    //if (model.context && model.context.user) {
//    //    model.deletedBy = model.context.user.id;
//    //}
//    if (options.model.attributes.deletedBy != undefined) {
//        model.dataValues.deletedBy = 1;
//    }
//});

//sequelize.addHook('beforeBulkDestroy', (options, callback) => {
//    options.individualHooks = true;
//    return callback(null, options);
//});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
