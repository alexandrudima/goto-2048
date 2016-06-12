
import {IModel, IModelListener} from './model';
import {BoardCell} from './boardCell';
import {BoardElement} from './boardElement';
import {Board, SerializedBoard} from './board';

export class SimpleModel implements IModel {

	private _boardSize: number;
	private _board: Board;
	private _listeners: IModelListener[];
	private _lastElementId: number;

	constructor(boardSize: number) {
		this._boardSize = boardSize;
		this._listeners = [];
		this._lastElementId = 0;
		this._setBoard(new Board(this._boardSize));
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

	public serialize(): SerializedBoard {
		return this._board.serialize();
	}

	public getCells(): BoardCell[] {
		return this._board.getCells();
	}

	public get isFinished(): boolean {
		return !this._board.hasEmptyElement() && !this._board.isMergeable();
	}

	public reset(): void {
		this._setBoard(new Board(this._boardSize));
	}

	public up(): void {
		let newBoard = new Board(this._boardSize);
		for (let col = 0; col < this._boardSize; col++) {
			let rows = SimpleModel._mergeValues(this._extractNonZeroRows(col, false));
			for (let row = 0; row < rows.length; row++) {
				newBoard.set(row, col, rows[row]);
			}
		}
		this._setBoard(newBoard);
	}

	public down(): void {
		let newBoard = new Board(this._boardSize);
		for (let col = 0; col < this._boardSize; col++) {
			let rows = SimpleModel._mergeValues(this._extractNonZeroRows(col, true));
			for (let row = 0; row < rows.length; row++) {
				newBoard.set(this._boardSize - row - 1, col, rows[row]);
			}
		}
		this._setBoard(newBoard);
	}

	public left(): void {
		let newBoard = new Board(this._boardSize);
		for (let row = 0; row < this._boardSize; row++) {
			let columns = SimpleModel._mergeValues(this._extractNonZeroColumns(row, false));
			for (let col = 0; col < columns.length; col++) {
				newBoard.set(row, col, columns[col]);
			}
		}
		this._setBoard(newBoard);
	}

	public right(): void {
		let newBoard = new Board(this._boardSize);
		for (let row = 0; row < this._boardSize; row++) {
			let columns = SimpleModel._mergeValues(this._extractNonZeroColumns(row, true));
			for (let col = 0; col < columns.length; col++) {
				newBoard.set(row, this._boardSize - col - 1, columns[col]);
			}
		}
		this._setBoard(newBoard);
	}

	private _setBoard(newBoard: Board) {
		newBoard.spawn(++this._lastElementId);
		this._board = newBoard;
		let listeners = this._listeners.slice(0);
		for (let i = 0; i < listeners.length; i++) {
			listeners[i].onChanged(this);
		}
	}

	private _extractNonZeroRows(col: number, reverse: boolean): BoardElement[] {
		let values: BoardElement[] = [];
		for (let row = 0; row < this._boardSize; row++) {
			let el = this._board.get(row, col);
			if (!el.isEmpty) {
				values.push(el);
			}
		}
		if (reverse) {
			values.reverse();
		}
		return values;
	}

	private _extractNonZeroColumns(row: number, reverse: boolean): BoardElement[] {
		let values: BoardElement[] = [];
		for (let col = 0; col < this._boardSize; col++) {
			let el = this._board.get(row, col);
			if (!el.isEmpty) {
				values.push(el);
			}
		}
		if (reverse) {
			values.reverse();
		}
		return values;
	}

	private static _mergeValues(values: BoardElement[]): BoardElement[] {
		let r: BoardElement[] = [];
		let previous = BoardElement.EMPTY;
		for (let i = 0; i < values.length; i++) {
			if (previous.isEmpty) {
				previous = values[i];
			} else if (previous.canMerge(values[i])) {
				r.push(previous.merge(values[i]));
				previous = BoardElement.EMPTY;
			} else {
				r.push(previous);
				previous = values[i];
			}
		}
		if (!previous.isEmpty) {
			r.push(previous);
		}
		return r;
	}
}
