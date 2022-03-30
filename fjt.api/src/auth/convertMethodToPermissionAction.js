module.exports = (method) => {
	switch (method) {
		case 'GET':
			return 'read';
		case 'POST':
			return 'create';
		case 'PUT':
		case 'PATCH':
			return 'update';
		case 'DELETE':
			return 'delete';

		default:
			return 'unknown';
	}
};
