
import {BoardCell} from './boardCell';
import {SerializedBoard} from './board';

export interface IModelListener {
	onChanged(model: IModel);
}

export interface IModel {
	isFinished: boolean;

	addListener(listener: IModelListener): void;
	removeListener(listener: IModelListener): void;

	getCells(): BoardCell[];

	reset(): void;
	up(): void;
	down(): void;
	left(): void;
	right(): void;
}

// Events sent by the client
export enum ClientEventType {
	Init,
	Reset,
	Up,
	Down,
	Left,
	Right
}
export interface IClientEvent {
	type: ClientEventType;
	data: any;
}

// Events sent by the server
export enum ServerEventType {
	ModelChanged
}
export interface IServerEvent {
	type: ServerEventType;
	data: SerializedBoard;
}
