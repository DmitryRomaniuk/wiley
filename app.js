var saveList;
if (localStorage.saveListTest) { saveList = angular.fromJson(localStorage.saveListTest); }
else {
    saveList = {
        items: [
            { titleTask: "Хлеб", done: false, explanation: "2 батона" },
            { titleTask: "Масло", done: false, explanation: "3 пачки" },
            { titleTask: "Картофель", done: true, explanation: "1 мешок" },
            { titleTask: "Сыр", done: false, explanation: "400г" }
        ]
    };
}
var titleTaskApp = angular.module("titleTaskApp", []);
titleTaskApp.controller("titleTaskController", function ($scope) {
    $scope.list = saveList;
    $scope.saveInLocalStorage = function () { localStorage.saveListTest = angular.toJson($scope.list); };
    $scope.eraseElem = function (hashKey) {
        angular.forEach($scope.list.items, function (value, key) {
            if (value.$$hashKey === hashKey.$$hashKey) {
                $scope.list.items.splice(key, 1);
                localStorage.saveListTest = angular.toJson($scope.list);
            }
        });
    };

    $scope.addItem = function (text, explanation) {
        if (text != "" && explanation != "") {
            $scope.list.items.push({ titleTask: text, explanation: explanation, done: false });
            localStorage.saveListTest = angular.toJson($scope.list);
        }
    };


    $scope.updateTodo = function (value) {
        console.log('Saving title ' + value);
        localStorage.saveListTest = angular.toJson($scope.list);
    };

    $scope.cancelEdit = function (value) {
        console.log('Canceled editing', value);
    };

});
// On esc event
titleTaskApp.directive('onEsc', function () {
    return function (scope, elm, attr) {
        elm.bind('keydown', function (e) {
            if (e.keyCode === 27) {
                scope.$apply(attr.onEsc);
            }
        });
    };
});

// On enter event
titleTaskApp.directive('onEnter', function () {
    return function (scope, elm, attr) {
        elm.bind('keypress', function (e) {
            if (e.keyCode === 13) {
                scope.$apply(attr.onEnter);
            }
        });
    };
});

// Inline edit directive
titleTaskApp.directive('inlineEdit', function ($timeout) {
    return {
        scope: {
            model: '=inlineEdit',
            handleSave: '&onSave',
            handleCancel: '&onCancel'
        },
        link: function (scope, elm, attr) {
            var previousValue;

            scope.edit = function () {
                scope.editMode = true;
                previousValue = scope.model;

                $timeout(function () {
                    elm.find('input')[0].focus();
                }, 0, false);
            };
            scope.save = function () {
                scope.editMode = false;
                scope.handleSave({ value: scope.model });
            };
            scope.cancel = function () {
                scope.editMode = false;
                scope.model = previousValue;
                scope.handleCancel({ value: scope.model });
            };
        },
        templateUrl: 'inline-edit.html'
    };
});

