const OPERATION_DATAELEMENT = Object.freeze({
    NOT_FOUND: 'Operation data field not Found.',
    CREATED: 'Operation data field created successfully.',
    NOT_CREATED: 'Operation data field could not be created',
    UPDATED: 'Operation data field updated successfully.',
    NOT_UPDATED: 'Operation data field could not be updated.',
    DELETED: 'Operation data field deleted successfully.',
    NOT_DELETED: 'Operation data field could not be deleted.',

    DATAELEMENT_ADDED_TO_OPERATION: 'Data field added to operation',
    DATAELEMENT_NOT_ADDED_TO_OPERATION: 'Data field could not be added to operation',
    DATAELEMENT_DELETED_FROM_OPERATION: 'Data field removed from operation',
    DATAELEMENT_NOT_DELETED_FROM_OPERATION: 'Data field could not be removed from operation',
    DATAELEMENT_ORDER_UPDATED:'Order of data field updated.'
});

module.exports = OPERATION_DATAELEMENT;
