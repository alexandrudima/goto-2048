
import {SimpleModel} from '../common/simpleModel';
import {RemoteModel} from './remoteModel';
import {View} from './view';
import {IModel} from '../common/model';

let createdModels: IModel[] = [];

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

	let model = new SimpleModel(4);
	createdModels.push(model);
	let v = new View(domNode, model);
}

export function createMultiplayer(domNode: HTMLElement, io: SocketIOStatic) {
	console.log('createMultiplayer!');

	if (location.hash === '') {
		// Generate a new hash
		let guid = (function () {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
			}
			return function () {
				return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
			};
		})();
		location.hash = guid();
	}
	let gameId = location.hash;

	let socket = io.connect(location.origin);
	let model = new RemoteModel(socket, gameId);
	createdModels.push(model);
	let v = new View(domNode, model);
}
