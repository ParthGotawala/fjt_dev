///* eslint-disable import/no-dynamic-require, import/no-unresolved */
//const env = process.env.NODE_ENV || 'development';
//const express = require('express');
//const bodyParser = require('body-parser');
//const chalk = require('chalk');
//const methodOverride = require('method-override');
//const path = require('path');
//const morgan = require('morgan');
//const models = require('../../models');
//const config = require('../app_config');
//const cors = require('cors');

//const app = express();

//app.use(cors());
//// parse application/json
//app.use(bodyParser.json());

//// Enable logger (morgan)
//app.use(morgan('dev'));

//// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
//app.use(methodOverride('X-HTTP-Method-Override'));
//app.use((req, res, next) => {
//    res.header('Access-Control-Allow-Origin', '*');
//    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//    next();
//});

//app.set('view engine', 'ejs');

//// local variables to the app
//app.locals.models = models;
//app.locals.config = config;

//// backend routes ==================================================
//// only listen to backend routes for production as front end will be handled by nginx
//console.log(__dirname);
//app.use(express.static(__dirname));
//require(path.resolve(config.ROUTES))(app); // configure our routes


//function connectToDb() {
//    models
//		.sequelize
//		.authenticate()
//		.then(() => {
//		    /* eslint-disable */
//		    console.log('Connection has been established successfully.');
//		    //process.env.PORT
//		    app.listen(config.PORT, () => {
//		        console.log('-----------------------------');
//		        console.log(chalk.green(config.APP.TITLE));
//		        console.log(chalk.green('Environment:\t' + env));
//		        console.log(chalk.green('Port:\t\t' + config.PORT));
//		        console.log(chalk.green('App version:\t' + config.APP.VERSION));
//		        console.log('-----------------------------');
//		    });
//		    /* eslint-enable */
//		})
//		.catch(() => {
//		    console.error(chalk.red('Connection could not be established to database.'));
//		    console.error(chalk.red('Retrtying to connect in 5 sec.'));
//		    setTimeout(() => connectToDb(), 5000);
//		});
//}

//module.exports.start = () => {
//    connectToDb();
//};
