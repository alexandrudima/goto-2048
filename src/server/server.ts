
import * as express from 'express';
import * as http from 'http';
import * as sio from 'socket.io';
import * as path from 'path';
import {SimpleModel} from '../common/simpleModel';
import {ClientEventType, IClientEvent, ServerEventType, IServerEvent} from '../common/int';
import {IModel, IModelListener} from '../common/model';

let app = express();
app.use(express.static(path.join(__dirname, '../../public')));

let server = http.createServer(app);
let io = sio.listen(server);

server.listen(process.env.PORT || 8000);


let modelsMap: { [gameId: string]: SimpleModel; } = {};

io.sockets.on('connection', function (socket) {

	let send = (event: IServerEvent) => {
		socket.send(event);
	};

	let model: SimpleModel = null;

	let modelListener: IModelListener = {
		onChanged: (model: IModel) => {
			send({
				type: ServerEventType.ModelChanged,
				data: (<SimpleModel>model).serialize()
			});
		}
	};

	function getOrCreateModel(gameId: string): SimpleModel {
		let r = modelsMap[gameId];

		if (!r) {
			r = new SimpleModel(4);
			modelsMap[gameId] = r;
		}

		return r;
	}

	function init(gameId: string): void {
		if (model) {
			model.removeListener(modelListener);
			model = null;
		}

		model = getOrCreateModel(gameId);
		model.addListener(modelListener);
	}
	function reset(gameId: string): void {
		model = getOrCreateModel(gameId);
		model.reset();
	}
	function up(gameId: string): void {
		getOrCreateModel(gameId).up();
	}
	function down(gameId: string): void {
		getOrCreateModel(gameId).down();
	}
	function left(gameId: string): void {
		getOrCreateModel(gameId).left();
	}
	function right(gameId: string): void {
		getOrCreateModel(gameId).right();
	}

	console.log('server got connection');
	socket.on('message', function (msg: IClientEvent) {
		switch (msg.type) {
			case ClientEventType.Init:
				init(msg.data);
				break;
			case ClientEventType.Reset:
				reset(msg.data);
				break;
			case ClientEventType.Up:
				up(msg.data);
				break;
			case ClientEventType.Down:
				down(msg.data);
				break;
			case ClientEventType.Left:
				left(msg.data);
				break;
			case ClientEventType.Right:
				right(msg.data);
				break;
		}
	});

	socket.on('disconnect', function () {
		if (model) {
			model.removeListener(modelListener);
			model = null;
		}
	});
});