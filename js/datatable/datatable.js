/*Tree-table structure where a hierarchical tree type structure is shown in an indented table giving the impression
of a flat table structure, rows are expandable and child tables can be viewed, by default, all rows are expanded.
User needs to provide table data and table columns to the directive.

Author: Pramit Kundu
*/

var datatable = angular.module('dpdx.datatable',['ngMaterial','ngAnimate']);

datatable.directive('dpdxDatatable',['$compile',function($compile){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            tableData: '=',
            tableDef: '=',
            showHeaders: '@?',
            firstColumn: '=',
            displayTotal: '@?'
        },
        templateUrl: 'webapp/app/common/datatable/partials/datatable.html',
        link: function(scope,elem,attrs){
            scope.toggleExpandedFlag = function(row){
                row.expanded = !row.expanded;
            };
            for(key in scope.tableData){
                scope.tableData[key].expanded = true;
            }
            scope.getDisplayText = function(text){
            	var str;
                if(angular.isDefined(text)){
	            	if(text.length>10){
	                    str = text.substring(0,10) + '...';
	                }
	                else str = text;
                }
                else str = '';
                return str;
            };
        }
    };
}]);