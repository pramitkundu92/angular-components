/*Tree structure component, allows user to create a hierarchical tree based on the json tree structure provided to the directive
user can provide click functions to be executed when a node is clicked, and selection of nodes can be configured as well.

Author: Pramit Kundu
*/

var treeModule = angular.module('angular.tree',['ngMaterial','ngAnimate']);

treeModule.directive('angularTree',['$compile','$rootScope',function($compile,$rootScope){
  return {
    restrict: 'E',
    replace: 'true',
    scope: {
        nodes: '=',
        showCheckbox: '=?',
        leavesSelected: '=?',
        onNodeSelect: '&'
    },  
    template: '<md-list class="tree">' +
                '<md-list-item ng-repeat="nodeData in nodes">' +
                    '<node node="nodeData" on-select="nodeSelected(node)" show-checkbox="showCheckbox"></node>' +
                '</md-list-item>' +
              '</md-list>',
    link: function(scope,elem,attrs){
      $rootScope.selectedNode = undefined;
      scope.show = function(){
        console.log(scope.nodes);  
      };
      scope.nodeSelected = function(node){
          scope.onNodeSelect({node: node});          
      };
      if(angular.isUndefined(scope.showCheckbox)){
    	  scope.showCheckbox = true;
      }
      if(angular.isUndefined(scope.leavesSelected)){
          scope.leavesSelected = [];
      }
      scope.$on('$leafSelected',function(event,node){
    	  var flag = true;
    	  for(i in scope.leavesSelected){
    		  if(scope.leavesSelected[i].text == node.text){
    			  flag = false;
    			  break;
    		  }
    	  }
    	  if(flag) {
    		  scope.leavesSelected.push(node);
    	  }
      });
      scope.$on('$leafDeselected',function(event,node){
    	  var tempList = [];
    	  for(i in scope.leavesSelected){
    		  if(scope.leavesSelected[i].text != node.text){
    			  tempList.push(scope.leavesSelected[i]);
    		  }
    	  }
    	  scope.leavesSelected = tempList.slice();
      });
    }
  };
}]);

treeModule.directive('node',['$compile','$rootScope',function($compile,$rootScope){
  return {
    restrict: 'E',
    replace: true,
    scope: {
        node: '=',
        showCheckbox: '=?',
        onSelect: '&'  
    },  
    templateUrl: 'tree/partials/tree.html' ,
    link: function(scope,elem,attrs){
      scope.toggle = function(){
          scope.node.showNodes = !scope.node.showNodes; 
      };
      scope.toggleSelected = function(){
    	  scope.node.selected = !scope.node.selected;
    	  $rootScope.selectedNode = scope.node;
      };
      if(angular.isUndefined(scope.node.showNodes)){          
          scope.node.showNodes = true; 
      }
      if(angular.isUndefined(scope.node.selected)){
    	  scope.node.selected = false;  
      }
      if(angular.isUndefined(scope.node.removed)){
          scope.node.removed = false;  
      }     
      if(scope.node.children.length>0){
         scope.node.showNodes = true;
         elem.append('<md-list class="child tree" ng-if="node.showNodes">' +
                        '<md-list-item ng-repeat="nodeData in node.children">' + 
                            '<node node="nodeData" on-select="nodeSelected(node)" show-checkbox="showCheckbox"></node>' +
                        '</md-list-item>' +
                    '</md-list></div>');
        $compile(elem.contents())(scope);
      }
      scope.nodeSelected = function(node){
          scope.onSelect({node: node});
      };
      scope.getDisplayText = function(text){
      	  var str;
          if(angular.isDefined(text)){
          	if(text.length>18){
                  str = text.substring(0,18) + '...';
              }
              else str = text;
          }
          else str = '';
          return str;
      };
      scope.$watch(function(){
    	  return scope.node.selected;
      },function(newVal,oldVal){
    	  if(scope.node.children.length>0){
    	      angular.forEach(scope.node.children,function(childNode){
    	    	  childNode.selected = scope.node.selected;
    	      });  	  
    	  }
    	  else {
    		  if(newVal) {
    			  scope.$emit('$leafSelected',scope.node);
    		  }
    		  else {
    			  scope.$emit('$leafDeselected',scope.node);
    		  }
    	  }
      },true);
    }
  };
}]);