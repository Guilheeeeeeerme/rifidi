(function () {
	'use strict';

	var app = angular.module('rifidi');

	app.controller('RifiController', RifiController);

	RifiController.$inject = ['$scope'];

	function RifiController($scope) {
		var socket = io.connect('http://localhost:3000');
		var self = this;

		$scope.dados = {
			tags: [],
		};

		self.onUpdate = onUpdate;
		self.onRemove = onRemove;

		socket.on('connect', connect);
		socket.on('highlight', highlight);
		socket.on('highlight2', highlight2);
		socket.on('onChange', onChange);
		socket.on('onServerUpdate', onServerUpdate);
		socket.on('onCheckout', onCheckout);

		function connect(data) {
			console.log('connected');
		}
		
		function onCheckout(checkout){
			$scope.dados.checkout = checkout;
			$scope.$apply();

		}

		function highlight (highlight) {
			$scope.dados.highlight = highlight;
			$scope.$apply();
		}

		function highlight2(highlight2) {
			$scope.dados.highlight2 = highlight2;
			$scope.$apply();
		}

		function onServerUpdate(tags) {
			$scope.dados.tags = tags;
			$scope.$apply();
		}

		function onChange(_tags) {
			let flag = false;

			for (var tag of _tags) {
				flag = false;

				for (var tag1 of $scope.dados.tags) {
					if (tag.id == tag1.id) {
						flag = true;
						break;
					}
				}

				if (!flag) {
					$scope.dados.tags.push(tag);
				}

			}

			$scope.$apply();

		}

		function onUpdate() {
			socket.emit('onUpdate', $scope.dados.tags);
		}

		function onRemove(tag) {
			socket.emit('onRemove', tag);
		}

	}

})();