
import {ClientEventType, IClientEvent, ServerEventType, IServerEvent} from '../common/int';
import {Board, SerializedBoard} from '../common/board';
import {BoardCell} from '../common/boardCell';
import {IModel, IModelListener} from '../common/model';

export class RemoteModel implements IModel {

	private _socket: SocketIOClient.Socket;
	private _gameId: string;
	private _board: Board;
	private _listeners: IModelListener[];

	constructor(socket: SocketIOClient.Socket, gameId: string) {
		this._socket = socket;
		this._gameId = gameId;

		socket.on('message', (data) => this._onMessage(data));
		this._sendEvent({
			type: ClientEventType.Init,
			data: gameId
		});
		this._listeners = [];
		this._board = new Board(4);
	}

	private _sendEvent(event: IClientEvent): void {
		this._socket.emit('message', event);
	}

	public addListener(listener: IModelListener): void {
		for (let i = 0; i < this._listeners.length; i++) {
			if (this._listeners[i] === listener) {
				// Don't add the same listener twice
				return;
			}
		}
		this._listeners.push(listener);
		listener.onChanged(this);
	}

	public removeListener(listener: IModelListener): void {
		for (let i = 0; i < this._listeners.length; i++) {
			if (this._listeners[i] === listener) {
				this._listeners.splice(i, 1);
				return;
			}
		}
	}

	private _onMessage(data: IServerEvent): void {
		switch (data.type) {
			case ServerEventType.ModelChanged:
				this._onServerModelChanged(data.data);
				break;
		}
	}

	private _onServerModelChanged(data: SerializedBoard): void {
		this._board = Board.deserialize(data);

		let listeners = this._listeners.slice(0);
		for (let i = 0; i < listeners.length; i++) {
			listeners[i].onChanged(this);
		}
	}

	public get isFinished(): boolean {
		return !this._board.hasEmptyElement() && !this._board.isMergeable();
	}

	public getCells(): BoardCell[] {
		return this._board.getCells();
	}

	public reset(): void {
		this._sendEvent({
			type: ClientEventType.Reset,
			data: this._gameId
		});
	}

	public up(): void {
		this._sendEvent({
			type: ClientEventType.Up,
			data: this._gameId
		});
	}

	public down(): void {
		this._sendEvent({
			type: ClientEventType.Down,
			data: this._gameId
		});
	}

	public left(): void {
		this._sendEvent({
			type: ClientEventType.Left,
			data: this._gameId
		});
	}

	public right(): void {
		this._sendEvent({
			type: ClientEventType.Right,
			data: this._gameId
		});
	}
}
