
import {SerializedBoard} from './board';

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
