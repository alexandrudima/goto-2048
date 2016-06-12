/// <reference path="../../lib/socket.io-client.d.ts" />

import int = require('../common/int');
import board = require('../common/board');

export class RemoteModel implements int.IModel {

	private _socket: SocketIOClient.Socket;
	private _gameId: string;
	private _board: board.Board;
	private _listeners: int.IModelListener[];

	constructor(socket: SocketIOClient.Socket, gameId: string) {
		this._socket = socket;
		this._gameId = gameId;

		socket.on('message', (data) => this._onMessage(data));
		this._sendEvent({
			type: int.ClientEventType.Init,
			data: gameId
		});
		this._listeners = [];
		this._board = new board.Board(4);
	}

	private _sendEvent(event: int.IClientEvent): void {
		this._socket.emit('message', event);
	}

	public addListener(listener: int.IModelListener): void {
		for (var i = 0; i < this._listeners.length; i++) {
			if (this._listeners[i] === listener) {
				// Don't add the same listener twice
				return;
			}
		}
		this._listeners.push(listener);
		listener.onChanged(this);
	}

	public removeListener(listener: int.IModelListener): void {
		for (var i = 0; i < this._listeners.length; i++) {
			if (this._listeners[i] === listener) {
				this._listeners.splice(i, 1);
				return;
			}
		}
	}

	private _onMessage(data: int.IServerEvent): void {
		switch (data.type) {
			case int.ServerEventType.ModelChanged:
				this._onServerModelChanged(data.data);
				break;
		}
	}

	private _onServerModelChanged(data: any): void {
		this._board = board.Board.deserialize(data);

		var listeners = this._listeners.slice(0);
		for (var i = 0; i < listeners.length; i++) {
			listeners[i].onChanged(this);
		}
	}

	public get isFinished(): boolean {
		return !this._board.hasEmptyElement() && !this._board.isMergeable();
	}

	public getCells(): int.IBoardCell[] {
		return this._board.getCells();
	}

	public reset(): void {
		this._sendEvent({
			type: int.ClientEventType.Reset,
			data: this._gameId
		});
	}

	public up(): void {
		this._sendEvent({
			type: int.ClientEventType.Up,
			data: this._gameId
		});
	}

	public down(): void {
		this._sendEvent({
			type: int.ClientEventType.Down,
			data: this._gameId
		});
	}

	public left(): void {
		this._sendEvent({
			type: int.ClientEventType.Left,
			data: this._gameId
		});
	}

	public right(): void {
		this._sendEvent({
			type: int.ClientEventType.Right,
			data: this._gameId
		});
	}
}