
import _model = require('../common/simpleModel');
import remoteModel = require('./remoteModel');
import int = require('../common/int');
import view = require('./view');

var createdModels: int.IModel[] = [];

document.addEventListener('keydown', function (e) {
	switch (e.keyCode) {
		case 38: // UP ARROW
			createdModels.forEach(m => m.up());
			e.preventDefault();
			break;

		case 39: // RIGHT ARROW
			createdModels.forEach(m => m.right());
			e.preventDefault();
			break;

		case 40: // DOWN ARROW
			createdModels.forEach(m => m.down());
			e.preventDefault();
			break;

		case 37: // LEFT ARROW
			createdModels.forEach(m => m.left());
			e.preventDefault();
			break;
	}
});

export function create(domNode: HTMLElement) {
	console.log('create!');

	var model = new _model.SimpleModel(4);
	createdModels.push(model);
	var v = new view.View(domNode, model);
}

export function createMultiplayer(domNode: HTMLElement, io: SocketIOStatic) {
	console.log('createMultiplayer!');

	if (location.hash === '') {
		// Generate a new hash
		var guid = (function () {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return function () {
				return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
			};
		})();
		location.hash = guid();
	}
	var gameId = location.hash;

	var socket = io.connect((<any>location).origin);
	var model = new remoteModel.RemoteModel(socket, gameId);
	createdModels.push(model);
	var v = new view.View(domNode, model);
}