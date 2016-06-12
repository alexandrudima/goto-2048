
import int = require('../common/int');
import boardCell = require('./boardCell');
import boardElement = require('./boardElement');
import board = require('./board');

export class Model implements int.IModel {

	private _boardSize: number;
	private _board: board.Board;
	private _listeners: int.IModelListener[];
	private _lastElementId: number;
	
	constructor(boardSize: number) {
		this._boardSize = boardSize;
		this._listeners = [];
		this._lastElementId = 0;
		this._setBoard(new board.Board(this._boardSize));
	}
	
	public addListener(listener:int.IModelListener): void {
		for (var i = 0; i < this._listeners.length; i++) {
			if (this._listeners[i] === listener) {
				// Don't add the same listener twice
				return;
			}
		}
		this._listeners.push(listener);
		listener.onChanged(this);
	}
	
	public removeListener(listener:int.IModelListener): void {
		for (var i = 0; i < this._listeners.length; i++) {
			if (this._listeners[i] === listener) {
				this._listeners.splice(i, 1);
				return;
			}
		}
	}
	
	public serialize(): any {
		return this._board.serialize();
	}
	
	public getCells(): int.IBoardCell[] {
		return this._board.getCells();
	}
	
	public get isFinished(): boolean {
		return !this._board.hasEmptyElement() && !this._board.isMergeable();
	}
	
	public reset(): void {
		this._setBoard(new board.Board(this._boardSize));
	}
	
	public up(): void {
		var newBoard = new board.Board(this._boardSize);
		for (var col = 0; col < this._boardSize; col++) {
			var rows = Model._mergeValues(this._extractNonZeroRows(col, false));
			for (var row = 0; row < rows.length; row++) {
				newBoard.set(row, col, rows[row]);
			}
		}
		this._setBoard(newBoard);
	}
	
	public down(): void {
		var newBoard = new board.Board(this._boardSize);
		for (var col = 0; col < this._boardSize; col++) {
			var rows = Model._mergeValues(this._extractNonZeroRows(col, true));
			for (var row = 0; row < rows.length; row++) {
				newBoard.set(this._boardSize - row - 1, col, rows[row]);
			}
		}
		this._setBoard(newBoard);
	}
	
	public left(): void {
		var newBoard = new board.Board(this._boardSize);
		for (var row = 0; row < this._boardSize; row++) {
			var columns = Model._mergeValues(this._extractNonZeroColumns(row, false));
			for (var col = 0; col < columns.length; col++) {
				newBoard.set(row, col, columns[col]);
			}
		}
		this._setBoard(newBoard);
	}
	
	public right(): void {
		var newBoard = new board.Board(this._boardSize);
		for (var row = 0; row < this._boardSize; row++) {
			var columns = Model._mergeValues(this._extractNonZeroColumns(row, true));
			for (var col = 0; col < columns.length; col++) {
				newBoard.set(row, this._boardSize - col - 1, columns[col]);
			}
		}
		this._setBoard(newBoard);
	}
	
	private _setBoard(newBoard:board.Board) {
		newBoard.spawn(++this._lastElementId);
		this._board = newBoard;
		var listeners = this._listeners.slice(0);
		for (var i = 0; i < listeners.length; i++) {
			listeners[i].onChanged(this);
		}
	}
	
	private _extractNonZeroRows(col:number, reverse:boolean): boardElement.BoardElement[] {
		var values: boardElement.BoardElement[] = [];
		for (var row = 0; row < this._boardSize; row++) {
			var el = this._board.get(row, col);
			if (!el.isEmpty) {
				values.push(el);
			}
		}
		if (reverse) {
			values.reverse();
		}
		return values;
	}
	
	private _extractNonZeroColumns(row:number, reverse:boolean): boardElement.BoardElement[] {
		var values: boardElement.BoardElement[] = [];
		for (var col = 0; col < this._boardSize; col++) {
			var el = this._board.get(row, col);
			if (!el.isEmpty) {
				values.push(el);
			}
		}
		if (reverse) {
			values.reverse();
		}
		return values;
	}
	
	private static _mergeValues(values:boardElement.BoardElement[]): boardElement.BoardElement[] {
		var r: boardElement.BoardElement[] = [];
		var previous = boardElement.BoardElement.EMPTY;
		for (var i = 0; i < values.length; i++) {
			if (previous.isEmpty) {
				previous = values[i];
			} else if (previous.canMerge(values[i])) {
				r.push(previous.merge(values[i]));
				previous = boardElement.BoardElement.EMPTY;
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
