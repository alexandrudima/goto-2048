
import {SimpleModel} from '../common/simpleModel';
import {RemoteModel} from './remoteModel';
import {View} from './view';
import {IModel} from '../common/model';

declare var $;

let createdModels: IModel[] = [];

let up = () => createdModels.forEach(m => m.up());
let right = () => createdModels.forEach(m => m.right());
let down = () => createdModels.forEach(m => m.down());
let left = () => createdModels.forEach(m => m.left());

document.addEventListener('keydown', function (e) {
	const LEFT_ARROW = 37;
	const UP_ARROW = 38;
	const RIGHT_ARROW = 39;
	const DOWN_ARROW = 40;

	if (e.keyCode === LEFT_ARROW) {
		left();
		e.preventDefault();
	} else if (e.keyCode === UP_ARROW) {
		up();
		e.preventDefault();
	} else if (e.keyCode === RIGHT_ARROW) {
		right();
		e.preventDefault();
	} else if (e.keyCode === DOWN_ARROW) {
		down();
		e.preventDefault();
	}
});

$("body").swipe({
	//Generic swipe handler for all directions
	swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
		if (direction === 'left') {
			left();
		} else if (direction === 'up') {
			up();
		} else if (direction === 'right') {
			right();
		} else if (direction === 'down') {
			down();
		}
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
