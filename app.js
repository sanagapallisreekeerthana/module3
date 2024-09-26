(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;
        ctrl.found = [];
        ctrl.searchTerm = '';

        ctrl.narrowItDown = function () {
            if (ctrl.searchTerm) {
                MenuSearchService.getMatchedMenuItems(ctrl.searchTerm)
                    .then(function (response) {
                        ctrl.found = response;
                    });
            } else {
                ctrl.found = [];
            }
        };

        ctrl.removeItem = function (index) {
            ctrl.found.splice(index, 1);
        };
    }

    function MenuSearchService($http) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: "GET",
                url: "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json"
            }).then(function (result) {
                var foundItems = [];
                var menuItems = result.data;
                for (var key in menuItems) {
                    if (menuItems[key].description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                        foundItems.push(menuItems[key]);
                    }
                }
                return foundItems;
            });
        };
    }

    function FoundItemsDirective() {
        return {
            restrict: 'E',
            scope: {
                found: '<',
                onRemove: '&'
            },
            template: `
                <ul>
                    <li ng-repeat="item in found">
                        {{item.name}}, {{item.short_name}}, {{item.description}}
                        <button ng-click="onRemove({index: $index})">Don't want this one!</button>
                    </li>
                </ul>
            `
        };
    }
})();
