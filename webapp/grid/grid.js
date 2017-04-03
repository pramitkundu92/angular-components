/*Grid like table structure component, allows user to set table data and table columns.
Sets columns automatically if not provided. Options has to be provided for grid,
specifying pagination configuration (page size would be automatically set at first based on the dataset provided),
also allows row select and filter functionalities.

Author: Pramit Kundu
*/

var gridModule = angular.module('angular.grid',['ngMaterial','ngAnimate']);

gridModule.directive('angularGrid',['$parse',function($parse){
    return {
        restrict: 'AE',
        replace: true,
        scope: {
        	gridId: '=?',
        	tableData: '=',
        	tableDef: '=?',
        	gridOptions: '=?',
        	selectedItems: '=?',
        	onLinkClick: '&?',
        	primaryField: '@?',
        	actions: '=?'
        },
        templateUrl: 'grid/partials/grid.html',
        link: function(scope,elem,attrs){
            scope.initData = angular.copy(scope.tableData);
            scope.filterConfig = {};
            scope.pages = [];
            scope.addtlColumns = [];
            if(angular.isUndefined(scope.gridOptions)){
            	scope.gridOptions = {
        	        pagination: {
        	        	currentPage: 1,
        	            pageSize: 10,
        	            pageSizes: [10,20,50]
        	        },
        	        filters: false,
        	        initialColumnCount: 9,
        	        rowEditable: true,
        	        rowDeletetable: true,
        	        rowAddable: true,
        	        exportToExcel: true,
        	        allowRowSelect: false
        	    };
            }
            if(scope.gridOptions.allowRowSelect) {
            	scope.selectedItems = [];
            	scope.config = {};
            	scope.config.allSelected = false;
            }
            if(angular.isDefined(scope.actions) && scope.actions.length>0){
            	scope.handleAction = function(actionIndex,rowIndex,ev){
            		scope.actions[actionIndex].action.apply(null,[rowIndex,ev]);
            	}
            }
            else scope.actions = [];
            scope.setTableDef = function(){            	
            	scope.tableDef = [];
                for(key in scope.tableData[0]){
                    if(key != '$$hashKey' && key != 'selected' && key != '_id' && (angular.isUndefined(scope.primaryField) || key != scope.primaryField)){
                        var col = {
                            text: key,
                            show: true,
                            included: true
                        };
                        if(angular.isDefined(scope.gridOptions.linkColumn) && scope.gridOptions.linkColumn.name == key){
                        	col.hyperlink = true;
                        }
                        scope.tableDef.push(col);
                    }
                }
                if(scope.tableDef.length > scope.gridOptions.initialColumnCount){
                	scope.addtlColumns.length = 0;
                    for(var i=scope.gridOptions.initialColumnCount;i<scope.tableDef.length;i++){
                        scope.tableDef[i].included = false;  
                        scope.addtlColumns.push(angular.copy(scope.tableDef[i]));
                    }
                }
            };
            scope.rowClicked = function(entity,col){
            	if(angular.isDefined(scope.gridOptions.linkColumn) && scope.gridOptions.linkColumn.name == col.text){
            		scope.onLinkClick({row: entity});
            	}
            }
            scope.setupColumns = function(){
                scope.addtlColumns.length = 0;
                angular.forEach(scope.tableDef,function(col){
                    if(!col.included) scope.addtlColumns.push(angular.copy(col));
                });                
            };
            if(angular.isUndefined(scope.tableDef) || scope.tableDef.length==0){
            	scope.setTableDef();
            }
            else {
            	 scope.setupColumns();
            }
            scope.getDisplayText = function(text){
            	var str;
                if(angular.isDefined(text)){
	            	if(text.length>15){
	                    str = text.substring(0,15) + '...';
	                }
	                else str = text;
                }
                else str = '';
                return str;
            };
            scope.setPaginatedData = function(){
                scope.paginatedData = scope.tableData.slice(
                    (scope.gridOptions.pagination.currentPage-1)*scope.gridOptions.pagination.pageSize,(scope.gridOptions.pagination.currentPage)*scope.gridOptions.pagination.pageSize);
            };            
            scope.setMaxPages = function(){ 
                scope.gridOptions.pagination.maxPages = scope.tableData.length%scope.gridOptions.pagination.pageSize == 0 ? scope.tableData.length/scope.gridOptions.pagination.pageSize : Math.floor(scope.tableData.length/scope.gridOptions.pagination.pageSize) + 1;
                var m = scope.gridOptions.pagination.maxPages;
                scope.pages.length = 0;
                for(var i=1;i<=m;i++){
                	scope.pages.push(i);
                }
                scope.paging = {};
                scope.paging.step = 6;
                scope.paging.arrowsRequired = scope.pages.length > scope.paging.step;
                if(scope.paging.arrowsRequired){
                	scope.paging.start = 1;
                	scope.paging.end = scope.paging.step;
                	scope.paging.total = m;
                }
                else {
                	scope.paging.start = -1;
                	scope.paging.end = m+1;
                }
            };
            scope.moveBack = function(){
            	scope.paging.start -= scope.paging.step;
            	scope.paging.end -= scope.paging.step;
            };
            scope.moveForward = function(){
            	scope.paging.start += scope.paging.step;
            	scope.paging.end += scope.paging.step;
            };
            scope.adjustPageSize = function(){
            	if(scope.tableData.length <=100){
                	scope.gridOptions.pagination.pageSize = 10;
                }
                else if(scope.tableData.length > 100 && scope.tableData.length <= 500){
                	scope.gridOptions.pagination.pageSize = 20;
                }
                else {
                	scope.gridOptions.pagination.pageSize = 50;
                }
            };
            scope.addedColumns = function(){
            	var temp = [];
                angular.forEach(scope.addtlColumns,function(col,index){
                    if(col.included){
                        for(i in scope.tableDef){
                            if(scope.tableDef[i].text == col.text){
                                scope.tableDef[i].included = true;
                                scope.gridOptions.initialColumnCount++;
                            }
                        }
                    }
                    else temp.push(col);
                });
                scope.addtlColumns = temp.slice();
            };
            
            scope.setMaxPages();
            scope.adjustPageSize();
            
            scope.selectRow = function(ev,index){
            	if(index != -1){
            		var obj = scope.tableData[((scope.gridOptions.pagination.currentPage-1)*scope.gridOptions.pagination.pageSize)+index];
            		var flag = false;
            		if(angular.isDefined(obj['_id'])){
	            		for(i in scope.selectedItems){
	            			if(scope.selectedItems[i]['_id'].counter == obj['_id'].counter){
	            				scope.selectedItems.splice(i,1);
	            				flag = true;
	            				break;
	            			}
	            		}
            		}
            		else {
            			for(i in scope.selectedItems){
	            			if(scope.selectedItems[i][scope.primaryField] == obj[scope.primaryField]){
	            				scope.selectedItems.splice(i,1);
	            				flag = true;
	            				break;
	            			}
	            		}
            		}
            		if(!flag) {	
            			obj.selected = true;
            			scope.selectedItems.push(obj);
            		}
            		else obj.selected = false;
            	}
            	else {
            		if(scope.config.allSelected){
            			scope.selectedItems = [];
            			angular.forEach(scope.tableData,function(d){
            				d.selected = false;
            			});
            			scope.config.allSelected = false;
            		}
            		else {
            			scope.selectedItems = angular.copy(scope.tableData);
            			angular.forEach(scope.tableData,function(d){
            				d.selected = true;
            			});
            			scope.config.allSelected = true;
            		}
            	}
            };
            
            scope.$watch(function(){
                return scope.tableData;
            },function(newVal,oldVal){
            	scope.setPaginatedData();
            	if(newVal.length!=oldVal.length){
	                if(scope.initData.length == 0){
	                	scope.initData = angular.copy(scope.tableData);
	                }
	                if(scope.gridOptions.allowRowSelect) {
	                	scope.selectedItems = [];
	                	scope.config.allSelected = false;
	                }
	                angular.forEach(scope.tableData,function(rowData){
	                	rowData.selected = false;
	                });
	                scope.adjustPageSize();
	                scope.gridOptions.pagination.currentPage = 1;
	                scope.setMaxPages();
	                if(scope.tableDef.length == 0){
	                	scope.setTableDef();
	                }
            	}                
            },true);
            
            scope.$watch(function(){
                return scope.gridOptions.pagination.currentPage;
            },function(newVal,oldVal){
                scope.setPaginatedData();
            },true);
            
            scope.$watch(function(){
                return scope.gridOptions.pagination.pageSize;
            },function(newVal,oldVal){
            	scope.gridOptions.pagination.currentPage = 1; 
                scope.setMaxPages();
                scope.setPaginatedData();
            },true);
            
            if(scope.gridOptions.allowRowSelect){
            	scope.$watch(function(){
                    return scope.selectedItems;
                },function(newVal,oldVal){
                	if(scope.selectedItems.length < scope.tableData.length){
                    	scope.config.allSelected = false;
                    }
                    else if(scope.selectedItems.length == scope.tableData.length){
                    	scope.config.allSelected = true;
                    }              
                },true);
            }
            
            scope.$watch(function(){
                return scope.filterConfig;
            },function(newVal,oldVal){ 
                var flag;
                if(scope.initData.length>0){
	                scope.tableData = scope.initData.filter(function(data){
	                    flag = true;
	                    for(key in scope.filterConfig){
	                        if(data[key].toLowerCase().indexOf(scope.filterConfig[key].toLowerCase()) == -1) {
	                            flag = false;
	                            break;
	                        };
	                    } 
	                    return flag;
	                });
	                if(scope.tableData.length > scope.gridOptions.pagination.pageSize){
	                    scope.gridOptions.pagination.currentPage = 1; 
	                    scope.setMaxPages();
	                    scope.setPaginatedData();
	                }
	                else {
	                    scope.paginatedData = angular.copy(scope.tableData);
	                }
	                if(scope.gridOptions.allowRowSelect) {
	                	scope.selectedItems = [];
	                	scope.config.allSelected = false;
	                }
                }
            },true);
        }
    }
}]);