var app = angular.module('testApp',['ngAnimate','ngMaterial','ngMessages','angular.grid','angular.tree','angular.datatable','angular.charts']);

app.controller('AppCtrl',['$scope',function($scope){
    $scope.title = 'Hello';
    
    var dataSet = [{
        label: 'Label A',
        value: 30
    }, {
        label: 'Label B',
        value: 20
    }, {
        label: 'Label C',
        value: 50
    }];
    $scope.chartData = {
        title: 'Chart demo',
        type: 'BarChart',
        config: {
            vAxis: 'Label',
            hAxis: 'Value',
            height: 300,
            width: 400
        },
        categories: ['Category'],
        data: dataSet,
        initData: dataSet
    };
    
    $scope.dataSet = [];
    for(var i=0;i<100;i++){
        $scope.dataSet.push({
            fieldA: 'value A',
            fieldB: 'value B',
            fieldC: 'value C',
            fieldD: 'value D'
        });
    }
    
    $scope.datatableColumns = ['fieldA','fieldB','fieldC','fieldD','fieldE','fieldF'];
    $scope.datatableData = [{
        fieldA: 'value A',
        fieldB: 'value B',
        fieldC: 'value C',
        fieldD: 'value D',
        fieldE: 'value E',
        fieldF: 'value F',
        children: [],
        level: 0
    }, {
        fieldA: 'value A',
        fieldB: 'value B',
        fieldC: 'value C',
        fieldD: 'value D',
        fieldE: 'value E',
        fieldF: 'value F',
        level: 0,
        children: [{
            fieldA: 'value A',
            fieldB: 'value B',
            fieldC: 'value C',
            fieldD: 'value D',
            fieldE: 'value E',
            fieldF: 'value F',
            children: [{
                fieldA: 'value A',
                fieldB: 'value B',
                fieldC: 'value C',
                fieldD: 'value D',
                fieldE: 'value E',
                fieldF: 'value F',
                children: [],
                level: 2
            }],
            level: 1
        }, {
            fieldA: 'value A',
            fieldB: 'value B',
            fieldC: 'value C',
            fieldD: 'value D',
            fieldE: 'value E',
            fieldF: 'value F',
            children: [],
            level: 1
        }, {
            fieldA: 'value A',
            fieldB: 'value B',
            fieldC: 'value C',
            fieldD: 'value D',
            fieldE: 'value E',
            fieldF: 'value F',
            children: [],
            level: 1
        }, {
            fieldA: 'value A',
            fieldB: 'value B',
            fieldC: 'value C',
            fieldD: 'value D',
            fieldE: 'value E',
            fieldF: 'value F',
            children: [{
                fieldA: 'value A',
                fieldB: 'value B',
                fieldC: 'value C',
                fieldD: 'value D',
                fieldE: 'value E',
                fieldF: 'value F',
                children: [],
                level: 2
            }],
            level: 1
        }]
    }, {
        fieldA: 'value A',
        fieldB: 'value B',
        fieldC: 'value C',
        fieldD: 'value D',
        fieldE: 'value E',
        fieldF: 'value F',
        children: [],
        level: 0
    }];
    
    $scope.treeData = [{
        text: 'Parent',
        path: '/parent',
        selected: false,
        children: [{
            text: 'Child1',
            selected: false,
            path: '/parent/child1',
            children: []
        }, {
            text: 'Child2',
            selected: false,
            path: '/parent/child2',
            children: [{
                text: 'GrandChild1',
                selected: false,
                path: '/parent/child2/gc1',
                children: []
            }, {
                text: 'GrandChild2',                
                selected: false,
                path: '/parent/child2/gc2',
                children: []
            }, {
                text: 'GrandChild3',
                selected: false,
                path: '/parent/child2/gc3',
                children: []
            }, {
                text: 'GrandChild4',
                selected: false,
                path: '/parent/child2/gc4',
                children: []
            }]
        }, {
            text: 'Child3',
            selected: false,
            path: '/parent/child3',
            children: []
        }]
    }];
    
    $scope.onNodeSelect = function(node){
        console.log(node);
    };
    
    $scope.treeData[0].selected = true;
}]);