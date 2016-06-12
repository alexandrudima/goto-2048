
import {BoardCell} from './boardCell';

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

export enum ClientEventType {
	Init,
	Reset,
	Up,
	Down,
	Left,
	Right
}

export enum ServerEventType {
	ModelChanged
}

export interface IClientEvent {
	type: ClientEventType;
	data: any;
}

export interface IServerEvent {
	type: ServerEventType;
	data: any;
}