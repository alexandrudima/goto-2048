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
