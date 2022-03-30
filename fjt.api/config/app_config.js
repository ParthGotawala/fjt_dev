const config = {
	development: {
		APP: {
			TITLE: 'Job Tracking',
			VERSION: '1.0.0',
		},
		PORT: 2003,
		STATIC_FILES: './public/client/',
		ROUTES: './src/routes',
		FRONT: './public/client/',
		jwt: {
			secret: 'secret',
		},
	},
	test: {
		APP: {
			TITLE: 'Job Tracking',
			VERSION: '1.0.0',
		},
		PORT: 2003,
		STATIC_FILES: './dist/client/',
		ROUTES: './src/routes',
		FRONT: './dist/client/',
	},
	production: {
		APP: {
			TITLE: 'Job Tracking',
			VERSION: '1.0.0',
		},
		PORT: 80,
		STATIC_FILES: '../FlextronJobTracking/public/',
		ROUTES: '../FlextronJobTracking/src/routes',
		FRONT: '../FlextronJobTracking/public',
	},
};

module.exports = config[process.env.NODE_ENV || 'development'];
