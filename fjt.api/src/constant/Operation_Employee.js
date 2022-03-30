const OPERATION_EMPLOYEE = Object.freeze({
	NOT_FOUND: 'Operation personnel not Found.',
	CREATED: 'Operation personnel created successfully.',
	NOT_CREATED: 'Operation personnel could not be created',
	UPDATED: 'Operation personnel updated successfully.',
	NOT_UPDATED: 'Operation personnel could not be updated.',
	DELETED: 'Operation personnel deleted successfully.',
	NOT_DELETED: 'Operation personnel could not be deleted.',

	EMPLOYEE_ADDED_TO_OPERATION: 'Personnel added to operation',
	EMPLOYEE_NOT_ADDED_TO_OPERATION: 'Personnel could not be added to operation',
	EMPLOYEE_DELETED_FROM_OPERATION: 'Personnel removed from operation',
	EMPLOYEE_NOT_DELETED_FROM_OPERATION: 'Personnel could not be removed from operation',
});

module.exports = OPERATION_EMPLOYEE;
