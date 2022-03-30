(function () {
  'use strict';

  angular
    .module('app.admin.unit')
    .controller('UnitConversionController', UnitConversionController);

  function UnitConversionController($mdDialog, $q, $timeout, CORE, USER, UnitConversionFactory, DialogFactory, BaseService) {
    const vm = this;
    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
    vm.measurementTypeList = [];
    vm.unitOfMeasurementList = [];
    vm.selectedFromUnit = null;
    vm.selectedToUnit = null;
    vm.selectedIndex = null;

    // [S] Method for Measurement Type list
    function getAllMeasurementType() {
      return UnitConversionFactory.retriveConversionList().query().$promise.then((response) => {
        if (response && response.data) {
          const measurementDetailList = response.data;
          _.each(measurementDetailList, (item) => {
            const measurementType = {
              name: item.name,
              displayOrder: item.displayOrder,
              id: item.id,
              unitOfMeasurement: []
            };

            if (item.unitMeasurement.length > 0) {
              _.each(item.unitMeasurement, (uom) => {
                measurementType.unitOfMeasurement.push(uom);
              });
            }
            vm.measurementTypeList.push(measurementType);
          });
          if (vm.measurementTypeList.length > 0) {
            vm.categoryChanged(vm.measurementTypeList[0], 0);
          }
        }
        else {
          vm.measurementTypeList = [];
        }
      }).catch((error) => BaseService.getErrorLog(error));
    };

    function getAllMeasurementTypeByID() {
      return UnitConversionFactory.retriveConversionList().query({ id: vm.selectedUnitID }).$promise.then((response) => {
        if (response && response.data) {
          const measurementType = vm.measurementTypeList.find((x) => x.id === vm.selectedUnitID);

          if (measurementType) {
            measurementType.unitOfMeasurement = [];
            _.each(response.data[0].unitMeasurement, (uom) => {
              measurementType.unitOfMeasurement.push(uom);
            });

            vm.unitOfMeasurementList = measurementType.unitOfMeasurement;
          }
        }
        return vm.measurementTypeList;
      }).catch((error) => BaseService.getErrorLog(error));
    };

    // [E] Method for Measurement Type list

    getAllMeasurementType();

    const initAutoComplete = () => {
      vm.autoCompleteFromUnit = {
        columnName: 'unitName',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'FromUnit',
        placeholderName: 'From Unit',
        isRequired: true,
        isAddnew: false,
        callbackFn: getAllMeasurementTypeByID,
        onSelectCallbackFn: fromUnitChanged
      };

      vm.autoCompleteToUnit = {
        columnName: 'unitName',
        keyColumnName: 'id',
        keyColumnId: null,
        inputName: 'ToUnit',
        placeholderName: 'To Unit',
        isRequired: true,
        isAddnew: false,
        callbackFn: getAllMeasurementTypeByID,
        onSelectCallbackFn: toUnitChanged
      };
    };

    initAutoComplete();

    vm.categoryChanged = (measurementType, index) => {
      vm.unitOfMeasurementList = [];
      vm.autoCompleteFromUnit.keyColumnId = null;
      vm.autoCompleteToUnit.keyColumnId = null;
      vm.selectedFromUnit = null;
      vm.selectedToUnit = null;

      vm.selectedIndex = index;
      vm.selectedUnitID = measurementType.id;
      vm.selectedUnit = measurementType.name;

      vm.unitOfMeasurementList = measurementType.unitOfMeasurement;

      if (vm.unitOfMeasurementList.length >= 2) {
        vm.autoCompleteFromUnit.keyColumnId = vm.unitOfMeasurementList[0].id;
        vm.autoCompleteToUnit.keyColumnId = vm.unitOfMeasurementList[1].id;
        vm.selectedFromUnit = vm.unitOfMeasurementList[0];
        vm.selectedToUnit = vm.unitOfMeasurementList[1];
      }
      else if (vm.unitOfMeasurementList.length === 1) {
        vm.autoCompleteFromUnit.keyColumnId = vm.unitOfMeasurementList[0].id;
        vm.autoCompleteToUnit.keyColumnId = vm.unitOfMeasurementList[0].id;
        vm.selectedFromUnit = vm.selectedToUnit = vm.unitOfMeasurementList[0];
      }

      vm.fromValue = 1;
      vm.fromValueChanged();
      if (vm.UnitConversion) {
        vm.UnitConversion.$setPristine();
        vm.UnitConversion.$setUntouched();
      }
    };

    vm.fromValueChanged = () => {
      const value = Number(vm.fromValue);
      if (!vm.fromValue || isNaN(value) || !vm.selectedFromUnit || !vm.selectedToUnit) {
        vm.toValue = null;
        return;
      };

      const result = getUnitConversion(vm.selectedFromUnit, vm.selectedToUnit, value);
      vm.toValue = result;
    };

    function fromUnitChanged(item) {
      vm.selectedFromUnit = item;
      vm.fromValueChanged();
    }

    vm.toValueChanged = () => {
      const value = Number(vm.toValue);
      if (!vm.toValue || isNaN(value) || !vm.selectedFromUnit || !vm.selectedToUnit) {
        vm.fromValue = null;
        return;
      };

      const result = getUnitConversion(vm.selectedToUnit, vm.selectedFromUnit, value);
      vm.fromValue = result ? result : vm.fromValue;
    };

    function toUnitChanged(item) {
      vm.selectedToUnit = item;
      vm.toValueChanged();
    }
    function getUnitConversion(fromUnit, toUnit, value) {
      if (fromUnit === toUnit) {
        return value.toFixed(3);
      }

      if (fromUnit.isFormula) {
        const unitDetailFormula = _.find(fromUnit.unit_detail_formula, (item) => item.toUnitID === toUnit.id);
        if (unitDetailFormula) {
          const formula = unitDetailFormula.formula.replace(/X/g, value);
          Number(formula);
          const result = eval(formula);
          return parseFloat(result.toFixed(5));
        }
      }
      else {
        const fromBasedUnitValues = fromUnit.baseUnitConvertValue;
        const toBasedUnitValues = toUnit.baseUnitConvertValue;
        const ConvertFromValueIntoBasedValue = ((value *10)  / (fromBasedUnitValues * 10));
        let result = (ConvertFromValueIntoBasedValue * toBasedUnitValues * 10)/10;
        if (isNaN(result)) {
          result = 0;
        }
        return parseFloat(result.toFixed(5));
      }
    }

    vm.goToUnitList = () => {
      BaseService.openInNew(USER.ADMIN_UNIT_STATE, {});
    };
  }
})();
