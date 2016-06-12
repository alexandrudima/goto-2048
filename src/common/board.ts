
import int = require('../common/int');
import boardElement = require('./boardElement');
import boardCell = require('./boardCell');

export class Board {
	
	private _boardSize: number;
	private _elements: boardElement.BoardElement[][];
	
	constructor(boardSize:number) {
		this._boardSize = boardSize;
		this._elements = [];
		for (var row = 0; row < boardSize; row++) {
			this._elements[row] = [];
			for (var col = 0; col < boardSize; col++) {
				this._elements[row][col] = boardElement.BoardElement.EMPTY;
			}
		}
	}
	
	public set(row:number, column:number, value:boardElement.BoardElement): void {
		this._elements[row][column] = value;
	}
	
	public get(row:number, column:number): boardElement.BoardElement {
		return this._elements[row][column];
	}
	
	public spawn(id:number): void {
		var emptySlots: number[] = [];
		for (var row = 0; row < this._boardSize; row++) {
			for (var col = 0; col < this._boardSize; col++) {
				if (this._elements[row][col].isEmpty) {
					emptySlots.push(row * this._boardSize + col);
				}
			}
		}
		if (emptySlots.length === 0) {
			return;
		}
		var pickedSlot = emptySlots[Board.getRandomInt(0, emptySlots.length)];
		var row = Math.floor(pickedSlot / this._boardSize);
		var col = pickedSlot % this._boardSize;
		
		var pickedValue = Board.getRandomInt(1, 3) * 2;

		this.set(row, col, new boardElement.BoardElement(id, 0, pickedValue));
	}
	
	public static deserialize(data:any): Board {
		var size = data.length;
		var r = new Board(size);
		
		for (var row = 0; row < size; row++) {
			for (var col = 0; col < size; col++) {
				var el = data[row][col];
				r.set(row, col, new boardElement.BoardElement(el.id, el.mergedId, el.value));
			}
		}

		return r;
	}
	
	public serialize(): any {
		var r: any[][] = [];
		for (var row = 0; row < this._boardSize; row++) {
			r[row] = [];
			for (var col = 0; col < this._boardSize; col++) {
				var el = this._elements[row][col];
				r[row][col] = {
					id: el.id,
					mergedId: el.mergedId,
					value: el.value
				};
			}
		}
		return r;
	}
	
	public getCells(): int.IBoardCell[] {
		var r: int.IBoardCell[] = [];
		for (var row = 0; row < this._boardSize; row++) {
			for (var col = 0; col < this._boardSize; col++) {
				var el = this._elements[row][col];
				if (!el.isEmpty) {
					r.push(new boardCell.BoardCell(el.id, row, col, el.value));
					
					if (el.mergedId) {
						r.push(new boardCell.BoardCell(el.mergedId, row, col, 0));
					}
				}
			}
		}
		return r;
	}
	
	private static getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}
	
	public isEmpty(): boolean {
		for (var row = 0; row < this._boardSize; row++) {
			for (var col = 0; col < this._boardSize; col++) {
				if (!this._elements[row][col].isEmpty) {
					return false;
				}
			}
		}
		return true;
	}
	
	public hasEmptyElement(): boolean {
		for (var row = 0; row < this._boardSize; row++) {
			for (var col = 0; col < this._boardSize; col++) {
				if (this._elements[row][col].isEmpty) {
					return true;
				}
			}
		}
		return false;
	}
	
	public isMergeable(): boolean {
		for (var row = 0; row < this._boardSize; row++) {
			for (var col = 0; col < this._boardSize; col++) {
				var myValue = this._elements[row][col].value;
				if (myValue === 0) {
					return true;
				}
				var aboveValue = row > 0 ? this._elements[row - 1][col].value : -1;
				var belowValue = row + 1 < this._boardSize ? this._elements[row + 1][col].value : 1;
				var leftValue = col > 0 ? this._elements[row][col - 1].value : -1;
				var rightValue = col + 1 < this._boardSize ? this._elements[row][col + 1].value : 1;
				if (myValue === aboveValue || myValue === belowValue || myValue === leftValue || myValue === rightValue) {
					return true;
				}
			}
		}
		return false;
	}
}