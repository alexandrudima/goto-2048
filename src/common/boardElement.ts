
export class BoardElement {

	public static EMPTY = new BoardElement(0, 0, 0);

	private _id: number;
	private _mergedId: number;
	private _value: number;

	constructor(id: number, mergedId: number, value: number) {
		this._id = id;
		this._mergedId = mergedId;
		this._value = value;
	}

	public get value(): number {
		return this._value;
	}

	public get id(): number {
		return this._id;
	}

	public get mergedId(): number {
		return this._mergedId;
	}

	public get isEmpty(): boolean {
		return this._value === 0;
	}

	public canMerge(other: BoardElement): boolean {
		return this._value === other._value;
	}

	public merge(other: BoardElement): BoardElement {
		return new BoardElement(this._id, other._id, this._value + other._value);
	}
}