import int = require('../common/int');

export class BoardCell implements int.IBoardCell {
	private _id: number;
	private _row: number;
	private _col: number;
	private _value: number;
	
	constructor(id: number, row: number, col: number, value: number) {
		this._id = id;
		this._row = row;
		this._col = col;
		this._value = value;
	}
	
	public get id(): number {
		return this._id;
	}
	
	public get row(): number {
		return this._row;
	}
	
	public get col(): number {
		return this._col;
	}
	
	public get value(): number {
		return this._value;
	}
}