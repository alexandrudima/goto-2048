
import {BoardElement} from './boardElement';
import {BoardCell} from './boardCell';

export class Board {

	private _boardSize: number;
	private _elements: BoardElement[][];

	constructor(boardSize: number) {
		this._boardSize = boardSize;
		this._elements = [];
		for (let row = 0; row < boardSize; row++) {
			this._elements[row] = [];
			for (let col = 0; col < boardSize; col++) {
				this._elements[row][col] = BoardElement.EMPTY;
			}
		}
	}

	public set(row: number, column: number, value: BoardElement): void {
		this._elements[row][column] = value;
	}

	public get(row: number, column: number): BoardElement {
		return this._elements[row][column];
	}

	/**
	 * Create a new element randomly (a 2 or a 4)
	 */
	public spawn(id: number): void {
		let emptySlots: number[] = [];
		for (let row = 0; row < this._boardSize; row++) {
			for (let col = 0; col < this._boardSize; col++) {
				if (this._elements[row][col].isEmpty) {
					emptySlots.push(row * this._boardSize + col);
				}
			}
		}
		if (emptySlots.length === 0) {
			return;
		}
		let pickedSlot = emptySlots[Board.getRandomInt(0, emptySlots.length)];
		let row = Math.floor(pickedSlot / this._boardSize);
		let col = pickedSlot % this._boardSize;
		let pickedValue = Board.getRandomInt(1, 3) * 2;
		this.set(row, col, new BoardElement(id, 0, pickedValue));
	}

	public static deserialize(data: SerializedBoard): Board {
		let size = data.length;
		let r = new Board(size);

		for (let row = 0; row < size; row++) {
			for (let col = 0; col < size; col++) {
				let el = data[row][col];
				r.set(row, col, new BoardElement(el.id, el.mergedId, el.value));
			}
		}

		return r;
	}

	public serialize(): SerializedBoard {
		let r: SerializedBoard = [];
		for (let row = 0; row < this._boardSize; row++) {
			r[row] = [];
			for (let col = 0; col < this._boardSize; col++) {
				let el = this._elements[row][col];
				r[row][col] = {
					id: el.id,
					mergedId: el.mergedId,
					value: el.value
				};
			}
		}
		return r;
	}

	public getCells(): BoardCell[] {
		let r: BoardCell[] = [];
		for (let row = 0; row < this._boardSize; row++) {
			for (let col = 0; col < this._boardSize; col++) {
				let el = this._elements[row][col];
				if (!el.isEmpty) {
					r.push(new BoardCell(el.id, row, col, el.value));

					if (el.mergedId) {
						r.push(new BoardCell(el.mergedId, row, col, 0));
					}
				}
			}
		}
		return r;
	}

	private static getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	public hasEmptyElement(): boolean {
		for (let row = 0; row < this._boardSize; row++) {
			for (let col = 0; col < this._boardSize; col++) {
				if (this._elements[row][col].isEmpty) {
					return true;
				}
			}
		}
		return false;
	}

	public isMergeable(): boolean {
		for (let row = 0; row < this._boardSize; row++) {
			for (let col = 0; col < this._boardSize; col++) {
				let myValue = this._elements[row][col].value;
				if (myValue === 0) {
					return true;
				}
				let aboveValue = row > 0 ? this._elements[row - 1][col].value : -1;
				let belowValue = row + 1 < this._boardSize ? this._elements[row + 1][col].value : 1;
				let leftValue = col > 0 ? this._elements[row][col - 1].value : -1;
				let rightValue = col + 1 < this._boardSize ? this._elements[row][col + 1].value : 1;
				if (myValue === aboveValue || myValue === belowValue || myValue === leftValue || myValue === rightValue) {
					return true;
				}
			}
		}
		return false;
	}
}

export interface SerializedElement {
	id: number;
	mergedId: number;
	value: number;
}

export type SerializedBoard = SerializedElement[][];
