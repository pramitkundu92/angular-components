/* Plugin build on top of google charts for use in angular JS applications. Supports multiple types of charts based
 * on a single data set supplied. Data is formatted into the order -
 *  
 * ID 		Category1 	Category2 	Category3 ...
 * 
 * Label1	Value11		Value12		Value13   ...
 * Label2	Value21		Value22		Value23   ...
 * Label3   Value31		Value32		Value33   ...
 * 
 * and so on..
 */
var charts = angular.module('dpdx.charts',[]);

charts.directive('dpdxCharts',[function(){
	return {
		restrict: 'E',
		scope: {
			data: '='
		},
		template:  '<div style="margin: 0 0 20px 20px;">' +
				   /*'	<div> ' +
				   '		<md-input-container class="flex-40">' +
				   '			<label>Select Chart Type</label>' +
				   '			<md-select ng-model="::selectedType">' +
				   '				<md-option ng-repeat="c in chartTypes" value="{{::c.label}}">{{::c.label}}</md-option>' +
				   '			</md-select>' +
				   '		</md-input-container>' +
				   '	</div>' +*/
				   '	<div id="{{chartId}}"></div>' +
				   '</div>',
		link: function(scope,elem,attrs){
			scope.chartId = 'Chart_' + new Date().getTime();
			
			google.charts.load('current', {packages: ['corechart']});
			google.charts.setOnLoadCallback(drawChart);
			
			/* Provision for chart types for each chart, not used currently */
			scope.chartTypes = [{
				label: 'Column Chart',
				type: 'ColumnChart'
			}, {
				label: 'Bar Chart',
				type: 'BarChart'
			}, {
				label: 'Area Chart',
				type: 'AreaChart'
			}, {
				label: 'Line Chart',
				type: 'LineChart'
			}, {
				label: 'Pie Chart',
				type: 'PieChart'
			}, {
				label: 'Donut Chart',
				type: 'PieChart'
			}, {
				label: 'Scatter Chart',
				type: 'ScatterChart'
			}, {
				label: 'Bubble Chart',
				type: 'BubbleChart'
			}];
			for(i in scope.chartTypes){
				if(scope.chartTypes[i].type == scope.data.type){
					scope.selectedType = scope.chartTypes[i].label;
					break;
				}
			}
			/* Provision for chart types for each chart, not used currently */
			
			scope.$watch(function(){
				return scope.selectedType;
			},function(newVal,oldVal){
				if(newVal != oldVal){
					for(i in scope.chartTypes){
						if(scope.chartTypes[i].label == newVal){
							scope.data.type = scope.chartTypes[i].type;
							break;
						}
					}
					if(newVal == 'Donut Chart'){
						drawChart({pieHole: 0.5});
					}
					else drawChart();
				}
			},true);
			scope.$watch(function(){
				return scope.data;
			},function(newVal,oldVal){
				if(newVal != oldVal){
					if(scope.data.special){
						drawChart({pieHole: 0.5});
					}
					else drawChart();
				}
			},true);

			function drawChart(extras){
				setTimeout(function(){
					var table = [],temp;
					table[0] = ['ID'];
					angular.forEach(scope.data.categories,function(c){
						table[0].push(c);
					});
					angular.forEach(scope.data.data,function(d){
						temp = [d.label];
						if(d.value.constructor === Array){
							angular.forEach(d.value,function(val){
								temp.push(parseFloat(val));
							});						
						}
						else temp.push(parseFloat(d.value));
						table.push(temp);
					});
					var data = google.visualization.arrayToDataTable(table);
	    		
	    		    var options = {
	    		      title: scope.data.title,
	    		      width: scope.data.config.width,
	    		      height: scope.data.config.height,
	    		      isStacked: true,
	    		      hAxis: {
	    		        title: scope.data.config.hAxis
	    		      },
	    		      vAxis: {
	    		        title: scope.data.config.vAxis
	    		      },
	    		      curveType: scope.data.config.curveType
	    		    };
	    		    if(angular.isDefined(extras)){
	    		    	for(key in extras){
	    		    		options[key] = extras[key];
	    		    	}
	    		    };
	    		    function selectHandler() {
	    	            var selectedItem = chart.getSelection()[0];
	    	            if (selectedItem) {
	    	            	console.log(data.getValue(selectedItem.row, 0) + ',' + data.getValue(selectedItem.row, 1));
	    	            }
	    	        }
	    		    var chart = new google.visualization[scope.data.type](document.getElementById(scope.chartId));
	    		    google.visualization.events.addListener(chart, 'select', selectHandler); 
	    		    chart.draw(data, options);
				},500);
			};
		}
	};
}]);
